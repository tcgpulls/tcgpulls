// src/actions/getSets.ts
"use server";

import { PokemonSet } from "@prisma/client";
import axiosInstance from "@/utils/axiosInstance";
import customLog from "@/utils/customLog";

interface FetchSetsParams {
  tcgType: string;
  offset: number;
  limit: number;
}

export async function getSets({
  tcgType,
  offset,
  limit,
}: FetchSetsParams): Promise<PokemonSet[]> {
  try {
    customLog(
      `Fetching sets for tcgType: ${tcgType}, offset: ${offset}, limit: ${limit}`,
    );
    const response = await axiosInstance.get(
      `/api/public/tcg/${tcgType}/sets`,
      {
        params: {
          tcg_language: "en",
          limit,
          offset,
        },
      },
    );
    customLog(`Successfully fetched ${response.data.data.length} sets.`);
    return response.data.data;
  } catch (error: any) {
    customLog("error", `Error fetching sets: ${error.message}`, {
      tcgType,
      offset,
      limit,
      error,
    });
    throw error;
  }
}
