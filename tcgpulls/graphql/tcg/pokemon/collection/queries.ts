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
      acquiredAt
      price
      quantity
      condition
      gradingCompany
      gradingRating
      card {
        id
        tcgSetId
        tcgCardId
        number
        variant
        name
        rarity
        imageSmallStorageUrl
        imageSmallApiUrl
        imageLargeStorageUrl
        imageLargeApiUrl
        set {
          id
          name
          series
        }
      }
    }
  }
`;

/**
 * Fetches the user's collection items for a specific card.
 */
export const GET_USER_POKEMON_COLLECTION_ITEMS_FOR_CARD = gql`
  query GetUserPokemonCollectionItemsForCard(
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
      price
      quantity
      condition
      gradingCompany
      gradingRating
      notes
      acquiredAt
      card {
        id
        name
        imageSmallApiUrl
        imageSmallStorageUrl
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
 * Fetches the user's collection status for a list of card IDs.
 */
export const GET_USER_COLLECTION_STATUS = gql`
  query GetUserCollectionStatus($userId: ID!, $cardIds: [ID!]!) {
    pokemonCollectionItems(
      where: {
        user: { id: { equals: $userId } }
        card: { id: { in: $cardIds } }
      }
    ) {
      id
      quantity
      card {
        id
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
 * Updates an existing collection record by ID.
 */
export const UPDATE_CARD_IN_COLLECTION = gql`
  mutation UpdateCardInCollection(
    $id: ID!
    $data: PokemonCollectionItemUpdateInput!
  ) {
    updatePokemonCollectionItem(where: { id: $id }, data: $data) {
      id
      price
      quantity
      condition
      gradingCompany
      gradingRating
      notes
      acquiredAt
      card {
        id
        name
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
