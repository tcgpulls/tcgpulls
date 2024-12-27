import customLog from "@/utils/customLog";
import { fetchAndStorePokemonPrices } from "@/scripts/pokemon/fetchAndStorePokemonCardPrices";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    if (!req.headers.get("x-vercel-cron")) {
      return NextResponse.json({ status: 401, message: "Unauthorized" });
    }

    customLog("info", "[fetch-prices] Starting cron job...");
    await fetchAndStorePokemonPrices();
    customLog("info", "[fetch-prices] Finished successfully.");

    return NextResponse.json({
      status: 200,
      message: "Prices updated successfully",
    });
  } catch (error) {
    customLog("error", "[fetch-prices] Error during cron job", error);
    return NextResponse.json({ status: 500, message: String(error) });
  }
}
