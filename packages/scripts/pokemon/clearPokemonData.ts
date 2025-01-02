import { prisma } from "@tcg/prisma";
import customLog from "tcgpulls/utils/customLog";

async function clearAllPokemonData() {
  try {
    customLog("🗑️ Starting to wipe all Pokémon-related data...");

    // Step 1: Delete Pokémon card-related data
    customLog("🔹 Deleting Pokémon card abilities...");
    await prisma.pokemonCardAbility.deleteMany({});
    customLog("✅ Deleted all Pokémon card abilities.");

    customLog("🔹 Deleting Pokémon card attacks...");
    await prisma.pokemonCardAttack.deleteMany({});
    customLog("✅ Deleted all Pokémon card attacks.");

    customLog("🔹 Deleting Pokémon card weaknesses...");
    await prisma.pokemonCardWeakness.deleteMany({});
    customLog("✅ Deleted all Pokémon card weaknesses.");

    // Step 2: Delete Pokémon cards
    customLog("🔹 Deleting all Pokémon cards...");
    await prisma.pokemonCard.deleteMany({});
    customLog("✅ Deleted all Pokémon cards.");

    // Step 3: Clear parent-child relationships in Pokémon sets
    customLog("🔹 Clearing parent-child relationships in Pokémon sets...");
    await prisma.pokemonSet.updateMany({
      data: { parentSetId: null },
    });
    customLog("✅ Cleared all parent-child relationships.");

    // Step 4: Delete Pokémon sets
    customLog("🔹 Deleting all Pokémon sets...");
    await prisma.pokemonSet.deleteMany({});
    customLog("✅ Deleted all Pokémon sets.");

    customLog("🎉 All Pokémon-related data has been successfully wiped.");
  } catch (error) {
    customLog("error", "❌ Error wiping Pokémon data:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

clearAllPokemonData().catch((error) => {
  customLog("error", "❌ Error in clearAllPokemonData script:", error);
  process.exit(1);
});
