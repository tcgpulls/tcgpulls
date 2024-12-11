import { prisma } from "@/lib/prisma";

async function clearPokemonSets() {
  try {
    console.log("Wiping existing Pokémon sets from the database...");
    await prisma.pokemonSet.deleteMany({});
    console.log("Existing Pokémon sets wiped successfully.");
  } catch (error) {
    console.error("Error wiping the Pokémon sets table:", error);
    process.exit(1);
  }
}

clearPokemonSets().catch((error) => {
  console.error("Error in clearPokemonSets script:", error);
  process.exit(1);
});
