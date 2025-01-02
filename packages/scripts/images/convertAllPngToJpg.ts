import { s3Client } from "tcgpulls/lib/r2client";
import { prisma } from "@tcg/prisma";
import {
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import sharp from "sharp";
import pLimit from "p-limit";
import customLog from "tcgpulls/utils/customLog";

(async () => {
  const bucketName = process.env.R2_BUCKET_NAME;
  if (!bucketName) {
    throw new Error(
      "❌ R2_BUCKET_NAME is not set in the environment variables.",
    );
  }

  // This prefix can be adjusted if you want to only convert images in a certain directory
  const prefix = "img/tcg/pokemon/sets";

  const CONCURRENCY_LIMIT = 20; // Adjust this number based on your system's capacity
  const limit = pLimit(CONCURRENCY_LIMIT);

  let continuationToken: string | undefined = undefined;
  let convertedCount = 0;
  let deletedCount = 0;
  let updatedDbCount = 0;

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
    const pngObjects = contents.filter(
      (obj) => obj.Key && obj.Key.endsWith(".png"),
    );

    const tasks = pngObjects.map((obj) =>
      limit(async () => {
        const key = obj.Key!;

        // Ignore symbol.png and logo.png
        if (key.endsWith("symbol.png") || key.endsWith("logo.png")) {
          customLog(`🔍 Skipping special file: ${key}`);
          return;
        }

        customLog(`🔍 Processing: ${key}`);

        try {
          // Download the PNG image
          const getObjectRes = await s3Client.send(
            new GetObjectCommand({ Bucket: bucketName, Key: key }),
          );
          const body = await getStreamBuffer(
            getObjectRes.Body as NodeJS.ReadableStream,
          );

          // Convert PNG to JPG
          const jpgBuffer = await sharp(body).jpeg({ quality: 85 }).toBuffer();

          const newKey = key.replace(/\.png$/, ".jpg");

          // Upload the JPG
          await s3Client.send(
            new PutObjectCommand({
              Bucket: bucketName,
              Key: newKey,
              Body: jpgBuffer,
              ContentType: "image/jpeg",
            }),
          );
          convertedCount++;
          customLog(`✅ Uploaded converted JPG: ${newKey}`);

          // Delete the old PNG
          await s3Client.send(
            new DeleteObjectCommand({ Bucket: bucketName, Key: key }),
          );
          deletedCount++;
          customLog(`🗑️ Deleted old PNG: ${key}`);

          // Update your database references if needed:
          const oldPath = `/${key}`;
          const newPath = `/${newKey}`;
          const updateResult = await prisma.pokemonCard.updateMany({
            where: {
              OR: [{ localImageSmall: oldPath }, { localImageLarge: oldPath }],
            },
            data: {
              localImageSmall: { set: newPath },
              localImageLarge: { set: newPath },
            },
          });
          if (updateResult.count > 0) {
            updatedDbCount += updateResult.count;
            customLog(
              `✅ Updated DB references for ${updateResult.count} records from ${oldPath} to ${newPath}`,
            );
          }
        } catch (error: unknown) {
          let errorMessage: string;

          // Type guard to handle `error` safely
          if (error instanceof Error) {
            errorMessage = error.message;
          } else if (typeof error === "string") {
            errorMessage = error; // Handle string errors
          } else {
            errorMessage = "Unknown error occurred"; // Fallback for unexpected cases
          }

          customLog("error", `❌ Error processing ${key}: ${errorMessage}`);
        }
      }),
    );

    await Promise.all(tasks);

    if (listedObjects.IsTruncated) {
      continuationToken = listedObjects.NextContinuationToken;
    } else {
      break;
    }
  }

  customLog("\n--- Conversion Summary ---");
  customLog(`✅ Total PNG converted to JPG: ${convertedCount}`);
  customLog(`🗑️  Total PNG deleted: ${deletedCount}`);
  customLog(`✅ DB entries updated: ${updatedDbCount}`);

  await prisma.$disconnect();
})().catch((error) => {
  console.error("❌ Error during PNG to JPG conversion:", error);
  process.exit(1);
});

// Helper function to convert a stream to a buffer
function getStreamBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) =>
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)),
    );
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}
