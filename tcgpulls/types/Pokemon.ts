export type PokemonTcgApiSetT = {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  legalities: {
    unlimited?: string;
    standard?: string;
    expanded?: string;
  };
  ptcgoCode: string;
  releaseDate: string; // Format: YYYY/MM/DD
  updatedAt: string; // Format: YYYY/MM/DD HH:MM:SS
  images: {
    symbol: string;
    logo: string;
  };
};

export enum PokemonEnergyT {
  Grass = "Grass",
  Fire = "Fire",
  Water = "Water",
  Lightning = "Lightning",
  Fighting = "Fighting",
  Psychic = "Psychic",
  Fairy = "Fairy",
  Darkness = "Darkness",
  Metal = "Metal",
  Colorless = "Colorless",
  Free = "Free",
}

export enum PokemonCardVariantT {
  Normal = "normal",
  Holo = "holo",
  ReverseHolo = "reverseHolo",
}
