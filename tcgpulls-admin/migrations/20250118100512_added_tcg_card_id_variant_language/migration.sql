/*
  Warnings:

  - You are about to drop the column `tcgCardId_language` on the `PokemonCard` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tcgCardId_variant_language]` on the table `PokemonCard` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PokemonCard_tcgCardId_language_key";

-- AlterTable
ALTER TABLE "PokemonCard" DROP COLUMN "tcgCardId_language",
ADD COLUMN     "tcgCardId_variant_language" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "PokemonCard_tcgCardId_variant_language_key" ON "PokemonCard"("tcgCardId_variant_language");
