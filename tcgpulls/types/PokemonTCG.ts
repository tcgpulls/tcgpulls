export interface PokemonTCGSetT {
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
}
