-- CreateTable
CREATE TABLE "PokemonCardPriceHistory" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "variant" TEXT NOT NULL,
    "tcgplayerData" JSONB,
    "cardmarketData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PokemonCardPriceHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PokemonCardPriceHistory" ADD CONSTRAINT "PokemonCardPriceHistory_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "PokemonCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
