import { NextRequest, NextResponse } from "next/server";
import customLog from "@/utils/customLog";
import { fetchPokemonSet } from "@/services/pokemon/fetchPokemonSet";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      setId: string;
    }>;
  },
) {
  const { setId } = await params;
  const { searchParams } = new URL(request.url);

  const tcgLang = searchParams.get("tcgLang");
  if (!tcgLang) {
    return NextResponse.json(
      { error: "A 'tcgLang' query parameter is required." },
      { status: 400 },
    );
  }

  customLog("debug", "[setId]/route.ts: GET request received", {
    setId,
    tcgLang,
  });

  if (!setId) {
    return NextResponse.json(
      { error: "No setId was provided in the route." },
      { status: 400 },
    );
  }

  try {
    const set = await fetchPokemonSet({ setId, language: tcgLang });

    if (!set) {
      return NextResponse.json(
        {
          message: `No set found for setId=${setId}, language=${tcgLang}`,
        },
        { status: 404 },
      );
    }

    customLog("debug", "[setId]/route.ts: Found set, returning JSON.");
    return NextResponse.json({ data: set });
  } catch (error: unknown) {
    let errorMessage = "Unknown error in single-set route";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    customLog("error", "Error fetching single Pokémon set:", errorMessage);
    return NextResponse.json(
      { error: "Failed to fetch single Pokémon set from the database." },
      { status: 500 },
    );
  }
}
