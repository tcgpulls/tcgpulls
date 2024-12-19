-- AlterTable
ALTER TABLE "PokemonCard" ADD COLUMN     "localImageLarge" TEXT,
ADD COLUMN     "localImageSmall" TEXT;

-- AlterTable
ALTER TABLE "PokemonSet" ADD COLUMN     "localLogo" TEXT,
ADD COLUMN     "localSymbol" TEXT;
