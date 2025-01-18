import "dotenv/config";
import pLimit from "p-limit";
import { PutObjectCommand } from "@aws-sdk/client-s3";

import getKeystoneContext from "../../getKeystoneContext";
import serverLog from "../../utils/serverLog";
import { s3Client } from "../../lib/r2client";
import { POKEMON_R2_STORAGE_PATH } from "../../constants/tcg/pokemon";
import fileExistsOnR2 from "../../utils/fileExistsOnR2";

// Command line flags
const args = process.argv.slice(2);
const forceUpload = args.includes("--force-update");
const onlyMissingLocals = args.includes("--only-missing-locals");

// Pagination + concurrency
const BATCH_SIZE = 200;
const MAX_RETRIES = 3;
const DELAY_BETWEEN_RETRIES_MS = 500;
const CONCURRENCY_LIMIT = 10;

const limit = pLimit(CONCURRENCY_LIMIT);

async function fetchAndUploadPokemonSetsImages() {
  serverLog("🚀 Starting the Pokémon set image fetch/upload process...");

  // Keystone context
  const ksContext = await getKeystoneContext({ sudo: true });
  serverLog("✅ Keystone context ready.");

  // If --only-missing-locals is passed, only handle sets missing local URLs
  const whereClause = onlyMissingLocals
    ? {
        OR: [
          { logoStorageUrl: { equals: null } },
          { symbolStorageUrl: { equals: null } },
        ],
      }
    : {};

  // Count how many sets to process
  const totalSets = await ksContext.db.PokemonSet.count({ where: whereClause });
  serverLog(`🔍 Total sets to process: ${totalSets}`);

  let offset = 0;

  // Track failures
  const failedImages: Array<{
    setId: string;
    setName: string;
    imageUrl: string;
    type: "404" | "error";
  }> = [];

  // Tally how many we’ve uploaded
  let totalLogoUploaded = 0;
  let totalSymbolUploaded = 0;

  try {
    while (true) {
      // 1) Fetch next batch
      serverLog(
        `\n🔎 Fetching batch of up to ${BATCH_SIZE}, offset = ${offset}`,
      );
      const sets = await ksContext.query.PokemonSet.findMany({
        where: whereClause,
        take: BATCH_SIZE,
        skip: offset,
        query: `
          id
          tcgSetId
          language
          name
          logoApiUrl
          symbolApiUrl
          logoStorageUrl
          symbolStorageUrl
        `,
      });

      if (sets.length === 0) {
        serverLog("✅ No more sets in this batch. Exiting loop...");
        break;
      }

      offset += BATCH_SIZE;
      serverLog(`🔍 Processing this batch of ${sets.length} sets...`);

      // 2) Process each set's logo/symbol concurrently
      const tasks = sets.flatMap((set) => {
        const tasksForThisSet: Array<Promise<void>> = [];

        // We'll store images in: /img/tcg/pokemon/sets/{language}/{tcgSetId}/logo.png
        // and /img/tcg/pokemon/sets/{language}/{tcgSetId}/symbol.png
        const basePath = `${POKEMON_R2_STORAGE_PATH}/sets/${set.language}/${set.tcgSetId}`;

        // If we have a logoApiUrl
        if (set.logoApiUrl) {
          const logoKey = `${basePath}/logo.png`;
          const desc = `Logo for [${set.name} - ${set.tcgSetId}]`;
          tasksForThisSet.push(
            limit(() =>
              handleOneImage({
                ksContext,
                set,
                imageUrl: set.logoApiUrl,
                r2Key: logoKey,
                updateField: "logoStorageUrl",
                desc,
              }),
            ),
          );
        }

        // If we have a symbolApiUrl
        if (set.symbolApiUrl) {
          const symbolKey = `${basePath}/symbol.png`;
          const desc = `Symbol for [${set.name} - ${set.tcgSetId}]`;
          tasksForThisSet.push(
            limit(() =>
              handleOneImage({
                ksContext,
                set,
                imageUrl: set.symbolApiUrl,
                r2Key: symbolKey,
                updateField: "symbolStorageUrl",
                desc,
              }),
            ),
          );
        }

        return tasksForThisSet;
      });

      await Promise.all(tasks);
      serverLog(`✅ Finished this batch of ${sets.length} sets.`);
    }

    // Final summary
    serverLog("\n--- Pokémon Set Images Upload Summary ---");
    serverLog(`✅ Total Logos Uploaded: ${totalLogoUploaded}`);
    serverLog(`✅ Total Symbols Uploaded: ${totalSymbolUploaded}`);
    if (failedImages.length > 0) {
      serverLog(`❌ Failed images count: ${failedImages.length}`);
      failedImages.forEach(({ setId, setName, imageUrl }) => {
        serverLog(`   - Set[${setId} : ${setName}] URL: ${imageUrl}`);
      });
    } else {
      serverLog("🎉 All set images uploaded successfully!");
    }
  } catch (error) {
    serverLog(
      "error",
      "❌ Error in fetchAndUploadPokemonSetsImages script:",
      error,
    );
    process.exit(1);
  } finally {
    await ksContext.prisma.$disconnect();
    serverLog("👋 Script to fetch set images has ended...");
    process.exit(0);
  }

  // Helper function for one image
  async function handleOneImage(opts: {
    ksContext: any;
    set: any;
    imageUrl: string;
    r2Key: string;
    updateField: "logoStorageUrl" | "symbolStorageUrl";
    desc: string;
  }) {
    const { set, imageUrl, r2Key, updateField, desc } = opts;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        // 1) If not forcing, check if the file is already on R2
        if (!forceUpload) {
          const existsOnR2 = await fileExistsOnR2(r2Key);
          if (existsOnR2) {
            serverLog(`⏭️  File already exists on R2 → ${desc}`);
            await updateDbPath(set.id, updateField, `/${r2Key}`);
            return;
          }
        }

        // 2) Download the original file as-is (PNG, etc.)
        serverLog(`⬇️  Downloading ${desc} from: ${imageUrl}`);
        const fileBuffer = await fetchFileAsBuffer(imageUrl);

        // 3) Upload to R2
        await uploadToR2(r2Key, fileBuffer, "image/png");

        // 4) Update DB field, e.g. `logoStorageUrl: "/img/tcg/..."`
        await updateDbPath(set.id, updateField, `/${r2Key}`);

        // 5) Log success
        serverLog(`✅ Successfully uploaded ${desc}`);
        if (updateField === "logoStorageUrl") {
          totalLogoUploaded++;
        } else {
          totalSymbolUploaded++;
        }
        return; // done
      } catch (err: any) {
        serverLog("error", `⚠️ Attempt ${attempt} failed for ${desc}: ${err}`);
        if (attempt < MAX_RETRIES) {
          await new Promise((resolve) =>
            setTimeout(resolve, DELAY_BETWEEN_RETRIES_MS),
          );
        } else {
          failedImages.push({
            setId: set.id,
            setName: set.name,
            imageUrl,
            type: err.message.includes("404") ? "404" : "error",
          });
          serverLog(
            "error",
            `❌ Failed to upload ${desc} after ${MAX_RETRIES} attempts`,
          );
        }
      }
    }
  }

  async function uploadToR2(
    r2Key: string,
    buffer: Buffer,
    contentType: string,
  ) {
    const bucketName = process.env.R2_BUCKET_NAME;
    if (!bucketName) {
      throw new Error("❌ R2_BUCKET_NAME is not set in environment variables.");
    }
    serverLog(`⬆️  Uploading to R2: Key = ${r2Key}`);
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: r2Key,
        Body: buffer,
        ContentType: contentType,
      }),
    );
  }

  async function fetchFileAsBuffer(url: string): Promise<Buffer> {
    serverLog(`⬇️  Downloading file from: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return Buffer.from(await response.arrayBuffer());
  }

  async function updateDbPath(
    setId: string,
    field: "logoStorageUrl" | "symbolStorageUrl",
    value: string,
  ) {
    await (
      await getKeystoneContext({ sudo: true })
    ).db.PokemonSet.updateOne({
      where: { id: setId },
      data: { [field]: value },
    });
    serverLog(`✅ Updated ${field} -> ${value} for set ID: ${setId}`);
  }
}

// Main
fetchAndUploadPokemonSetsImages().catch((err) => {
  serverLog(
    "error",
    "❌ Top-level error in fetchAndUploadPokemonSetsImages:",
    err,
  );
  process.exit(1);
});
