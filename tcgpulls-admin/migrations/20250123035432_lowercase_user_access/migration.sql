/*
  Warnings:

  - The values [Freemium,Premium] on the enum `UserAccessType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserAccessType_new" AS ENUM ('freemium', 'premium');
ALTER TABLE "User" ALTER COLUMN "access" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "access" TYPE "UserAccessType_new" USING ("access"::text::"UserAccessType_new");
ALTER TYPE "UserAccessType" RENAME TO "UserAccessType_old";
ALTER TYPE "UserAccessType_new" RENAME TO "UserAccessType";
DROP TYPE "UserAccessType_old";
ALTER TABLE "User" ALTER COLUMN "access" SET DEFAULT 'freemium';
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "access" SET DEFAULT 'freemium';
