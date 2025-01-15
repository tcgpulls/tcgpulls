import "dotenv/config";
import pLimit from "p-limit";
import sharp from "sharp";
import { HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

import getKeystoneContext from "../../getKeystoneContext";
import serverLog from "../../utils/serverLog";
import { s3Client } from "../../lib/r2client";
import { POKEMON_R2_STORAGE_PATH } from "../../constants/tcg/pokemon";

// -------------------
// Command line flags
// -------------------
const args = process.argv.slice(2);
const forceUpload = args.includes("--force-update");
const onlyMissingLocals = args.includes("--only-missing-locals");

// Pagination + concurrency
const BATCH_SIZE = 500;
const MAX_RETRIES = 3;
const DELAY_BETWEEN_RETRIES_MS = 500;
const CONCURRENCY_LIMIT = 10;

const limit = pLimit(CONCURRENCY_LIMIT);

/**
 * Downloads a remote image URL, converts to JPEG at ~85% quality, and returns the Buffer.
 */
async function fetchAndConvertToJpg(url: string): Promise<Buffer> {
  serverLog(`⬇️  Downloading image from: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    // This covers 404 and other non-2xx statuses
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const originalBuffer = Buffer.from(await response.arrayBuffer());

  // Convert to JPEG using sharp @85% quality
  return sharp(originalBuffer).jpeg({ quality: 85 }).toBuffer();
}

/**
 * Checks if a file with key `r2Key` already exists in your R2 bucket.
 */
async function fileExistsOnR2(r2Key: string): Promise<boolean> {
  const bucketName = process.env.R2_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("❌ R2_BUCKET_NAME is not set in environment variables.");
  }
  try {
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: bucketName,
        Key: r2Key,
      }),
    );
    return true; // File exists
  } catch (error: any) {
    if (error.name === "NotFound") {
      return false; // File does not exist
    }
    throw error; // Re-throw other errors
  }
}

/**
 * Uploads a given `buffer` to Cloudflare R2 under key `r2Key`, with the provided contentType.
 */
async function uploadToR2(r2Key: string, buffer: Buffer, contentType: string) {
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

/**
 * Main script to fetch, convert, and upload all Pokémon card images.
 *
 * Logic Flow:
 * 1) If --only-missing-locals is passed, only consider cards whose local images are null.
 * 2) For each card, build the storage path in R2 (e.g., `/img/tcg/pokemon/sets/...-small.jpg`).
 * 3) If !forceUpload, check if the file already exists on R2:
 *    - If it does, skip re-upload and just ensure DB is set to point to that R2 path.
 *    - If not, fetch from remote, convert, and upload.
 * 4) If forceUpload is passed, always fetch + upload again, overwriting the file on R2.
 */
async function fetchAndUploadPokemonCardsImages() {
  serverLog("🚀 Starting the Pokemon card image fetch/upload process...");

  // Keystone context with sudo access
  const ksContext = await getKeystoneContext({ sudo: true });
  serverLog("✅ Keystone context ready.");

  // Build the WHERE clause for onlyMissingLocals
  // (If --only-missing-locals is passed, we only handle cards missing local URLs.)
  const whereClause = onlyMissingLocals
    ? {
        OR: [
          { imageSmallStorageUrl: { equals: null } },
          { imageLargeStorageUrl: { equals: null } },
        ],
      }
    : {};

  // Count how many cards we’ll process
  const totalCards = await ksContext.db.PokemonCard.count({
    where: whereClause,
  });
  serverLog(`🔍 Total cards to process: ${totalCards}`);

  // For listing all failures
  const failedImages: Array<{
    cardId: string;
    cardName: string;
    type: string; // "404" or "error"
    url: string;
  }> = [];

  // Track how many images uploaded
  let totalSmallImagesUploaded = 0;
  let totalLargeImagesUploaded = 0;

  // Pagination
  let offset = 0;

  try {
    while (true) {
      // 1) Fetch next batch of cards
      serverLog(
        `\n🔎 Fetching batch of up to ${BATCH_SIZE}, offset = ${offset}`,
      );
      const cards = await ksContext.query.PokemonCard.findMany({
        where: whereClause,
        take: BATCH_SIZE,
        skip: offset,
        // We need fields used in logic + the parent set info
        query: `
          id
          name
          number
          variant
          imageSmallApiUrl
          imageLargeApiUrl
          imageSmallStorageUrl
          imageLargeStorageUrl
          set {
            id
            tcgSetId
            language
          }
        `,
      });

      if (cards.length === 0) {
        serverLog("✅ No more cards in this batch. Exiting loop...");
        break;
      }

      // Increment offset for the next loop
      offset += BATCH_SIZE;
      serverLog(`🔍 Processing this batch of ${cards.length} cards...`);

      // 2) Process each card’s small/large images concurrently (but limited)
      const tasks = cards.flatMap((card) => {
        // If no image URLs at all, skip
        if (!card.imageSmallApiUrl && !card.imageLargeApiUrl) {
          return [];
        }

        // We'll store images in: img/tcg/pokemon/sets/{language}/{tcgSetId}/cards/...
        const basePath = `${POKEMON_R2_STORAGE_PATH}/sets/${card.set.language}/${card.set.tcgSetId}/cards`;
        const baseName = `${card.set.tcgCardId}-${card.variant}`;

        // Build concurrency-limited tasks
        const cardTasks: Array<Promise<void>> = [];

        // --------------- SMALL IMAGE ---------------
        if (card.imageSmallApiUrl) {
          const smallKey = `${basePath}/${baseName}-small.jpg`;
          const desc = `Small image for [${card.name}] (Set: ${card.set.tcgSetId}, Variant: ${card.variant})`;
          cardTasks.push(
            limit(() =>
              handleOneImage({
                ksContext,
                card,
                isLarge: false,
                imageUrl: card.imageSmallApiUrl,
                r2Key: smallKey,
                updateField: "imageSmallStorageUrl",
                desc,
              }),
            ),
          );
        }

        // --------------- LARGE IMAGE ---------------
        if (card.imageLargeApiUrl) {
          const largeKey = `${basePath}/${baseName}-large.jpg`;
          const desc = `Large image for [${card.name}] (Set: ${card.set.tcgSetId}, Variant: ${card.variant})`;
          cardTasks.push(
            limit(() =>
              handleOneImage({
                ksContext,
                card,
                isLarge: true,
                imageUrl: card.imageLargeApiUrl,
                r2Key: largeKey,
                updateField: "imageLargeStorageUrl",
                desc,
              }),
            ),
          );
        }

        return cardTasks;
      });

      await Promise.all(tasks);
      serverLog(`✅ Finished processing this batch of ${cards.length} cards.`);
    }

    // Final summary
    serverLog("\n--- Pokémon Card Images Upload Summary ---");
    serverLog(`✅ Total Small Images Uploaded: ${totalSmallImagesUploaded}`);
    serverLog(`✅ Total Large Images Uploaded: ${totalLargeImagesUploaded}`);
    if (failedImages.length > 0) {
      serverLog(`❌ Failed images count: ${failedImages.length}`);
      failedImages.forEach(({ cardId, cardName, url }) => {
        serverLog(`   - Card[${cardId} : ${cardName}] URL: ${url}`);
      });
    } else {
      serverLog("🎉 All card images uploaded successfully!");
    }
  } catch (error) {
    serverLog(
      "error",
      "❌ Error in fetchAndUploadPokemonCardsImages script:",
      error,
    );
    process.exit(1);
  } finally {
    await ksContext.prisma.$disconnect(); // close DB connections
    serverLog("👋 Script to fetch card images has ended...");
    process.exit(0);
  }

  // ---------------
  // Helper function
  // ---------------
  async function handleOneImage(opts: {
    ksContext: any;
    card: any;
    isLarge: boolean;
    imageUrl: string;
    r2Key: string;
    updateField: "imageSmallStorageUrl" | "imageLargeStorageUrl";
    desc: string;
  }) {
    const { card, isLarge, imageUrl, r2Key, updateField, desc } = opts;

    // Attempt up to MAX_RETRIES
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        // 1) If not forcing, check if the file is already on R2
        if (!forceUpload) {
          const existsOnR2 = await fileExistsOnR2(r2Key);
          if (existsOnR2) {
            // If it exists, skip re-upload and just ensure DB is updated
            serverLog(`⏭️  File already exists on R2 → ${desc}`);
            await updateDbPath(card.id, updateField, `/${r2Key}`);
            return;
          }
        }

        // 2) Download + convert
        serverLog(`⬇️  Downloading ${desc}`);
        const jpgBuffer = await fetchAndConvertToJpg(imageUrl);

        // 3) Upload to R2
        await uploadToR2(r2Key, jpgBuffer, "image/jpeg");

        // 4) Update DB field, e.g. { imageSmallStorageUrl: "/img/tcg/..." }
        await updateDbPath(card.id, updateField, `/${r2Key}`);

        // 5) Log success
        serverLog(`✅ Successfully uploaded ${desc}`);
        if (isLarge) {
          totalLargeImagesUploaded++;
        } else {
          totalSmallImagesUploaded++;
        }
        return; // done
      } catch (err: any) {
        serverLog(
          "error",
          `⚠️ Attempt ${attempt} failed for ${desc}: ${err.message}`,
        );
        if (attempt < MAX_RETRIES) {
          // Wait briefly before retrying
          await new Promise((resolve) =>
            setTimeout(resolve, DELAY_BETWEEN_RETRIES_MS),
          );
        } else {
          // After last attempt, mark as failed
          failedImages.push({
            cardId: card.id,
            cardName: card.name,
            type: err.message.includes("404") ? "404" : "error",
            url: imageUrl,
          });
          serverLog(
            "error",
            `❌ Failed to upload ${desc} after ${MAX_RETRIES} attempts`,
          );
        }
      }
    }
  }
}

/**
 * Update one card’s local image path field in Keystone.
 */
async function updateDbPath(
  cardId: string,
  field: "imageSmallStorageUrl" | "imageLargeStorageUrl",
  value: string,
) {
  // Use .db API for a straightforward updateOne
  await (
    await getKeystoneContext({ sudo: true })
  ).db.PokemonCard.updateOne({
    where: { id: cardId },
    data: { [field]: value },
  });
  serverLog(`✅ Updated ${field} -> ${value} for card ID: ${cardId}`);
}

// Run main
fetchAndUploadPokemonCardsImages().catch((err) => {
  serverLog(
    "error",
    "❌ Top-level error in fetchAndUploadPokemonCardsImages:",
    err,
  );
  process.exit(1);
});
