"use server";

import { PokemonCard } from "@prisma/client";
import axiosInstance from "@/utils/axiosInstance";
import serverLog from "@/utils/serverLog";
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
    serverLog(`Fetching card for tcgBrand: ${tcgBrand}, cardId: ${cardId}`);
    const response = await axiosInstance.get(
      `/api/public/tcg/${tcgBrand}/cards/${cardId}`,
      {
        params: {
          tcgLang,
        },
      },
    );
    serverLog(`Successfully fetched card: ${response.data.data.cardId}`);
    return response.data.data;
  } catch (error: unknown) {
    let errorMessage = "Unknown error in getCard";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    serverLog("error", `Error fetching card: ${errorMessage}`, {
      tcgBrand,
      tcgLang,
      cardId,
      error,
    });
    throw error;
  }
}
