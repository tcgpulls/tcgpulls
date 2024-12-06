import { Metadata } from "next";
import { fetchPokemonSets } from "@/lib/tcgdex";
import { TCGSetT } from "@/types/TCGDex";

export const metadata: Metadata = {
  title: "TCGPulls - Home",
  description: "Get your TCG pack pulls and pull rates all in one place!",
};

const HomePage = async () => {
  const language = "en"; // Adjust based on user preference or settings
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/public/tcgdex/sets?language=${language}`,
  );
  const sets: TCGSetT[] = await response.json();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Pokémon Card Sets</h1>
      {sets && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {sets.map((set) => (
            <div
              key={set.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <img
                src={
                  set.logo
                    ? `${set.logo}.webp`
                    : "https://via.placeholder.com/150"
                }
                alt={set.name}
                className="w-full h-40 object-contain mb-4"
              />
              <h2 className="text-lg font-semibold text-gray-800">
                {set.name}
              </h2>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default HomePage;
