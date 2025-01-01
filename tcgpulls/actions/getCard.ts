"use server";

import { PokemonCard } from "@prisma/client";
import axiosInstance from "@/utils/axiosInstance";
import customLog from "@/utils/customLog";
import { TcgBrandT } from "@/types/Tcg";

interface FetchCardParams {
  tcgBrand: TcgBrandT;
  tcgLang: string;
  cardId: string;
}

export async function getCard({
  tcgBrand,
  tcgLang,
  cardId,
}: FetchCardParams): Promise<PokemonCard> {
  try {
    customLog(`Fetching card for tcgBrand: ${tcgBrand}, cardId: ${cardId}`);
    const response = await axiosInstance.get(
      `/api/public/tcg/${tcgBrand}/cards/${cardId}`,
      {
        params: {
          tcgLang,
        },
      },
    );
    customLog(`Successfully fetched card: ${response.data.data.cardId}`);
    return response.data.data;
  } catch (error: unknown) {
    let errorMessage = "Unknown error in getCard";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    customLog("error", `Error fetching card: ${errorMessage}`, {
      tcgBrand,
      tcgLang,
      cardId,
      error,
    });
    throw error;
  }
}
