"use server";

import { PokemonSet } from "@prisma/client";
import axiosInstance from "@/utils/axiosInstance";
import customLog from "@/utils/customLog";

interface FetchPacksParams {
  tcgType: string;
  offset: number;
  limit: number;
}

export async function getPacks({
  tcgType,
  offset,
  limit,
}: FetchPacksParams): Promise<PokemonSet[]> {
  try {
    customLog(
      `Fetching packs for tcgType: ${tcgType}, offset: ${offset}, limit: ${limit}`,
    );
    const response = await axiosInstance.get(
      `/api/public/tcg/${tcgType}/packs`,
      {
        params: {
          tcg_language: "en",
          limit,
          offset,
        },
      },
    );
    customLog(`Successfully fetched ${response.data.data.length} packs.`);
    return response.data.data;
  } catch (error: any) {
    customLog("error", `Error fetching packs: ${error.message}`, {
      tcgType,
      offset,
      limit,
      error,
    });
    throw error;
  }
}
