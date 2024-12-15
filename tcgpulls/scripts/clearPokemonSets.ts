import { prisma } from "@/lib/prisma";
import customLog from "@/utils/customLog";

async function clearPokemonSets() {
  try {
    customLog("Wiping existing Pokémon sets from the database...");
    await prisma.pokemonSet.deleteMany({});
    customLog("Existing Pokémon sets wiped successfully.");
  } catch (error) {
    customLog("error", "Error wiping the Pokémon sets table:", error);
    process.exit(1);
  }
}

clearPokemonSets().catch((error) => {
  customLog("error", "Error in clearPokemonSets script:", error);
  process.exit(1);
});
