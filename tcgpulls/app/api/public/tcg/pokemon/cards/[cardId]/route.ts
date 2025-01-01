import { NextRequest, NextResponse } from "next/server";
import customLog from "@/utils/customLog";
import { fetchPokemonCard } from "@/services/pokemon/fetchPokemonCard";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      cardId: string;
    }>;
  },
) {
  const { cardId } = await params;
  const { searchParams } = new URL(request.url);

  const tcgLang = searchParams.get("tcgLang");
  if (!tcgLang) {
    return NextResponse.json(
      { error: "A 'tcgLang' query parameter is required." },
      { status: 400 },
    );
  }

  customLog("debug", "[cardId]/route.ts: GET request received", {
    cardId,
    tcgLang,
  });

  if (!cardId) {
    return NextResponse.json(
      { error: "No cardId was provided in the route." },
      { status: 400 },
    );
  }

  try {
    const card = await fetchPokemonCard({ cardId, language: tcgLang });

    if (!card) {
      return NextResponse.json(
        {
          message: `No card found for cardId=${cardId}, language=${tcgLang}`,
        },
        { status: 404 },
      );
    }

    customLog("debug", "[cardId]/route.ts: Found card, returning JSON.");
    return NextResponse.json({ data: card }, { status: 200 });
  } catch (error: unknown) {
    let errorMessage = "Unknown error in single-card route";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    customLog("error", "Error fetching single Pokémon card:", errorMessage);
    return NextResponse.json(
      { error: "Failed to fetch single Pokémon card from the database." },
      { status: 500 },
    );
  }
}
