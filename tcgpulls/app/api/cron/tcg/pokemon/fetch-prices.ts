// app/api/cron/pokemon/fetch-prices.ts

import type { NextApiRequest, NextApiResponse } from "next";
import customLog from "@/utils/customLog";
import { fetchAndStorePokemonPrices } from "@/scripts/pokemon/fetchAndStorePokemonCardPrices";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.query.secret !== process.env.CRON_SECRET) {
      return res.status(401).json({ status: "Unauthorized" });
    }

    customLog("info", "[fetch-prices] Starting cron job...");
    await fetchAndStorePokemonPrices();
    customLog("info", "[fetch-prices] Finished successfully.");

    res
      .status(200)
      .json({ status: "OK", message: "Prices updated successfully" });
  } catch (error) {
    customLog("error", "[fetch-prices] Error during cron job", error);
    res.status(500).json({ status: "ERROR", message: String(error) });
  }
}
