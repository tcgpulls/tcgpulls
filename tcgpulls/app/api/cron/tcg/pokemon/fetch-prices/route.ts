export const runtime = "nodejs";

import { fetchAndStorePokemonPrices } from "@/scripts/pokemon/fetchAndStorePokemonCardPrices";
import { NextResponse } from "next/server";

console.log("ENABLE_LOGGING:", process.env.ENABLE_LOGGING);

export async function GET(req: Request) {
  console.log("RUNNING CRON JOB");
  try {
    console.log("TRYING CRON JOB");
    if (!req.headers.get("x-vercel-cron")) {
      console.log("THIS IS NOT A VERCEL CRON JOB");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.info("[fetch-prices] Starting cron job...");
    await fetchAndStorePokemonPrices();
    console.info("[fetch-prices] Finished successfully.");

    return NextResponse.json(
      {
        message: "Prices updated successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("[fetch-prices] Error during cron job", error);
    return NextResponse.json({ message: String(error) }, { status: 500 });
  }
}
