import { fetchAndStorePokemonPrices } from "@/scripts/pokemon/fetchAndStorePokemonCardPrices";
import { NextResponse } from "next/server";
import customLog from "@/utils/customLog";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      customLog("error", "[fetch-prices] Unauthorized request");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    customLog("info", "[fetch-prices] Starting cron job...");

    // Optionally read a chunk size from ENV or default to 10
    const chunkSize = parseInt(
      process.env.POKEMON_SET_PRICES_CRON_CHUNK_SIZE || "10",
      10,
    );

    // Call your function with chunkSize
    await fetchAndStorePokemonPrices(chunkSize);

    customLog("info", "[fetch-prices] Finished successfully.");
    return NextResponse.json(
      { message: "Prices updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    customLog("error", "[fetch-prices] Error during cron job", error);
    return NextResponse.json({ message: String(error) }, { status: 500 });
  }
}
