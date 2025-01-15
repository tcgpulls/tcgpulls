import { prisma } from "packages/prisma/index";
import serverLog from "tcgpulls/utils/serverLog";

async function clearAllPokemonData() {
  try {
    serverLog("🗑️ Starting to wipe all Pokémon-related data...");

    // Step 1: Delete Pokémon card-related data
    serverLog("🔹 Deleting Pokémon card abilities...");
    await prisma.pokemonCardAbility.deleteMany({});
    serverLog("✅ Deleted all Pokémon card abilities.");

    serverLog("🔹 Deleting Pokémon card attacks...");
    await prisma.pokemonCardAttack.deleteMany({});
    serverLog("✅ Deleted all Pokémon card attacks.");

    serverLog("🔹 Deleting Pokémon card weaknesses...");
    await prisma.pokemonCardWeakness.deleteMany({});
    serverLog("✅ Deleted all Pokémon card weaknesses.");

    // Step 2: Delete Pokémon cards
    serverLog("🔹 Deleting all Pokémon cards...");
    await prisma.pokemonCard.deleteMany({});
    serverLog("✅ Deleted all Pokémon cards.");

    // Step 3: Clear parent-child relationships in Pokémon sets
    serverLog("🔹 Clearing parent-child relationships in Pokémon sets...");
    await prisma.pokemonSet.updateMany({
      data: { parentSetId: null },
    });
    serverLog("✅ Cleared all parent-child relationships.");

    // Step 4: Delete Pokémon sets
    serverLog("🔹 Deleting all Pokémon sets...");
    await prisma.pokemonSet.deleteMany({});
    serverLog("✅ Deleted all Pokémon sets.");

    serverLog("🎉 All Pokémon-related data has been successfully wiped.");
  } catch (error) {
    serverLog("error", "❌ Error wiping Pokémon data:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

clearAllPokemonData().catch((error) => {
  serverLog("error", "❌ Error in clearAllPokemonData script:", error);
  process.exit(1);
});
