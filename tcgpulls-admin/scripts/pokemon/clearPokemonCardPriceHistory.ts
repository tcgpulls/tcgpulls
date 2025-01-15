import { prisma } from "packages/prisma/index";
import serverLog from "tcgpulls/utils/serverLog";

async function clearPokemonCardPriceHistory() {
  try {
    serverLog("🗑️ Starting to wipe all Pokémon-related price history...");

    // Step 1: Delete Pokémon card-related price history
    serverLog("🔹 Deleting Pokémon card price history...");
    await prisma.pokemonCardPriceHistory.deleteMany({});
    serverLog("✅ Deleted all Pokémon card price history.");

    // Step 2: Reset lastPriceFetchDate in the PokemonSet model
    serverLog("🔹 Resetting lastPriceFetchDate for all Pokémon sets...");
    await prisma.pokemonSet.updateMany({
      data: {
        lastPriceFetchDate: null, // Resetting to default value
      },
    });
    serverLog("✅ Reset lastPriceFetchDate for all Pokémon sets.");

    serverLog(
      "🎉 All Pokémon-related price history has been successfully wiped, and lastPriceFetchDate has been reset.",
    );
  } catch (error) {
    serverLog(
      "error",
      "❌ Error wiping Pokémon price history or resetting dates:",
      error,
    );
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

clearPokemonCardPriceHistory().catch((error) => {
  serverLog("error", "❌ Error in clearPokemonCardPriceHistory script:", error);
  process.exit(1);
});
