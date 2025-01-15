import fs from "fs";

// Function to check if a file exists
export const fileExists = (filePath: string): boolean => {
  return fs.existsSync(filePath);
};
