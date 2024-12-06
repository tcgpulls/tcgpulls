export type TCGDexSupportedLanguages =
  | "en" // English
  | "fr" // French
  | "es" // Spanish
  | "it" // Italian
  | "pt" // Portuguese
  | "pt-br" // Brazilian Portuguese
  | "pt-pt" // Portugal Portuguese
  | "de" // German
  | "nl" // Dutch
  | "pl" // Polish
  | "ru" // Russian
  | "ja" // Japanese
  | "ko" // Korean
  | "zh-tw" // Chinese Traditional
  | "id" // Indonesian
  | "th" // Thai
  | "zh-cn"; // Chinese Simplified

export interface TCGSetT {
  id: string;
  name: string;
  logo?: string;
  symbol?: string;
  cardCount: {
    total: number;
    official: number;
  };
}
