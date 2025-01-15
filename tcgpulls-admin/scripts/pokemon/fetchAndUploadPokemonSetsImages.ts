import "dotenv/config";
import { PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3"; // We'll use this to upload to R2
import { s3Client } from "../../lib/r2client"; // Your Cloudflare R2 client
import getKeystoneContext from "../../getKeystoneContext";
import serverLog from "../../utils/serverLog";
import { POKEMON_R2_STORAGE_PATH } from "../../constants/tcg/pokemon";

// Command line arguments
const args = process.argv.slice(2);
const forceUpload = args.includes("--force-update");

/**
 * Check if a file with the given key exists on R2.
 */
async function checkIfFileExistsOnR2(key: string): Promise<boolean> {
  if (!process.env.R2_BUCKET_NAME) {
    throw new Error(
      "❌ R2_BUCKET_NAME is not set in the environment variables.",
    );
  }
  try {
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
      }),
    );
    return true; // File exists in R2
  } catch (error: any) {
    // If it's a NotFound error, the file is missing
    if (error.name === "NotFound") {
      return false;
    }
    throw error; // Some other error
  }
}

/** Fetch an image from a remote URL and return it as a Buffer. */
async function fetchImage(url: string): Promise<Buffer> {
  serverLog(`🔎 Fetching image from: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image - Status: ${response.status}`);
  }
  serverLog(`✅ Fetched image successfully from: ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

/** Upload a Buffer to R2 under the given path, return the public URL. */
async function uploadToR2(buffer: Buffer, path: string): Promise<string> {
  if (!process.env.R2_BUCKET_NAME) {
    throw new Error(
      "❌ R2_BUCKET_NAME is not set in the environment variables.",
    );
  }
  serverLog(`📡 Uploading image to R2 → Key: ${path}`);

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: path,
    Body: buffer,
    ContentType: "image/png",
  });

  try {
    await s3Client.send(command);
    serverLog(`✅ Successfully uploaded image to: ${path}`);
  } catch (error) {
    const msg = (error as Error).message;
    serverLog(`❌ Error uploading image to ${path}: ${msg}`);
    throw error;
  }

  // Construct a public URL (adjust if your R2 endpoint is different).
  return `https://${process.env.NEXT_PUBLIC_R2_PUBLIC_BUCKET_URL}/${path}`;
}

