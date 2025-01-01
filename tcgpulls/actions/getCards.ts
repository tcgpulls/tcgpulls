"use server";

import { PokemonCard } from "@prisma/client";
import axiosInstance from "@/utils/axiosInstance";
import customLog from "@/utils/customLog";
import { TcgSortOrderT, TcgBrandT } from "@/types/Tcg";

interface FetchCardsParams {
  tcgLang: string;
  tcgBrand: TcgBrandT;
  setIds: string[];
  offset: number;
  limit: number;
  sortBy: string;
  sortOrder: TcgSortOrderT;
}

export async function getCards({
  tcgLang,
  tcgBrand,
  setIds,
  offset,
  limit,
  sortBy,
  sortOrder,
}: FetchCardsParams): Promise<PokemonCard[]> {
  try {
    customLog(
      `getCards: Fetching cards for setIds=[${setIds.join(", ")}], offset=${offset}, limit=${limit}`,
    );

    const response = await axiosInstance.get(
      `/api/public/tcg/${tcgBrand}/cards`,
      {
        params: {
          tcgLang, // e.g. "en"
          limit,
          offset,
          sortOrder,
          sortBy,
          setId: setIds.join(","), // e.g. ?setId=swsh1
        },
      },
    );

    customLog(
      `getCards: API returned ${response.data.data.length} cards successfully.`,
    );
    return response.data.data;
  } catch (error: unknown) {
    let errorMessage = "Unknown error in getCards";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    customLog("error", `getCards: Error fetching cards: ${errorMessage}`, {
      setIds,
      offset,
      limit,
      error,
    });
    throw error;
  }
}
