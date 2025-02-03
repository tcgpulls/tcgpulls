"use client";

import { ReactNode } from "react";
import { usePokemonCollection } from "@/hooks/tcg/pokemon/usePokemonCollection";

type RenderProps = {
  isInCollection: boolean;
  collectionId: string | null;
  loading: boolean;
  addToCollection: () => Promise<void>;
  removeFromCollection: () => Promise<void>;
  toggleCollection: () => Promise<void>;
};

type AddCardToCollectionProps = {
  cardId: string;
  children: (props: RenderProps) => ReactNode;
};

export default function AddCardToCollection({
  cardId,
  children,
}: AddCardToCollectionProps) {
  const {
    isInCollection,
    collectionId,
    loading,
    addToCollection,
    removeFromCollection,
    toggleCollection,
  } = usePokemonCollection(cardId);

  return (
    <>
      {children({
        isInCollection,
        collectionId,
        loading,
        addToCollection,
        removeFromCollection,
        toggleCollection,
      })}
    </>
  );
}
