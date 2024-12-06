-- CreateTable
CREATE TABLE "PokemonSet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "symbol" TEXT,
    "totalCards" INTEGER NOT NULL,
    "officialCards" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3),

    CONSTRAINT "PokemonSet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PokemonSet_id_key" ON "PokemonSet"("id");

-- CreateIndex
CREATE INDEX "PokemonSet_language_idx" ON "PokemonSet"("language");
