// src/actions/getSets.ts
"use server";

import { PokemonSet } from "@prisma/client";
import axiosInstance from "@/utils/axiosInstance";
import customLog from "@/utils/customLog";
import { TcgCategoryT, TcgLangT, TcgSortOrderT, TcgBrandT } from "@/types/Tcg";

interface FetchSetsParams {
  tcgLang: TcgLangT;
  tcgBrand: TcgBrandT;
  tcgCategory: TcgCategoryT;
  offset: number;
  limit: number;
  sortBy: string;
  sortOrder: TcgSortOrderT;
}

export async function getSets({
  tcgLang,
  tcgBrand,
  tcgCategory,
  offset,
  limit,
  sortBy,
  sortOrder,
}: FetchSetsParams): Promise<PokemonSet[]> {
  try {
    customLog(
      `Fetching sets for tcgBrand: ${tcgBrand}, offset: ${offset}, limit: ${limit}`,
    );
    const response = await axiosInstance.get(
      `/api/public/tcg/${tcgBrand}/sets`,
      {
        params: {
          tcgLang,
          limit,
          offset,
          tcgCategory,
          sortBy,
          sortOrder,
        },
      },
    );
    customLog(`Successfully fetched ${response.data.data.length} sets.`);
    return response.data.data;
  } catch (error: any) {
    customLog("error", `Error fetching sets: ${error.message}`, {
      tcgBrand,
      offset,
      limit,
      error,
    });
    throw error;
  }
}
