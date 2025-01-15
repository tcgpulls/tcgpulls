import { NextResponse } from "next/server";
import { fetchPokemonCards } from "@/services/pokemon/fetchPokemonCards";
import serverLog from "@/utils/serverLog";
import {
  POKEMON_CARDS_SORT_OPTIONS,
  POKEMON_SUPPORTED_TCG_LANGUAGES,
} from "@/constants/tcg/pokemon";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const tcgLang =
    searchParams.get("tcgLang") || POKEMON_SUPPORTED_TCG_LANGUAGES[0]; // "en"
  const sortBy = searchParams.get("sortBy") || POKEMON_CARDS_SORT_OPTIONS[0];
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
  const limit = parseInt(searchParams.get("limit") || "50", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const setIds = searchParams.get("setId")?.split(",").filter(Boolean) || [];

  serverLog("debug", "API Route Received Params:", {
    tcgLang,
    sortOrder,
    sortBy,
    limit,
    offset,
    setIds,
  });

  if (setIds.length === 0) {
    return NextResponse.json(
      { error: 'At least one "setId" must be provided as a query parameter.' },
      { status: 400 },
    );
  }

  try {
    const { cards, total } = await fetchPokemonCards({
      tcgLang,
      sortBy,
      sortOrder,
      limit,
      offset,
      setIds,
    });

    if (cards.length === 0) {
      return NextResponse.json(
        {
          message: `No cards found for the provided set IDs: ${setIds.join(", ")}`,
        },
        { status: 404 },
      );
    }

    serverLog("debug", `Route: Found ${cards.length} cards. Returning JSON.`);
    return NextResponse.json({ data: cards, total });
  } catch (error: unknown) {
    let errorMessage = "Unknown error in route";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    serverLog("error", "Error fetching Pokémon cards:", errorMessage);
    return NextResponse.json(
      { error: "Failed to fetch Pokémon cards from the database." },
      { status: 500 },
    );
  }
}
