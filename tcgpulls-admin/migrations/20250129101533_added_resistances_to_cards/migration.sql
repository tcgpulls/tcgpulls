-- CreateTable
CREATE TABLE "PokemonCardResistance" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT '',
    "value" TEXT NOT NULL DEFAULT '',
    "card" TEXT,

    CONSTRAINT "PokemonCardResistance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PokemonCardResistance_card_idx" ON "PokemonCardResistance"("card");

-- AddForeignKey
ALTER TABLE "PokemonCardResistance" ADD CONSTRAINT "PokemonCardResistance_card_fkey" FOREIGN KEY ("card") REFERENCES "PokemonCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
