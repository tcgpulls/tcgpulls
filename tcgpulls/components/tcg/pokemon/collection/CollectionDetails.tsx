"use client";

import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/catalyst-ui/table";
import { FiEdit, FiTrash } from "react-icons/fi";
import { PokemonCollectionItem } from "@/graphql/generated";
import CollectionDialog from "@/components/tcg/pokemon/collection/CollectionDialog";
import CollectionRemoveDialog from "@/components/tcg/pokemon/collection/CollectionRemoveDialog";
import { useTranslations } from "use-intl";
import { CollectionCardCondition } from "@/types/Collection";
import { POKEMON_COLLECTION_DETAILS_PAGE_SIZE } from "@/constants/tcg/pokemon";
import { Pagination } from "@/components/navigation/Pagination";
import { useSession } from "next-auth/react";
import CollectionDetailsNotLoggedIn from "@/components/tcg/pokemon/collection/CollectionDetailsNotLoggedIn";
import Spinner from "@/components/misc/Spinner";
import CardPageAddToCollection from "../card-page/CardPageAddToCollection";

type Props = {
  cardId: string;
  collectionItems: PokemonCollectionItem[];
};

export default function CollectionDetails({ cardId, collectionItems }: Props) {
  const t = useTranslations();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  // Local pagination state
  const [page, setPage] = useState(1);

  // Compute total pages
  const totalPages = Math.ceil(
    collectionItems.length / POKEMON_COLLECTION_DETAILS_PAGE_SIZE,
  );

  // Slice items for the current page
  const displayedItems = useMemo(() => {
    const start = (page - 1) * POKEMON_COLLECTION_DETAILS_PAGE_SIZE;
    return collectionItems.slice(
      start,
      start + POKEMON_COLLECTION_DETAILS_PAGE_SIZE,
    );
  }, [collectionItems, page]);

  // Dialog states
  const [editItem, setEditItem] = useState<PokemonCollectionItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [removeItem, setRemoveItem] = useState<PokemonCollectionItem | null>(
    null,
  );
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

  function handleEdit(item: PokemonCollectionItem) {
    setEditItem(item);
    setIsEditDialogOpen(true);
  }

  function handleRemove(item: PokemonCollectionItem) {
    setRemoveItem(item);
    setIsRemoveDialogOpen(true);
  }

  return (
    <>
      <CollectionDialog
        cardId={editItem?.card?.id ?? ""}
        itemId={editItem?.id ?? ""}
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        editMode
        initialData={
          editItem
            ? {
                quantity: editItem.quantity ?? 1,
                price: editItem.price || "0.00",
                acquiredAt: new Date(editItem.acquiredAt).toISOString(),
                condition: editItem.condition || CollectionCardCondition.NM,
                gradingCompany: editItem.gradingCompany || "",
                gradingRating: editItem.gradingRating || "",
                notes: editItem.notes || "",
              }
            : undefined
        }
      />

      <CollectionRemoveDialog
        cardId={removeItem?.card?.id ?? ""}
        itemId={removeItem?.id ?? ""}
        cardName={removeItem?.card?.name ?? ""}
        isOpen={isRemoveDialogOpen}
        setIsOpen={setIsRemoveDialogOpen}
      />

      <h4 className="text-2xl font-semibold mb-4 flex gap-2 justify-between">
        <span>
          {t("card-page.collection")}{" "}
          {userId &&
            collectionItems.length > 0 &&
            `(${collectionItems.length})`}
        </span>
        <CardPageAddToCollection cardId={cardId} />
      </h4>
      <div>
        <div
          className={`h-[382px] flex flex-col w-full justify-stretch items-stretch bg-primary-800 rounded-xl p-3 py-2`}
        >
          {status === "loading" && (
            <div className={`h-full flex justify-center items-center`}>
              <Spinner />
            </div>
          )}
          {status === "authenticated" && (
            <div className={`h-full flex flex-col justify-between`}>
              <Table className="table-fixed w-full grow">
                <TableHead>
                  <TableRow>
                    {/* 2) Each TableHeader gets a fixed fraction, e.g. w-[12.5%] for 8 columns */}
                    <TableHeader className="w-[15%]">
                      {t("tcg.collection.details.acquired-on")}
                    </TableHeader>
                    <TableHeader className="w-[10%]">
                      {t("tcg.collection.details.condition")}
                    </TableHeader>
                    <TableHeader className="w-[10%]">
                      {t("tcg.collection.details.company")}
                    </TableHeader>
                    <TableHeader className="w-[10%]">
                      {t("tcg.collection.details.rating")}
                    </TableHeader>
                    <TableHeader className="w-[10%]">
                      {t("tcg.collection.details.quantity")}
                    </TableHeader>
                    <TableHeader className="w-[10%]">
                      {t("tcg.collection.details.price")}
                    </TableHeader>
                    <TableHeader className="w-[30%]">
                      {t("tcg.collection.details.notes")}
                    </TableHeader>
                    <TableHeader className="w-[5%]">
                      {t("tcg.collection.details.actions")}
                    </TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody className={`w-full`}>
                  {displayedItems.map((item) => {
                    if (!item.card) return null;
                    return (
                      <TableRow key={item.id} className={`w-full`}>
                        <TableCell>
                          {item.acquiredAt
                            ? new Date(item.acquiredAt).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {item.condition
                            ? t(`tcg.grading.conditions-list.${item.condition}`)
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {item.gradingCompany
                            ? t(
                                `tcg.grading.companies-list.${item.gradingCompany.toLowerCase()}`,
                              )
                            : "-"}
                        </TableCell>
                        <TableCell>{item.gradingRating || "-"}</TableCell>
                        <TableCell>{item.quantity ?? "-"}</TableCell>
                        <TableCell>
                          {item.price !== null ? `$${item.price}` : "-"}
                        </TableCell>
                        <TableCell className={`max-w-[320px]`}>
                          <p className="block max-w-full truncate">
                            {item.notes ?? "-"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1.5 items-center">
                            <div
                              className={`cursor-pointer p-1 hover:text-accent-500`}
                              onClick={() => handleEdit(item)}
                            >
                              <FiEdit size={16} />
                            </div>
                            <div
                              className={`cursor-pointer p-1 hover:text-accent-500`}
                              onClick={() => handleRemove(item)}
                            >
                              <FiTrash size={16} />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {collectionItems.length < 1 && (
                <div
                  className={`flex w-full  justify-center items-center grow`}
                >
                  <p className={`text font-medium`}>
                    {t("card-page.collection-empty")}
                  </p>
                </div>
              )}
              {totalPages > 1 && (
                <div className={`mt-2`}>
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => setPage(newPage)}
                  />
                </div>
              )}
            </div>
          )}
          {status === "unauthenticated" && <CollectionDetailsNotLoggedIn />}
        </div>
      </div>
    </>
  );
}
