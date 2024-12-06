import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get("language");
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc"; // Default to "desc"

  if (!language) {
    return NextResponse.json(
      { error: 'The "language" query parameter is required.' },
      { status: 400 },
    );
  }

  try {
    console.log(
      `Fetching sets from database with language: ${language}, sortOrder: ${sortOrder}`,
    );

    // Fetch and sort by insertionOrder
    const sets = await prisma.pokemonSet.findMany({
      where: { language },
      orderBy: { insertionOrder: sortOrder }, // Use insertionOrder for sorting
    });

    if (!sets || sets.length === 0) {
      console.warn(`No sets found for language: ${language}`);
      return NextResponse.json(
        { message: `No sets found for language: ${language}` },
        { status: 404 },
      );
    }

    console.log(`Found ${sets.length} sets for language: ${language}`);
    return NextResponse.json(sets);
  } catch (error) {
    console.error("Error in API handler:", error);
    return NextResponse.json(
      { error: "Failed to fetch Pokémon sets from database." },
      { status: 500 },
    );
  }
}
