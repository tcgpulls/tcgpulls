// import { fetchAndStorePokemonPrices } from "@tcg/scripts/pokemon/fetchAndStorePokemonCardPrices";
// import { NextResponse } from "next/server";
// import serverLog from "@/utils/serverLog";

export async function GET(req: Request) {
  console.log(req);
  // try {
  //   const authHeader = req.headers.get("authorization");
  //   if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //     serverLog("error", "[fetch-prices] Unauthorized request");
  //     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  //   }
  //
  //   serverLog("info", "[fetch-prices] Starting cron job...");
  //
  //   // Optionally read a chunk size from ENV or default to 10
  //   const chunkSize = parseInt(
  //     process.env.POKEMON_SET_PRICES_CRON_CHUNK_SIZE || "10",
  //     10,
  //   );
  //
  //   // Call your function with chunkSize
  //   await fetchAndStorePokemonPrices(chunkSize);
  //
  //   serverLog("info", "[fetch-prices] Finished successfully.");
  //   return NextResponse.json(
  //     { message: "Prices updated successfully" },
  //     { status: 200 },
  //   );
  // } catch (error) {
  //   serverLog("error", "[fetch-prices] Error during cron job", error);
  //   return NextResponse.json({ message: String(error) }, { status: 500 });
  // }
}