async function main() {
  serverLog("🚀 Starting the Pokemon set image fetch/upload process...");

  // Use sudo context for full access
  const ksContext = await getKeystoneContext({ sudo: true });
  serverLog("✅ Keystone context ready.");

  serverLog("🔎 Querying all Pokemon sets from the database...");
  const sets = await ksContext.query.PokemonSet.findMany({
    query: `
      id
      tcgSetId
      language
      tcgSetId_language
      logoApiUrl
      symbolApiUrl
      logoStorageUrl
      symbolStorageUrl
    `,
  });
  serverLog(`✅ Retrieved ${sets.length} sets from the database.`);

  // Counters & tracking
  let logoSuccessCount = 0;
  let logoFailCount = 0;
  let symbolSuccessCount = 0;
  let symbolFailCount = 0;

  // Keep track of which sets failed
  const failedLogos: string[] = [];
  const failedSymbols: string[] = [];

  // Process each set
  for (const set of sets) {
    serverLog(`\n👉 Processing set: ${set.tcgSetId} (${set.language})`);

    // ---------- LOGO ----------
    {
      // We’ll store it under: sets/<language>/<tcgSetId>/logo.png
      const logoPath = `${POKEMON_R2_STORAGE_PATH}/sets/${set.language}/${set.tcgSetId}/logo.png`;

      // Step 1: see if R2 already has this file (unless forceUpload is true)
      let fileExists = false;
      if (!forceUpload) {
        fileExists = await checkIfFileExistsOnR2(logoPath);
      }

      // If the file exists on R2, skip. Otherwise we proceed to fetch & upload.
      if (fileExists) {
        serverLog(`⏭️ Logo file already on R2, skipping: ${logoPath}`);
      } else {
        serverLog(`⚠️  Checking set.logoApiUrl -> ${set.logoApiUrl}`);
        // If we have a valid .logoApiUrl, do the fetch & upload
        if (set.logoApiUrl) {
          try {
            const logoBuffer = await fetchImage(set.logoApiUrl);
            const logoUrl = await uploadToR2(logoBuffer, logoPath);

            // Step 2: Update DB with the new URL if needed
            if (set.logoStorageUrl !== logoUrl) {
              await ksContext.db.PokemonSet.updateOne({
                where: { id: set.id },
                data: { logoStorageUrl: logoUrl },
              });
              serverLog(`✅ Logo uploaded & URL updated: ${logoUrl}`);
            } else {
              serverLog(
                `✅ Logo was already up-to-date in DB: ${set.logoStorageUrl}`,
              );
            }
            logoSuccessCount++;
          } catch (err) {
            serverLog(`❌ Error processing logo for ${set.tcgSetId}`);
            console.error(err);
            logoFailCount++;
            failedLogos.push(set.tcgSetId);
          }
        } else {
          serverLog(`⚠️  No logoApiUrl found for ${set.tcgSetId}. Skipping...`);
        }
      }
    }

    // ---------- SYMBOL ----------
    {
      // We’ll store it under: sets/<language>/<tcgSetId>/symbol.png
      const symbolPath = `${POKEMON_R2_STORAGE_PATH}/sets/${set.language}/${set.tcgSetId}/symbol.png`;

      // Check R2 if the file already exists (unless force update).
      let fileExists = false;
      if (!forceUpload) {
        fileExists = await checkIfFileExistsOnR2(symbolPath);
      }

      if (fileExists) {
        serverLog(`⏭️ Symbol file already on R2, skipping: ${symbolPath}`);
      } else {
        serverLog(`⚠️  Checking set.symbolApiUrl -> ${set.symbolApiUrl}`);
        if (set.symbolApiUrl) {
          try {
            const symbolBuffer = await fetchImage(set.symbolApiUrl);
            const symbolUrl = await uploadToR2(symbolBuffer, symbolPath);

            // Update DB if the new URL differs from what's stored
            if (set.symbolStorageUrl !== symbolUrl) {
              await ksContext.db.PokemonSet.updateOne({
                where: { id: set.id },
                data: { symbolStorageUrl: symbolUrl },
              });
              serverLog(`✅ Symbol uploaded & URL updated: ${symbolUrl}`);
            } else {
              serverLog(
                `✅ Symbol was already up-to-date in DB: ${set.symbolStorageUrl}`,
              );
            }
            symbolSuccessCount++;
          } catch (err) {
            serverLog(`❌ Error processing symbol for ${set.tcgSetId}`);
            console.error(err);
            symbolFailCount++;
            failedSymbols.push(set.tcgSetId);
          }
        } else {
          serverLog(
            `⚠️  No symbolApiUrl found for ${set.tcgSetId}. Skipping...`,
          );
        }
      }
    }
  }

  serverLog("\n🎉 All sets processed. Generating summary...");

  // Show a final summary
  const totalSuccess = logoSuccessCount + symbolSuccessCount;
  const totalFail = logoFailCount + symbolFailCount;
  serverLog(`\n📝 Summary of uploads:
  • Logo successes: ${logoSuccessCount}
  • Logo failures:  ${logoFailCount}
  • Symbol successes: ${symbolSuccessCount}
  • Symbol failures: ${symbolFailCount}

  ✅ Total successful uploads: ${totalSuccess}
  ❌ Total failed uploads:     ${totalFail}`);

  if (logoFailCount > 0 || symbolFailCount > 0) {
    serverLog("\n🔻 Failures Details:");
    if (failedLogos.length > 0) {
      serverLog(`   Logo failures for sets: ${failedLogos.join(", ")}`);
    }
    if (failedSymbols.length > 0) {
      serverLog(`   Symbol failures for sets: ${failedSymbols.join(", ")}`);
    }
  }
}

main()
  .then(() => {
    serverLog("✨ Image fetch & upload script completed.");
    process.exit(0);
  })
  .catch((err) => {
    serverLog("❌ Error in fetchAndUploadPokemonSetsImages (outer catch):");
    console.error(err);
    process.exit(1);
  });
