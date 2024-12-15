import { NextResponse } from "next/server";
import { fetchPokemonSets } from "@/services/pokemon/fetchPokemonSets";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Parse query parameters
  const tcg_language = searchParams.get("tcg_language") || "en";
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
  const limit = parseInt(searchParams.get("limit") || "50", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  if (!tcg_language) {
    return NextResponse.json(
      { error: 'The "tcg_language" query parameter is required.' },
      { status: 400 },
    );
  }

  try {
    const { sets, total } = await fetchPokemonSets({
      language: tcg_language,
      sortOrder,
      limit,
      offset,
      isBoosterPack: true, // Only fetch booster packs
    });

    if (sets.length === 0) {
      return NextResponse.json(
        { message: `No packs found for language: ${tcg_language}` },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: sets, total });
  } catch (error) {
    console.error("Error fetching Pokémon packs:", error);
    return NextResponse.json(
      { error: "Failed to fetch Pokémon packs from database." },
      { status: 500 },
    );
  }
}
