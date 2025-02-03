-- CreateTable
CREATE TABLE "PokemonCollectionItem" (
    "id" TEXT NOT NULL,
    "user" TEXT,
    "card" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(18,2) DEFAULT 0.00,
    "condition" TEXT DEFAULT 'near-mint',
    "gradingCompany" TEXT,
    "gradingRating" TEXT,
    "acquiredAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "PokemonCollectionItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PokemonCollectionItem_user_idx" ON "PokemonCollectionItem"("user");

-- CreateIndex
CREATE INDEX "PokemonCollectionItem_card_idx" ON "PokemonCollectionItem"("card");

-- AddForeignKey
ALTER TABLE "PokemonCollectionItem" ADD CONSTRAINT "PokemonCollectionItem_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonCollectionItem" ADD CONSTRAINT "PokemonCollectionItem_card_fkey" FOREIGN KEY ("card") REFERENCES "PokemonCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
