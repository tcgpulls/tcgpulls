// admin/config.ts
import type { AdminConfig } from "@keystone-6/core/types";
import CustomNavigation from "./components/CustomNavigation";
import CustomLogo from "./components/CustomLogo";
import "./globals.css";

export const components: AdminConfig["components"] = {
  Logo: CustomLogo,
  Navigation: CustomNavigation,
};

// Define the lists that should be displayed on the dashboard and in the navigation
// this is not for access control, just for the UI
export const displayedLists = [
  {
    label: "Pokemon TCG",
    key: "pokemon-tcg",
    lists: [
      "PokemonSet",
      "PokemonCard",
      "PokemonCardPriceHistory",
      "PokemonCardAbility",
      "PokemonCardAttack",
      "PokemonCardWeakness",
      "PokemonCollectionItem",
    ],
  },
  {
    label: "Authentication",
    key: "authentication",
    lists: ["User", "Account", "Session", "VerificationToken", "Authenticator"],
  },
  {
    label: "CMS",
    key: "cms",
    lists: ["CmsUser", "CmsRole"],
  },
];
