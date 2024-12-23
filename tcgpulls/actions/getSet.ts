"use server";

import { PokemonSet } from "@prisma/client";
import axiosInstance from "@/utils/axiosInstance";
import customLog from "@/utils/customLog";
import { POKEMON_SUPPORTED_LANGUAGES } from "@/constants/tcg/pokemon";
import { TcgTypeT } from "@/types/Tcg";

interface FetchSetParams {
  tcgType: TcgTypeT;
  setId: string;
}

export async function getSet({
  tcgType,
  setId,
}: FetchSetParams): Promise<PokemonSet> {
  try {
    customLog(`Fetching set for tcgType: ${tcgType}, setId: ${setId}`);
    const response = await axiosInstance.get(
      `/api/public/tcg/${tcgType}/sets/${setId}`,
      {
        params: {
          tcgLang: POKEMON_SUPPORTED_LANGUAGES[0],
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
      tcgType,
      setId,
      error,
    });
    throw error;
  }
}
