import createApolloClient from "@/lib/clients/createApolloClient";
import { GET_POKEMON_CARD } from "@/graphql/tcg/pokemon/cards/queries";
import {
  GetPokemonCardQuery,
  GetPokemonCardQueryVariables,
} from "@/graphql/generated";

export async function getPokemonCard(cardSlug: string | undefined) {
  if (!cardSlug) {
    throw new Error("No card slug provided.");
  }

  const client = createApolloClient();

  try {
    const { data } = await client.query<
      GetPokemonCardQuery,
      GetPokemonCardQueryVariables
    >({
      query: GET_POKEMON_CARD,
      variables: {
        where: {
          tcgCardId_variant_language: cardSlug,
        },
      },
    });

    return data.pokemonCard;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to fetch Pokémon card data.");
    }
  }
}
