/*
  Warnings:

  - A unique constraint covering the columns `[cardId,variant,priceDate]` on the table `PokemonCardPriceHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PokemonCardPriceHistory" ADD COLUMN     "priceDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "PokemonCardPriceHistory_cardId_variant_priceDate_key" ON "PokemonCardPriceHistory"("cardId", "variant", "priceDate");
