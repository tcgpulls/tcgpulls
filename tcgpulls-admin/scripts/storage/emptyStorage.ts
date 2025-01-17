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

  // If basePath is "", we'll treat it as "delete everything in the bucket".
  // Otherwise, we do the subfolder logic.
  const deletingAll = basePath === "";

  serverLog(
    "info",
    deletingAll
      ? `🚀 Deleting ALL objects in bucket: "${bucketName}"...`
      : `🚀 Deleting objects under path: "${basePath}" in bucket: "${bucketName}"...`,
  );

  let isTruncated = true;
  let continuationToken: string | undefined = undefined;

  while (isTruncated) {
    serverLog("info", "📂 Fetching objects from bucket...");

    const listResponse: ListObjectsV2CommandOutput = await s3Client
      .send(
        new ListObjectsV2Command({
          Bucket: bucketName,
          Prefix: deletingAll ? undefined : basePath,
          // If basePath is "", we set Prefix=undefined => list entire bucket
          ContinuationToken: continuationToken,
        }),
      )
      .catch((err) => {
        serverLog("error", "❌ Error listing objects:", err);
        throw err;
      });

    const objects = listResponse.Contents || [];
    serverLog(
      "info",
      `✅ Found ${objects.length} objects${
        deletingAll ? " (entire bucket)" : ` under "${basePath}"`
      }.`,
    );

    // 1) If we’re deleting everything, skip the subfolder logic and just delete them in one go
    if (deletingAll) {
      if (objects.length > 0) {
        const deleteParams = {
          Bucket: bucketName,
          Delete: {
            Objects: objects.map((obj) => ({ Key: obj.Key })),
          },
        };

        await s3Client
          .send(new DeleteObjectsCommand(deleteParams))
          .then(() => {
            serverLog(
              "info",
              `✅ Deleted ${objects.length} objects successfully (entire bucket or no basePath).`,
            );
          })
          .catch((err) => {
            serverLog("error", "❌ Error deleting objects:", err);
            throw err;
          });
      } else {
        serverLog("info", "📦 No objects found to delete.");
      }
    }
    // 2) Otherwise, we do the target folder approach
    else {
      // Identify which “folders” (or subpaths) to clean
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
            serverLog(
              "info",
              `📦 No objects to delete in folder: "${folder}".`,
            );
          }

          folderIsTruncated = listFolderResponse.IsTruncated || false;
          folderContinuationToken = listFolderResponse.NextContinuationToken;
        }
      }
    }

    // Move to next page for top-level listing
    isTruncated = listResponse.IsTruncated || false;
    continuationToken = listResponse.NextContinuationToken;
  }

  serverLog(
    "info",
    `🎉 All objects ${
      deletingAll ? "in the bucket" : `under "${targetFolderName || basePath}"`
    } have been deleted!`,
  );
}

// Example usage of the utility function
const bucketName = process.env.R2_BUCKET_NAME || "";
// If the user passes no argument => basePath = "", meaning “delete everything”.
const basePath = process.argv[2] || "";
const targetFolderName = process.argv[3] || undefined;

emptyStorage(bucketName, basePath, targetFolderName).catch((err) => {
  serverLog("error", "❌ Failed to delete objects under target folders:", err);
});
