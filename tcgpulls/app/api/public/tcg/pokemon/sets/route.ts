import { NextResponse } from "next/server";
import { fetchPokemonSets } from "@/services/pokemon/fetchPokemonSets";
import serverLog from "@/utils/serverLog";
import { POKEMON_SUPPORTED_TCG_LANGUAGES } from "@/constants/tcg/pokemon";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Parse query parameters
  const tcgLang =
    searchParams.get("tcgLang") || POKEMON_SUPPORTED_TCG_LANGUAGES[0];
  const tcgCategory = searchParams.get("tcgCategory") || "sets";
  const sortBy = searchParams.get("sortBy") || "releaseDate";
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
  const limit = parseInt(searchParams.get("limit") || "50", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  if (!tcgLang) {
    return NextResponse.json(
      { error: 'The "tcgLang" query parameter is required.' },
      { status: 400 },
    );
  }

  if (!tcgCategory) {
    return NextResponse.json(
      { error: 'The "tcgCategory" query parameter is required.' },
      { status: 400 },
    );
  }

  const isBoosterPack = tcgCategory === "booster-packs" ? true : null;

  try {
    const { sets, total } = await fetchPokemonSets({
      language: tcgLang,
      isBoosterPack, // Only fetch booster packs
      sortBy,
      sortOrder,
      limit,
      offset,
    });

    if (sets.length === 0) {
      return NextResponse.json(
        { message: `No sets found for language: ${tcgLang}` },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: sets, total });
  } catch (error) {
    serverLog("error", "Error fetching Pokémon sets:", error);
    return NextResponse.json(
      { error: "Failed to fetch Pokémon sets from database." },
      { status: 500 },
    );
  }
}
