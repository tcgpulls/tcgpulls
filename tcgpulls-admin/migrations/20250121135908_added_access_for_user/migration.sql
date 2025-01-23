-- CreateEnum
CREATE TYPE "UserAccessType" AS ENUM ('Freemium', 'Premium');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "access" "UserAccessType" DEFAULT 'Freemium';
