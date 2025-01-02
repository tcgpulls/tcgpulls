import { s3Client } from "tcgpulls/lib/r2client";
import { prisma } from "@tcg/prisma";
import { ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";
import pLimit from "p-limit";
import customLog from "tcgpulls/utils/customLog";

(async () => {
  const bucketName = process.env.R2_BUCKET_NAME;
  if (!bucketName) {
    throw new Error(
      "❌ R2_BUCKET_NAME is not set in the environment variables.",
    );
  }

  const prefix = "img/tcg/pokemon/sets"; // Adjust if needed
  const CONCURRENCY_LIMIT = 20; // Adjust this based on your system's capacity
  const limit = pLimit(CONCURRENCY_LIMIT);

  let continuationToken: string | undefined = undefined;
  const allStorageKeys: string[] = [];
  const deletedKeys: string[] = [];

  customLog("🔍 Fetching all referenced images from the database...");

  // Fetch all referenced image paths from the database
  const referencedImages = new Set<string>();
  const cards = await prisma.pokemonCard.findMany({
    select: {
      localImageSmall: true,
      localImageLarge: true,
    },
  });

  cards.forEach((card: (typeof cards)[number]) => {
    if (card.localImageSmall) referencedImages.add(card.localImageSmall);
    if (card.localImageLarge) referencedImages.add(card.localImageLarge);
  });

  customLog(`✅ Found ${referencedImages.size} referenced images.`);

  customLog("🔍 Fetching all images from R2 storage...");

  // Fetch all images from R2 storage
  while (true) {
    const listParams: {
      Bucket: string;
      Prefix: string;
      ContinuationToken?: string;
    } = {
      Bucket: bucketName,
      Prefix: prefix,
      ContinuationToken: continuationToken,
    };

    const listedObjects = await s3Client.send(
      new ListObjectsV2Command(listParams),
    );

    const contents = listedObjects.Contents || [];
    contents.forEach((obj) => {
      if (obj.Key) {
        allStorageKeys.push(`/${obj.Key}`); // Prefix with "/" to match DB paths
      }
    });

    if (listedObjects.IsTruncated) {
      continuationToken = listedObjects.NextContinuationToken;
    } else {
      break;
    }
  }

  customLog(`✅ Found ${allStorageKeys.length} images in storage.`);

  // Identify unreferenced images, excluding "symbol.png" and "logo.png"
  const unreferencedImages = allStorageKeys.filter(
    (key) =>
      !referencedImages.has(key) &&
      !key.endsWith("symbol.png") &&
      !key.endsWith("logo.png"), // Exclude specific files
  );

  customLog(`🔍 Found ${unreferencedImages.length} unreferenced images.`);

  // Delete unreferenced images concurrently
  const tasks = unreferencedImages.map((key) =>
    limit(async () => {
      try {
        const s3Key = key.startsWith("/") ? key.slice(1) : key; // Remove leading slash for S3
        await s3Client.send(
          new DeleteObjectCommand({ Bucket: bucketName, Key: s3Key }),
        );
        deletedKeys.push(key);
        customLog(`🗑️ Deleted unreferenced image: ${key}`);
      } catch (error) {
        customLog(
          "error",
          `❌ Failed to delete ${key}: ${
            error instanceof Error ? error.message : error
          }`,
        );
      }
    }),
  );

  await Promise.all(tasks);

  customLog("\n--- Cleanup Summary ---");
  customLog(`✅ Total unreferenced images deleted: ${deletedKeys.length}`);
  customLog(
    `✅ Remaining images in storage: ${
      allStorageKeys.length - deletedKeys.length
    }`,
  );

  await prisma.$disconnect();
})().catch((error) => {
  console.error("❌ Error during cleanup:", error);
  process.exit(1);
});
