"use client";

import { useQuery, useMutation } from "@apollo/client";
import {
  ADD_CARD_TO_COLLECTION,
  GET_CARD_COLLECTION_ENTRY,
  REMOVE_CARD_FROM_COLLECTION,
} from "@/graphql/tcg/pokemon/collection/queries";
import { PokemonCollectionItem } from "@/graphql/generated";
import { useSession } from "next-auth/react";

// Additional fields that may be passed when adding a card.
type AdditionalCollectionFields = {
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
  removeFromCollection: () => Promise<void>;
  toggleCollection: () => Promise<void>;
  refetch: () => Promise<any>;
};

/**
 * A hook that fetches and toggles a user's collection state for a single PokemonCard (by ID).
 * We assume the user is logged in and that your Apollo client is sending the JWT in headers.
 */
export function usePokemonCollection(
  cardId: string,
): UsePokemonCollectionReturn {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  // Query the card's collection entry.
  const { data, loading, refetch } = useQuery(GET_CARD_COLLECTION_ENTRY, {
    variables: { cardWhere: { id: cardId } },
  });

  const userCollections = data?.pokemonCard?.collections ?? [];

  const matchingRecord = userCollections.find(
    (collection: PokemonCollectionItem) =>
      collection.user?.id === currentUserId,
  );

  const existingCollectionId = matchingRecord?.id ?? null;
  const isInCollection = Boolean(existingCollectionId);

  // Prepare the ADD and REMOVE mutations.
  const [addMutation, { loading: addLoading }] = useMutation(
    ADD_CARD_TO_COLLECTION,
  );
  const [removeMutation, { loading: removeLoading }] = useMutation(
    REMOVE_CARD_FROM_COLLECTION,
  );

  // Function to add the card to the collection.
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

  // Function to remove the card from the collection.
  async function removeFromCollection() {
    if (!existingCollectionId) return;
    await removeMutation({
      variables: { id: existingCollectionId },
    });
    await refetch();
  }

  // One-click toggle function.
  async function toggleCollection() {
    if (isInCollection) {
      await removeFromCollection();
    } else {
      await addToCollection();
    }
  }

  return {
    isInCollection,
    collectionId: existingCollectionId,
    loading: loading || addLoading || removeLoading,
    addToCollection,
    removeFromCollection,
    toggleCollection,
    refetch,
  };
}
