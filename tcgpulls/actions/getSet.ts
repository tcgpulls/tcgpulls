"use server";

import { PokemonSet } from "@prisma/client";
import axiosInstance from "@/utils/axiosInstance";
import serverLog from "@/utils/serverLog";
import { TcgLangT, TcgBrandT } from "@/types/Tcg";

interface FetchSetParams {
  tcgBrand: TcgBrandT;
  tcgLang: TcgLangT;
  setId: string;
}

export async function getSet({
  tcgBrand,
  tcgLang,
  setId,
}: FetchSetParams): Promise<PokemonSet> {
  try {
    serverLog(`Fetching set for tcgBrand: ${tcgBrand}, setId: ${setId}`);
    const response = await axiosInstance.get(
      `/api/public/tcg/${tcgBrand}/sets/${setId}`,
      {
        params: {
          tcgLang,
        },
      },
    );
    serverLog(`Successfully fetched set: ${response.data.data.setId}`);
    return response.data.data;
  } catch (error: unknown) {
    let errorMessage = "Unknown error in getSet";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    serverLog("error", `Error fetching set: ${errorMessage}`, {
      tcgBrand,
      setId,
      error,
    });
    throw error;
  }
}
