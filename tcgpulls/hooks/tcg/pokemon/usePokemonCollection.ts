"use client";

import { useQuery, useMutation } from "@apollo/client";
import {
  ADD_CARD_TO_POKEMON_COLLECTION,
  GET_POKEMON_COLLECTION_CARD,
  GET_USER_POKEMON_COLLECTION_ITEMS_FOR_CARD,
  REMOVE_CARD_FROM_POKEMON_COLLECTION,
  UPDATE_CARD_IN_COLLECTION, // <-- import this
} from "@/graphql/tcg/pokemon/collection/queries";
import { PokemonCollectionItem } from "@/graphql/generated";
import { useSession } from "next-auth/react";

export type AdditionalCollectionFields = {
  quantity?: number;
  price?: string;
  acquiredAt?: string; // we send an ISO string for the timestamp
  notes?: string;
  condition?: string;
  gradingCompany?: string;
  gradingRating?: string;
};

type UsePokemonCollectionReturn = {
  isInCollection: boolean;
  collectionId: string | null;
  loading: boolean;
  addToCollection: (fields?: AdditionalCollectionFields) => Promise<void>;
  updateCollection: (
    id: string,
    fields?: AdditionalCollectionFields,
  ) => Promise<void>; // <-- add this
  removeFromCollection: (itemId: string) => Promise<void>;
  toggleCollection: (itemId: string) => Promise<void>;
  refetch: () => Promise<any>;
};

export function usePokemonCollection(
  cardId: string,
): UsePokemonCollectionReturn {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const { data, loading, refetch } = useQuery(GET_POKEMON_COLLECTION_CARD, {
    variables: { cardWhere: { id: cardId } },
  });

  const userCollections = data?.pokemonCard?.collections ?? [];
  const matchingRecord = userCollections.find(
    (collection: PokemonCollectionItem) =>
      collection.user?.id === currentUserId,
  );

  const existingCollectionId = matchingRecord?.id ?? null;
  const isInCollection = Boolean(existingCollectionId);

  // Prepare the ADD, UPDATE, and REMOVE mutations.
  const [addMutation, { loading: addLoading }] = useMutation(
    ADD_CARD_TO_POKEMON_COLLECTION,
  );
  const [removeMutation, { loading: removeLoading }] = useMutation(
    REMOVE_CARD_FROM_POKEMON_COLLECTION,
  );
  const [updateMutation, { loading: updateLoading }] = useMutation(
    UPDATE_CARD_IN_COLLECTION,
  );

  async function addToCollection(fields?: AdditionalCollectionFields) {
    if (!cardId) return;
    await addMutation({
      variables: {
        data: {
          card: { connect: { id: cardId } },
          ...fields,
        },
      },
    });
    await refetch();
  }

  async function updateCollection(
    id: string,
    fields?: AdditionalCollectionFields,
  ) {
    await updateMutation({
      variables: {
        id,
        data: {
          ...fields,
        },
      },
    });
    await refetch();
  }

  async function removeFromCollection(itemId: string) {
    if (!itemId) return;
    await removeMutation({
      variables: { id: itemId },
    });
    await refetch();
  }

  async function toggleCollection(itemId: string) {
    if (isInCollection) {
      await removeFromCollection(itemId);
    } else {
      await addToCollection();
    }
  }

  return {
    isInCollection,
    collectionId: existingCollectionId,
    loading: loading || addLoading || removeLoading || updateLoading,
    addToCollection,
    updateCollection,
    removeFromCollection,
    toggleCollection,
    refetch,
  };
}
