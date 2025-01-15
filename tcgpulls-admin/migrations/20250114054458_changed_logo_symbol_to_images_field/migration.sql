-- CreateTable
CREATE TABLE "PokemonSet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "tcgSetId" TEXT NOT NULL DEFAULT '',
    "language" TEXT NOT NULL DEFAULT '',
    "tcgSetId_language" TEXT NOT NULL DEFAULT '',
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "printedTotal" INTEGER NOT NULL,
    "ptcgoCode" TEXT,
    "series" TEXT NOT NULL DEFAULT '',
    "total" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "logoRemoteUrl" TEXT NOT NULL DEFAULT '',
    "symbolRemoteUrl" TEXT NOT NULL DEFAULT '',
    "storageLogo_id" TEXT,
    "storageLogo_filesize" INTEGER,
    "storageLogo_width" INTEGER,
    "storageLogo_height" INTEGER,
    "storageLogo_extension" TEXT,
    "storageSymbol_id" TEXT,
    "storageSymbol_filesize" INTEGER,
    "storageSymbol_width" INTEGER,
    "storageSymbol_height" INTEGER,
    "storageSymbol_extension" TEXT,
    "parentSet" TEXT,
    "isBoosterPack" BOOLEAN NOT NULL DEFAULT true,
    "lastPriceFetchDate" TIMESTAMP(3),

    CONSTRAINT "PokemonSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonCard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "tcgCardId" TEXT NOT NULL DEFAULT '',
    "tcgSetId" TEXT NOT NULL DEFAULT '',
    "language" TEXT NOT NULL DEFAULT '',
    "tcgCardId_language" TEXT NOT NULL DEFAULT '',
    "variant" TEXT NOT NULL DEFAULT 'normal',
    "supertype" TEXT NOT NULL DEFAULT '',
    "subtypes" JSONB,
    "hp" INTEGER,
    "types" JSONB,
    "evolvesFrom" TEXT NOT NULL DEFAULT '',
    "flavorText" TEXT NOT NULL DEFAULT '',
    "number" TEXT NOT NULL DEFAULT '',
    "normalizedNumber" INTEGER DEFAULT 999,
    "artist" TEXT NOT NULL DEFAULT '',
    "rarity" TEXT NOT NULL DEFAULT '',
    "nationalPokedexNumbers" JSONB,
    "imageSmallRemoteUrl" TEXT NOT NULL DEFAULT '',
    "imageLargeRemoteUrl" TEXT NOT NULL DEFAULT '',
    "storageImageSmall_id" TEXT,
    "storageImageSmall_filesize" INTEGER,
    "storageImageSmall_width" INTEGER,
    "storageImageSmall_height" INTEGER,
    "storageImageSmall_extension" TEXT,
    "storageImageLarge_id" TEXT,
    "storageImageLarge_filesize" INTEGER,
    "storageImageLarge_width" INTEGER,
    "storageImageLarge_height" INTEGER,
    "storageImageLarge_extension" TEXT,
    "retreatCost" JSONB,
    "convertedRetreatCost" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "set" TEXT,

    CONSTRAINT "PokemonCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonCardPriceHistory" (
    "id" TEXT NOT NULL,
    "card" TEXT,
    "variant" TEXT NOT NULL DEFAULT '',
    "tcgplayerData" JSONB,
    "cardmarketData" JSONB,
    "fetchedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "priceDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "PokemonCardPriceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonCardAbility" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "text" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL DEFAULT '',
    "card" TEXT,

    CONSTRAINT "PokemonCardAbility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonCardAttack" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "cost" JSONB,
    "convertedEnergyCost" INTEGER NOT NULL,
    "damage" TEXT NOT NULL DEFAULT '',
    "text" TEXT NOT NULL DEFAULT '',
    "card" TEXT,

    CONSTRAINT "PokemonCardAttack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonCardWeakness" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT '',
    "value" TEXT NOT NULL DEFAULT '',
    "card" TEXT,

    CONSTRAINT "PokemonCardWeakness_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PokemonSet_tcgSetId_language_key" ON "PokemonSet"("tcgSetId_language");

-- CreateIndex
CREATE INDEX "PokemonSet_parentSet_idx" ON "PokemonSet"("parentSet");

-- CreateIndex
CREATE UNIQUE INDEX "PokemonCard_tcgCardId_language_key" ON "PokemonCard"("tcgCardId_language");

-- CreateIndex
CREATE INDEX "PokemonCard_set_idx" ON "PokemonCard"("set");

-- CreateIndex
CREATE INDEX "PokemonCardPriceHistory_card_idx" ON "PokemonCardPriceHistory"("card");

-- CreateIndex
CREATE INDEX "PokemonCardAbility_card_idx" ON "PokemonCardAbility"("card");

-- CreateIndex
CREATE INDEX "PokemonCardAttack_card_idx" ON "PokemonCardAttack"("card");

-- CreateIndex
CREATE INDEX "PokemonCardWeakness_card_idx" ON "PokemonCardWeakness"("card");

-- AddForeignKey
ALTER TABLE "PokemonSet" ADD CONSTRAINT "PokemonSet_parentSet_fkey" FOREIGN KEY ("parentSet") REFERENCES "PokemonSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonCard" ADD CONSTRAINT "PokemonCard_set_fkey" FOREIGN KEY ("set") REFERENCES "PokemonSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonCardPriceHistory" ADD CONSTRAINT "PokemonCardPriceHistory_card_fkey" FOREIGN KEY ("card") REFERENCES "PokemonCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonCardAbility" ADD CONSTRAINT "PokemonCardAbility_card_fkey" FOREIGN KEY ("card") REFERENCES "PokemonCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonCardAttack" ADD CONSTRAINT "PokemonCardAttack_card_fkey" FOREIGN KEY ("card") REFERENCES "PokemonCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonCardWeakness" ADD CONSTRAINT "PokemonCardWeakness_card_fkey" FOREIGN KEY ("card") REFERENCES "PokemonCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
