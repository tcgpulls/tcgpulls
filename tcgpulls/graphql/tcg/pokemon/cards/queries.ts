import { gql } from "@apollo/client";

export const PokemonCardItem = gql`
  fragment PokemonCardItem on PokemonCard {
    id
    tcgSetId
    tcgCardId
    tcgCardId_variant_language
    name
    number
    variant
    imageSmallApiUrl
    imageLargeApiUrl
    imageSmallStorageUrl
    imageLargeStorageUrl
  }
`;

export const GET_POKEMON_CARD = gql`
  query GetPokemonCard($where: PokemonCardWhereUniqueInput!) {
    pokemonCard(where: $where) {
      ...PokemonCardItem
    }
  }

  ${PokemonCardItem}
`;

export const GET_POKEMON_CARDS = gql`
  query GetPokemonCards(
    $where: PokemonCardWhereInput!
    $orderBy: [PokemonCardOrderByInput!]!
    $take: Int
    $skip: Int!
  ) {
    pokemonCards(where: $where, orderBy: $orderBy, take: $take, skip: $skip) {
      ...PokemonCardItem
    }
  }

  ${PokemonCardItem}
`;
