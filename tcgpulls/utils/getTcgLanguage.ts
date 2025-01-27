"use server";

import { cookies } from "next/headers";
import { POKEMON_SUPPORTED_TCG_LANGUAGES } from "@/constants/tcg/pokemon";

const getTcgLanguage = async (): Promise<string> => {
  const cookieStore = await cookies();
  // Default to 'en' if not set
  return (
    cookieStore.get("tcgLang")?.value || POKEMON_SUPPORTED_TCG_LANGUAGES[0]
  );
};

export default getTcgLanguage;
