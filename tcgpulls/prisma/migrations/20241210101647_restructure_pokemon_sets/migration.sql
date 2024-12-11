/*
  Warnings:

  - You are about to drop the column `insertionOrder` on the `PokemonSet` table. All the data in the column will be lost.
  - You are about to drop the column `logo` on the `PokemonSet` table. All the data in the column will be lost.
  - You are about to drop the column `officialCards` on the `PokemonSet` table. All the data in the column will be lost.
  - You are about to drop the column `officialId` on the `PokemonSet` table. All the data in the column will be lost.
  - You are about to drop the column `symbol` on the `PokemonSet` table. All the data in the column will be lost.
  - You are about to drop the column `totalCards` on the `PokemonSet` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[originalId,language]` on the table `PokemonSet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `images` to the `PokemonSet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `legalities` to the `PokemonSet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalId` to the `PokemonSet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `printedTotal` to the `PokemonSet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `series` to the `PokemonSet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `PokemonSet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PokemonSet` table without a default value. This is not possible if the table is not empty.
  - Made the column `releaseDate` on table `PokemonSet` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "PokemonSet_id_key";

-- DropIndex
DROP INDEX "PokemonSet_language_idx";

-- AlterTable
ALTER TABLE "PokemonSet" DROP COLUMN "insertionOrder",
DROP COLUMN "logo",
DROP COLUMN "officialCards",
DROP COLUMN "officialId",
DROP COLUMN "symbol",
DROP COLUMN "totalCards",
ADD COLUMN     "images" JSONB NOT NULL,
ADD COLUMN     "legalities" JSONB NOT NULL,
ADD COLUMN     "originalId" TEXT NOT NULL,
ADD COLUMN     "printedTotal" INTEGER NOT NULL,
ADD COLUMN     "ptcgoCode" TEXT,
ADD COLUMN     "series" TEXT NOT NULL,
ADD COLUMN     "total" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "releaseDate" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PokemonSet_originalId_language_key" ON "PokemonSet"("originalId", "language");
