import { prisma } from "@/lib/prisma";
import customLog from "@/utils/customLog";

async function clearPokemonCardPriceHistory() {
  try {
    customLog("🗑️ Starting to wipe all Pokémon-related price history...");

    // Step 1: Delete Pokémon card-related price history
    customLog("🔹 Deleting Pokémon card price history...");
    await prisma.pokemonCardPriceHistory.deleteMany({});
    customLog("✅ Deleted all Pokémon card price history.");

    customLog(
      "🎉 All Pokémon-related price history has been successfully wiped.",
    );
  } catch (error) {
    customLog("error", "❌ Error wiping Pokémon price history:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

clearPokemonCardPriceHistory().catch((error) => {
  customLog("error", "❌ Error in clearPokemonCardPriceHistory script:", error);
  process.exit(1);
});
