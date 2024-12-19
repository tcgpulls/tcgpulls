import { prisma } from "@/lib/prisma";
import customLog from "@/utils/customLog";
import delayPromise from "@/utils/delayPromise";
import { PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/r2client";
import pLimit from "p-limit";

const args = process.argv.slice(2);
const forceUpload = args.includes("--force"); // Parse the --force flag
const BATCH_SIZE = 500;
const MAX_RETRIES = 3;
const DELAY_PROMISE = 500;
const CONCURRENCY_LIMIT = 10;

const limit = pLimit(CONCURRENCY_LIMIT);

(async () => {
  let totalSmallImagesDownloaded = 0;
  let totalLargeImagesDownloaded = 0;
  const failedImages: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[] = [];
  let offset = 0;

  const totalCards = await prisma.pokemonCard.count();
  customLog(`🔍 Total cards to process: ${totalCards}`);

  try {
    while (true) {
      const cards = await prisma.pokemonCard.findMany({
        include: { set: true },
        skip: offset,
        take: BATCH_SIZE,
      });

      if (cards.length === 0) break;

      offset += BATCH_SIZE;
      customLog(`🔍 Processing batch of ${cards.length} cards.`);
      await processCards(cards);
    }

    customLog("\n--- Upload Summary ---");
    customLog(`✅ Total Small Images Uploaded: ${totalSmallImagesDownloaded}`);
    customLog(`✅ Total Large Images Uploaded: ${totalLargeImagesDownloaded}`);

    if (failedImages.length > 0) {
      customLog("\n❌ Failed Uploads:");
      failedImages.forEach((item) => {
        customLog(`  - ${item.name} | URL: ${item.url}`);
      });
    } else {
      customLog("🎉 All images uploaded successfully!");
    }
  } catch (error) {
    customLog("error", "❌ Error uploading images:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }

  async function processCards(cards: any[]) {
    const imgBasePath = "img/tcg/pokemon/sets";
    const uploadTasks = cards.flatMap((card) => {
      if (!card.imagesSmall && !card.imagesLarge) return [];

      const tasks = [];

      // Small Image
      if (card.imagesSmall) {
        const smallFilename = `${card.number}-${card.variant}-small.png`;
        const imgFilePath = `${imgBasePath}/${card.set.language}/${card.set.originalId}/${smallFilename}`;
        tasks.push(
          limit(() =>
            downloadAndUploadImage(
              card.imagesSmall,
              imgFilePath,
              () =>
                updateDatabase(card.id, "localImageSmall", `/${imgFilePath}`),
              () => updateDatabase(card.id, "localImageSmall", ""), // Empty string for 404
              `Small image: ${smallFilename} for card: ${card.set.originalId} - ${card.name}`,
            ),
          ),
        );
      }

      // Large Image
      if (card.imagesLarge) {
        const largeFilename = `${card.number}-${card.variant}-large.png`;
        const imgFilePath = `${imgBasePath}/${card.set.language}/${card.set.originalId}/${largeFilename}`;
        tasks.push(
          limit(() =>
            downloadAndUploadImage(
              card.imagesLarge,
              imgFilePath,
              () =>
                updateDatabase(card.id, "localImageLarge", `/${imgFilePath}`),
              () => updateDatabase(card.id, "localImageLarge", ""), // Empty string for 404
              `Large image: ${largeFilename} for card: ${card.set.originalId} - ${card.name}`,
            ),
          ),
        );
      }

      return tasks;
    });

    await Promise.all(uploadTasks);
  }

  async function downloadAndUploadImage(
    url: string,
    imgFilePath: string,
    updateDbSuccess: () => Promise<void>,
    updateDb404: () => Promise<void>,
    description: string,
  ) {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        // Check if the file exists unless --force is used
        if (!forceUpload) {
          const exists = await checkIfFileExists(imgFilePath);
          if (exists) {
            customLog(`⏭️ Skipping upload for ${description} (already exists)`);
            return;
          }
        }

        customLog(`⬇️ Downloading ${description}`);
        const response = await fetch(url);

        // Handle 404 case
        if (response.status === 404) {
          customLog(
            "warn",
            `❌ 404 Not Found: ${description}. Clearing DB field.`,
          );
          await updateDb404(); // Update DB to empty string
          failedImages.push({
            id: "unknown",
            name: description,
            type: "404",
            url,
          });
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get Content-Type dynamically from response headers
        const contentType =
          response.headers.get("Content-Type") || "application/octet-stream";
        const imageBuffer = Buffer.from(await response.arrayBuffer());

        // Upload to R2 with dynamic Content-Type
        await uploadToR2(imgFilePath, imageBuffer, contentType);
        await updateDbSuccess();

        customLog(`✅ Uploaded ${description} (${contentType})`);
        if (imgFilePath.includes("-small")) totalSmallImagesDownloaded++;
        if (imgFilePath.includes("-large")) totalLargeImagesDownloaded++;
        return;
      } catch (err: any) {
        customLog(
          "error",
          `⚠️ Attempt ${attempt} failed for ${description}: ${err.message}`,
        );
        if (attempt < MAX_RETRIES) await delayPromise(DELAY_PROMISE);
        else {
          failedImages.push({
            id: "unknown",
            name: description,
            type: "error",
            url,
          });
          customLog(
            "error",
            `❌ Failed to upload ${description} after ${MAX_RETRIES} attempts`,
          );
        }
      }
    }
  }

  async function uploadToR2(key: string, data: Buffer, contentType: string) {
    const bucketName = process.env.R2_BUCKET_NAME;

    if (!bucketName) {
      throw new Error(
        "❌ R2_BUCKET_NAME is not set in the environment variables.",
      );
    }

    console.log(`⬆️ Uploading to bucket: ${bucketName}, key: ${key}`);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: data,
        ContentType: contentType,
      }),
    );
  }

  async function checkIfFileExists(key: string): Promise<boolean> {
    const bucketName = process.env.R2_BUCKET_NAME;

    if (!bucketName) {
      throw new Error(
        "❌ R2_BUCKET_NAME is not set in the environment variables.",
      );
    }

    try {
      await s3Client.send(
        new HeadObjectCommand({
          Bucket: bucketName,
          Key: key,
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

  async function updateDatabase(cardId: string, field: string, value: string) {
    await prisma.pokemonCard.update({
      where: { id: cardId },
      data: { [field]: value },
    });
    if (value === "") {
      customLog(`⚠️ Cleared ${field} for card ID: ${cardId}`);
    } else {
      customLog(`✅ Updated ${field} -> ${value} for card ID: ${cardId}`);
    }
  }
})();
