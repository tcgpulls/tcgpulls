import { prisma } from "@/lib/prisma";

export async function fetchPokemonSets({
  language,
  sortOrder = "desc",
  limit = 50,
  offset = 0,
  isBoosterPack = null, // Optional filter for booster packs
}: {
  language: string;
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
  isBoosterPack?: boolean | null;
}) {
  const whereClause: any = { language };
  if (isBoosterPack !== null) {
    whereClause.isBoosterPack = isBoosterPack;
  }

  const total = await prisma.pokemonSet.count({
    where: whereClause,
  });

  const sets = await prisma.pokemonSet.findMany({
    where: whereClause,
    orderBy: { releaseDate: sortOrder },
    take: limit,
    skip: offset,
  });

  return { sets, total };
}
