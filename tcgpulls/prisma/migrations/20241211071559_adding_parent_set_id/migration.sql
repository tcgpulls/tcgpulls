-- AlterTable
ALTER TABLE "PokemonSet" ADD COLUMN     "parentSetId" TEXT;

-- AddForeignKey
ALTER TABLE "PokemonSet" ADD CONSTRAINT "PokemonSet_parentSetId_fkey" FOREIGN KEY ("parentSetId") REFERENCES "PokemonSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
