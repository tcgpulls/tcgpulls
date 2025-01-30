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
    supertype
    subtypes
    hp
    types
    evolvesFrom
    flavorText
    artist
    rarity
    retreatCost
    convertedRetreatCost
    nationalPokedexNumbers
    set {
      id
      tcgSetId
      name
      series
      releaseDate
      logoApiUrl
      symbolApiUrl
    }
    abilities {
      id
      name
      text
      type
    }
    attacks {
      id
      name
      text
      cost
      damage
      convertedEnergyCost
    }
    weaknesses {
      id
      type
      value
    }
    resistances {
      id
      type
      value
    }
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
