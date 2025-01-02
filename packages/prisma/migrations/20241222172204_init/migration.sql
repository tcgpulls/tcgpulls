-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "PokemonSet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "setId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "printedTotal" INTEGER NOT NULL,
    "ptcgoCode" TEXT,
    "series" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "logo" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "localLogo" TEXT,
    "localSymbol" TEXT,
    "parentSetId" TEXT,
    "isBoosterPack" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PokemonSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonCard" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "setId" TEXT NOT NULL,
    "variant" TEXT NOT NULL DEFAULT 'normal',
    "name" TEXT NOT NULL,
    "supertype" TEXT NOT NULL,
    "subtypes" TEXT[],
    "hp" INTEGER,
    "types" TEXT[],
    "evolvesFrom" TEXT,
    "flavorText" TEXT,
    "number" TEXT NOT NULL,
    "normalizedNumber" INTEGER NOT NULL DEFAULT 999,
    "artist" TEXT,
    "rarity" TEXT,
    "nationalPokedexNumbers" INTEGER[],
    "imagesSmall" TEXT NOT NULL,
    "imagesLarge" TEXT NOT NULL,
    "localImageSmall" TEXT,
    "localImageLarge" TEXT,
    "retreatCost" TEXT[],
    "convertedRetreatCost" INTEGER,
    "language" TEXT NOT NULL,
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
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "PokemonSet_setId_language_key" ON "PokemonSet"("setId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "PokemonCard_cardId_language_setId_variant_key" ON "PokemonCard"("cardId", "language", "setId", "variant");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonSet" ADD CONSTRAINT "PokemonSet_parentSetId_fkey" FOREIGN KEY ("parentSetId") REFERENCES "PokemonSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonCard" ADD CONSTRAINT "PokemonCard_setId_fkey" FOREIGN KEY ("setId") REFERENCES "PokemonSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonCardAbility" ADD CONSTRAINT "PokemonCardAbility_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "PokemonCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonCardAttack" ADD CONSTRAINT "PokemonCardAttack_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "PokemonCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonCardWeakness" ADD CONSTRAINT "PokemonCardWeakness_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "PokemonCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
