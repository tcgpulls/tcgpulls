-- CreateTable
CREATE TABLE "PokemonCard" (
    "id" TEXT NOT NULL,
    "setId" TEXT NOT NULL,
    "originalId" TEXT NOT NULL,
    "variant" TEXT NOT NULL DEFAULT 'normal',
    "name" TEXT NOT NULL,
    "supertype" TEXT NOT NULL,
    "subtypes" TEXT[],
    "hp" INTEGER,
    "types" TEXT[],
    "evolvesFrom" TEXT,
    "flavorText" TEXT,
    "number" TEXT NOT NULL,
    "artist" TEXT,
    "rarity" TEXT,
    "nationalPokedexNumbers" INTEGER[],
    "imagesSmall" TEXT NOT NULL,
    "imagesLarge" TEXT NOT NULL,
    "retreatCost" TEXT[],
    "convertedRetreatCost" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PokemonCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonCardAbility" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "PokemonCardAbility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonCardAttack" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cost" TEXT[],
    "convertedEnergyCost" INTEGER NOT NULL,
    "damage" TEXT,
    "text" TEXT,

    CONSTRAINT "PokemonCardAttack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonCardWeakness" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "PokemonCardWeakness_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PokemonCard_setId_originalId_variant_key" ON "PokemonCard"("setId", "originalId", "variant");

-- AddForeignKey
ALTER TABLE "PokemonCard" ADD CONSTRAINT "PokemonCard_setId_fkey" FOREIGN KEY ("setId") REFERENCES "PokemonSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonCardAbility" ADD CONSTRAINT "PokemonCardAbility_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "PokemonCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonCardAttack" ADD CONSTRAINT "PokemonCardAttack_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "PokemonCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonCardWeakness" ADD CONSTRAINT "PokemonCardWeakness_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "PokemonCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
