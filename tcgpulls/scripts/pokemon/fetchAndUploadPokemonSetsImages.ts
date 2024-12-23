import { prisma } from "@/lib/prisma";
import customLog from "@/utils/customLog";
import delayPromise from "@/utils/delayPromise";
import { PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/r2client";
import pLimit from "p-limit";

const args = process.argv.slice(2);
const forceImageDownload = args.includes("--force-update");

const MAX_RETRIES = 3;
const DELAY_PROMISE = 500;
const CONCURRENCY_LIMIT = 5;

const limit = pLimit(CONCURRENCY_LIMIT);

(async () => {
  let totalLogosUploaded = 0;
  let totalSymbolsUploaded = 0;
  let totalLogosSkipped = 0;
  let totalSymbolsSkipped = 0;
  const failedImages: { id: string; type: string; url: string }[] = [];

  try {
    const sets = await prisma.pokemonSet.findMany();
    customLog(`🔍 Found ${sets.length} sets in the database.`);

    const uploadTasks = sets.map((set) =>
      limit(async () => {
        if (!set.logo && !set.symbol) return;

        // Use set.setId instead of setId
        const imgBasePath = `img/tcg/pokemon/sets/${set.language}/${set.setId}`;
        let logoSkipped = false;
        let symbolSkipped = false;

        // Logo
        if (set.logo) {
          const logoKey = `${imgBasePath}/logo.png`;
          const shouldUploadLogo = await shouldUpload(logoKey);
          if (shouldUploadLogo) {
            try {
              await downloadAndUploadImage(
                set.logo,
                logoKey,
                () =>
                  updateDatabase(
                    set.setId,
                    set.language,
                    "localLogo",
                    `/${logoKey}`,
                  ),
                () => updateDatabase(set.setId, set.language, "localLogo", ""),
                `⬇️ Logo for set: ${set.name} - ${set.setId}`,
              );
              totalLogosUploaded++;
            } catch (err) {
              failedImages.push({
                id: set.setId,
                type: "logo",
                url: set.logo,
              });
              customLog(
                "error",
                `❌ Failed to upload logo for set: ${set.name} - ${set.setId}`,
                err,
              );
            }
          } else {
            // We still want to update the DB path if skipping
            await updateDatabase(
              set.setId,
              set.language,
              "localLogo",
              `/${logoKey}`,
            );
            customLog(
              `✅ (No Download) Updated localLogo -> /${logoKey} for set: ${set.name} - ${set.setId}`,
            );
            totalLogosSkipped++;
            logoSkipped = true;
          }
        }

        // Symbol
        if (set.symbol) {
          const symbolKey = `${imgBasePath}/symbol.png`;
          const shouldUploadSymbol = await shouldUpload(symbolKey);
          if (shouldUploadSymbol) {
            try {
              await downloadAndUploadImage(
                set.symbol,
                symbolKey,
                () =>
                  updateDatabase(
                    set.setId,
                    set.language,
                    "localSymbol",
                    `/${symbolKey}`,
                  ),
                () =>
                  updateDatabase(set.setId, set.language, "localSymbol", ""),
                `⬇️ Symbol for set: ${set.name} - ${set.setId}`,
              );
              totalSymbolsUploaded++;
            } catch (err) {
              failedImages.push({
                id: set.setId,
                type: "symbol",
                url: set.symbol,
              });
              customLog(
                "error",
                `❌ Failed to upload symbol for set: ${set.name} - ${set.setId}`,
                err,
              );
            }
          } else {
            // We still want to update the DB path if skipping
            await updateDatabase(
              set.setId,
              set.language,
              "localSymbol",
              `/${symbolKey}`,
            );
            customLog(
              `✅ (No Download) Updated localSymbol -> /${symbolKey} for set: ${set.name} - ${set.setId}`,
            );
            totalSymbolsSkipped++;
            symbolSkipped = true;
          }
        }

        if (logoSkipped) {
          customLog(
            `⏭️ Logo already exists for set: ${set.name} - ${set.setId}`,
          );
        }
        if (symbolSkipped) {
          customLog(
            `⏭️ Symbol already exists for set: ${set.name} - ${set.setId}`,
          );
        }
      }),
    );

    await Promise.all(uploadTasks);

    // Summary Log
    customLog("\n--- Upload Summary ---");
    customLog(`✅ Total Logos Uploaded: ${totalLogosUploaded}`);
    customLog(`⏭️ Total Logos Skipped: ${totalLogosSkipped}`);
    customLog(`✅ Total Symbols Uploaded: ${totalSymbolsUploaded}`);
    customLog(`⏭️ Total Symbols Skipped: ${totalSymbolsSkipped}`);

    if (failedImages.length > 0) {
      customLog("❌ Failed Uploads:");
      failedImages.forEach((item) => {
        customLog(
          `  - Set ID: ${item.id} | Type: ${item.type} | URL: ${item.url}`,
        );
      });
    } else if (totalLogosUploaded === 0 && totalSymbolsUploaded === 0) {
      customLog("🎉 All images already exist. Nothing new to upload!");
    } else {
      customLog("🎉 All images uploaded successfully!");
    }
  } catch (error) {
    customLog("error", "❌ Error during image upload:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }

  async function downloadAndUploadImage(
    url: string,
    key: string,
    updateDbSuccess: () => Promise<void>,
    updateDb404: () => Promise<void>,
    description: string,
  ) {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        customLog(description);
        const response = await fetch(url);

        if (response.status === 404) {
          customLog("warn", `❌ 404 Not Found. Clearing DB field.`);
          await updateDb404();
          failedImages.push({ id: "unknown", type: "404", url });
          return;
        }

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const contentType =
          response.headers.get("Content-Type") || "application/octet-stream";
        const imageBuffer = Buffer.from(await response.arrayBuffer());

        await uploadToR2(key, imageBuffer, contentType);
        await updateDbSuccess();
        customLog(`⬆️ Uploaded ${description} (${contentType})`);
        return;
      } catch (err: unknown) {
        const errorMessage = (err as Error).message || "Unknown error";
        customLog(
          "error",
          `⚠️ Attempt ${attempt} failed: ${description}: ${errorMessage}`,
        );
        if (attempt < MAX_RETRIES) await delayPromise(DELAY_PROMISE);
        else {
          failedImages.push({ id: "unknown", type: "error", url });
          customLog(
            `❌ Failed to upload ${description} after ${MAX_RETRIES} attempts`,
          );
        }
      }
    }
  }

  async function shouldUpload(key: string): Promise<boolean> {
    if (forceImageDownload) return true;
    try {
      await s3Client.send(
        new HeadObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: key,
        }),
      );
      return false; // Exists
    } catch (err) {
      return true; // Doesn't exist
    }
  }

  async function uploadToR2(key: string, data: Buffer, contentType: string) {
    const bucketName = process.env.R2_BUCKET_NAME;

    if (!bucketName) {
      throw new Error(
        "❌ R2_BUCKET_NAME is not set in the environment variables.",
      );
    }

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: data,
        ContentType: contentType,
      }),
    );
  }

  // Use (setId, language) instead of setId for updating DB
  async function updateDatabase(
    tcgSetId: string,
    language: string,
    field: string,
    value: string,
  ) {
    await prisma.pokemonSet.update({
      where: {
        setId_language: {
          setId: tcgSetId,
          language,
        },
      },
      data: {
        [field]: value,
      },
    });
    if (value === "") {
      customLog(`⚠️ Cleared ${field} for set ID: ${tcgSetId}`);
    } else {
      customLog(`✅ Updated ${field} -> ${value} for set ID: ${tcgSetId}`);
    }
  }
})();
