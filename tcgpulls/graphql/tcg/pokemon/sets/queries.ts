import { gql } from "@apollo/client";

export const PokemonSetItem = gql`
  fragment PokemonSetItem on PokemonSet {
    id
    tcgSetId
    name
    releaseDate
    logoApiUrl
    logoStorageUrl
  }
`;

export const GET_POKEMON_SET = gql`
  query GetPokemonSet($where: PokemonSetWhereUniqueInput!) {
    pokemonSet(where: $where) {
      ...PokemonSetItem
    }
  }

  ${PokemonSetItem}
`;

export const GET_POKEMON_SETS = gql`
  query GetPokemonSets(
    $where: PokemonSetWhereInput!
    $orderBy: [PokemonSetOrderByInput!]!
    $take: Int
    $skip: Int!
  ) {
    pokemonSets(where: $where, orderBy: $orderBy, take: $take, skip: $skip) {
      ...PokemonSetItem
    }
  }

  ${PokemonSetItem}
`;
