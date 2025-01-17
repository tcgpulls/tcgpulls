import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../lib/r2client";

const fileExistsOnR2 = async (r2Key: string): Promise<boolean> => {
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
};

export default fileExistsOnR2;
