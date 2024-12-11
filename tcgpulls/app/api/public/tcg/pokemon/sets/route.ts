import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Parse query parameters with defaults
  const language = searchParams.get("language") || "en"; // Default to English
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc"; // Default to "desc"
  const limit = parseInt(searchParams.get("limit") || "50", 10); // Default to 50 results
  const offset = parseInt(searchParams.get("offset") || "0", 10); // Default to 0 offset

  if (!language) {
    return NextResponse.json(
      { error: 'The "language" query parameter is required.' },
      { status: 400 },
    );
  }

  try {
    console.log(
      `Fetching sets from database with language: ${language}, sortOrder: ${sortOrder}, limit: ${limit}, offset: ${offset}`,
    );

    // Fetch the total count of sets matching the language and not having a parentSetId
    const total = await prisma.pokemonSet.count({
      where: { language, parentSetId: null },
    });

    // Fetch sets with sorting by release date, excluding subsets, and optional pagination
    const sets = await prisma.pokemonSet.findMany({
      where: { language, parentSetId: null },
      orderBy: { releaseDate: sortOrder }, // Sort by release date
      take: limit, // Limit results for pagination
      skip: offset, // Offset results for pagination
    });

    if (!sets || sets.length === 0) {
      console.warn(`No sets found for language: ${language}`);
      return NextResponse.json(
        { message: `No sets found for language: ${language}` },
        { status: 404 },
      );
    }

    console.log(`Found ${sets.length} sets for language: ${language}`);
    return NextResponse.json({ data: sets, total });
  } catch (error) {
    console.error("Error fetching Pokémon sets:", error);
    return NextResponse.json(
      { error: "Failed to fetch Pokémon sets from database." },
      { status: 500 },
    );
  }
}
