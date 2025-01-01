"use server";

import { PokemonSet } from "@prisma/client";
import axiosInstance from "@/utils/axiosInstance";
import customLog from "@/utils/customLog";
import { POKEMON_SUPPORTED_LANGUAGES } from "@/constants/tcg/pokemon";
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
    customLog(`Fetching set for tcgBrand: ${tcgBrand}, setId: ${setId}`);
    const response = await axiosInstance.get(
      `/api/public/tcg/${tcgBrand}/sets/${setId}`,
      {
        params: {
          tcgLang,
        },
      },
    );
    customLog(`Successfully fetched set: ${response.data.data.setId}`);
    return response.data.data;
  } catch (error: unknown) {
    let errorMessage = "Unknown error in getSet";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    customLog("error", `Error fetching set: ${errorMessage}`, {
      tcgBrand,
      setId,
      error,
    });
    throw error;
  }
}
