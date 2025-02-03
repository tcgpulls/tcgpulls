import { gql } from "@apollo/client";

// export const GET_USER_COLLECTION_CARDS = gql`
// query GetUserCollectionCards(
//   $userId: ID!
//   $setId: String!
//   $tcgLang: String!
//   $orderBy: PokemonCardOrderByInput!
//   $take: Int!
//   $skip: Int!
// ) {
//   pokemonCards(
//     where: {
//       collections: {
//         some: {
//           user: { id: { equals: $userId } }
//         }
//       }
//       set: {
//         tcgSetId: { equals: $setId }
//         language: { equals: $tcgLang }
//       }
//     }
//     orderBy: { [orderBy.field]: orderBy.direction }
//     take: $take
//     skip: $skip
//   ) {
//     id
//     name
//   }
// }
// `;

/**
 * Checks whether the user has a particular card in their collection.
 * We use a "where" filter that matches the `card.id` = cardId.
 * Because of your Keystone "filter" access control, this returns only
 * the record that belongs to the *current* user (assuming the user is logged in).
 */
export const GET_CARD_COLLECTION_ENTRY = gql`
  query GetCardCollectionEntry($cardWhere: PokemonCardWhereUniqueInput!) {
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
export const ADD_CARD_TO_COLLECTION = gql`
  mutation AddCardToCollection($data: PokemonCollectionItemCreateInput!) {
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
export const REMOVE_CARD_FROM_COLLECTION = gql`
  mutation RemoveCardFromCollection($id: ID!) {
    deletePokemonCollectionItem(where: { id: $id }) {
      id
    }
  }
`;
