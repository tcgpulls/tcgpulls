import "dotenv/config";

import {
  ListObjectsV2Command,
  DeleteObjectsCommand,
  ListObjectsV2CommandOutput,
} from "@aws-sdk/client-s3";
import { s3Client } from "../../lib/r2client";
import serverLog from "../../utils/serverLog";

async function emptyStorage(
  bucketName: string,
  basePath: string,
  targetFolderName?: string,
): Promise<void> {
  if (!bucketName) {
    serverLog("error", "❌ Bucket name is required.");
    return;
  }

  if (!basePath) {
    serverLog("error", "❌ Base path is required.");
    return;
  }

  serverLog(
    "info",
    `🚀 Starting to delete objects under path: "${basePath}" in bucket: "${bucketName}"...`,
  );

  let isTruncated = true;
  let continuationToken: string | undefined = undefined;

  // Step 1: List all objects under the base path and identify target folders if specified
  while (isTruncated) {
    serverLog("info", "📂 Fetching objects from bucket...");

    const listResponse: ListObjectsV2CommandOutput = await s3Client
      .send(
        new ListObjectsV2Command({
          Bucket: bucketName,
          Prefix: basePath, // Specify the base path as the prefix
          ContinuationToken: continuationToken,
        }),
      )
      .catch((err) => {
        serverLog("error", "❌ Error listing objects:", err);
        throw err;
      });

    serverLog("info", "✅ Objects fetched successfully.");

    const objects = listResponse.Contents || [];
    const foldersToClean = new Set(
      objects
        .filter(
          (obj) =>
            !targetFolderName ||
            (obj.Key && obj.Key.includes(`/${targetFolderName}/`)),
        )
        .map((obj) => {
          if (targetFolderName && obj.Key) {
            return (
              obj.Key.split(`/${targetFolderName}/`)[0] +
              `/${targetFolderName}/`
            );
          }
          return obj.Key?.split(basePath)[0] + basePath;
        }),
    );

    // Step 2: Delete objects in each identified target folder or base path
    for (const folder of foldersToClean) {
      serverLog("info", `🗑️ Cleaning folder: "${folder}"`);

      let folderIsTruncated = true;
      let folderContinuationToken: string | undefined = undefined;

      while (folderIsTruncated) {
        const listFolderResponse: ListObjectsV2CommandOutput = await s3Client
          .send(
            new ListObjectsV2Command({
              Bucket: bucketName,
              Prefix: folder,
              ContinuationToken: folderContinuationToken,
            }),
          )
          .catch((err) => {
            serverLog("error", "❌ Error listing objects in folder:", err);
            throw err;
          });

        const folderObjects = listFolderResponse.Contents || [];
        if (folderObjects.length > 0) {
          const deleteParams = {
            Bucket: bucketName,
            Delete: {
              Objects: folderObjects.map((obj) => ({ Key: obj.Key })),
            },
          };

          await s3Client
            .send(new DeleteObjectsCommand(deleteParams))
            .then(() => {
              serverLog(
                "info",
                `✅ Deleted ${folderObjects.length} objects successfully from folder: "${folder}".`,
              );
            })
            .catch((err) => {
              serverLog("error", "❌ Error deleting objects:", err);
              throw err;
            });
        } else {
          serverLog("info", `📦 No objects to delete in folder: "${folder}".`);
        }

        folderIsTruncated = listFolderResponse.IsTruncated || false;
        folderContinuationToken = listFolderResponse.NextContinuationToken;
      }
    }

    isTruncated = listResponse.IsTruncated || false;
    continuationToken = listResponse.NextContinuationToken;
  }

  serverLog(
    "info",
    `🎉 All objects under "${targetFolderName || basePath}" in bucket "${bucketName}" are now deleted!`,
  );
}

// Example usage of the utility function
const bucketName = process.env.R2_BUCKET_NAME || "";
const basePath = process.argv[2] || ""; // Pass the base path as a command-line argument
const targetFolderName = process.argv[3] || undefined; // Pass the target folder name as a command-line argument (optional)

emptyStorage(bucketName, basePath, targetFolderName).catch((err) => {
  serverLog("error", "❌ Failed to delete objects under target folders:", err);
});
