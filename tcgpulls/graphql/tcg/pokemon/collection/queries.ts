import { gql } from "@apollo/client";

export const GET_USER_POKEMON_COLLECTION_ITEMS = gql`
  query GetUserPokemonCollectionItems(
    $where: PokemonCollectionItemWhereInput!
    $orderBy: [PokemonCollectionItemOrderByInput!]!
    $take: Int!
    $skip: Int!
  ) {
    pokemonCollectionItems(
      where: $where
      orderBy: $orderBy
      take: $take
      skip: $skip
    ) {
      id
      # The user’s collection-specific fields:
      acquiredAt
      # or “addedAt,” “condition,” etc.

      # Include nested card data
      card {
        id
        tcgSetId
        tcgCardId
        variant
        name
        imageSmallStorageUrl
        imageSmallApiUrl
      }
    }
  }
`;

/**
 * Checks whether the user has a particular card in their collection.
 * We use a "where" filter that matches the `card.id` = cardId.
 * Because of your Keystone "filter" access control, this returns only
 * the record that belongs to the *current* user (assuming the user is logged in).
 */
export const GET_POKEMON_COLLECTION_CARD = gql`
  query GetPokemonCollectionCard($cardWhere: PokemonCardWhereUniqueInput!) {
    # We look up the card first or skip. Alternatively, you can directly query
    # pokemonCardUserCollections(where: { card: { id: { equals: cardId } } })...
    pokemonCard(where: $cardWhere) {
      id
      collections {
        id
        user {
          id
        }
      }
    }
  }
`;

/**
 * Creates a new PokemonCardUserCollection record referencing the given cardId.
 * The backend automatically sets the "user" from context.session if not provided.
 */
export const ADD_CARD_TO_POKEMON_COLLECTION = gql`
  mutation AddCardToPokemonCollection(
    $data: PokemonCollectionItemCreateInput!
  ) {
    createPokemonCollectionItem(data: $data) {
      id
      card {
        id
      }
    }
  }
`;

/**
 * Removes an existing collection record by ID.
 */
export const REMOVE_CARD_FROM_POKEMON_COLLECTION = gql`
  mutation RemoveCardFromCollection($id: ID!) {
    deletePokemonCollectionItem(where: { id: $id }) {
      id
    }
  }
`;
