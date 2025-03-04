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
import { OrderDirection, PokemonCollectionItem } from "@/graphql/generated";
import CollectionDialog from "@/components/tcg/pokemon/collection/CollectionDialog";
import CollectionRemoveDialog from "@/components/tcg/pokemon/collection/CollectionRemoveDialog";
import { useTranslations } from "use-intl";
import { CollectionCardCondition } from "@/types/Collection";
import { POKEMON_COLLECTION_DETAILS_PAGE_SIZE } from "@/constants/tcg/pokemon";
import { Pagination } from "@/components/navigation/Pagination";
import { useSession } from "next-auth/react";
import CollectionDetailsNotLoggedIn from "@/components/tcg/pokemon/collection/CollectionDetailsNotLoggedIn";
import Spinner from "@/components/misc/Spinner";
import PriceFormatter from "@/components/misc/PriceFormatter";
import SortableTableHeader from "@/components/misc/SortableTableHeader";
import useSortableTable from "@/hooks/useSortableTable";
import {
  TcgCollectionDetailsSortBy,
  TcgCollectionDetailsSortByT,
} from "@/types/Tcg";
import { PriceChangeState } from "@/types/Price";

type Props = {
  collectionItems: PokemonCollectionItem[];
};

// Temporary constant for demonstration
const TEMPORARY_PREV_PRICE = 100;

export default function CollectionDetails({ collectionItems }: Props) {
  const t = useTranslations();
  const { status } = useSession();

  // Local pagination state
  const [page, setPage] = useState(1);

  // Define a custom compare function to handle special fields
  const customCompare = (
    a: PokemonCollectionItem,
    b: PokemonCollectionItem,
    key: TcgCollectionDetailsSortByT,
  ) => {
    let aValue;
    let bValue;
    switch (key) {
      case TcgCollectionDetailsSortBy.AcquiredAt:
        aValue = a.acquiredAt ? new Date(a.acquiredAt).getTime() : 0;
        bValue = b.acquiredAt ? new Date(b.acquiredAt).getTime() : 0;
        break;
      case TcgCollectionDetailsSortBy.Price:
        aValue = parseFloat(a.price || "0");
        bValue = parseFloat(b.price || "0");
        break;
      case TcgCollectionDetailsSortBy.Condition:
        aValue = a.condition || "";
        bValue = b.condition || "";
        break;
      case TcgCollectionDetailsSortBy.GradingCompany:
        aValue = a.gradingCompany ? a.gradingCompany.toLowerCase() : "";
        bValue = b.gradingCompany ? b.gradingCompany.toLowerCase() : "";
        break;
      case TcgCollectionDetailsSortBy.GradingRating:
        aValue = a.gradingRating || "";
        bValue = b.gradingRating || "";
        break;
      case TcgCollectionDetailsSortBy.Quantity:
        aValue = a.quantity || 0;
        bValue = b.quantity || 0;
        break;
      case TcgCollectionDetailsSortBy.Notes:
        aValue = a.notes || "";
        bValue = b.notes || "";
        break;
      default:
        aValue = "";
        bValue = "";
        break;
    }
    if (aValue < bValue) return -1;
    if (aValue > bValue) return 1;
    return 0;
  };

  const { sortedItems, requestSort, sortConfig } = useSortableTable<
    PokemonCollectionItem,
    TcgCollectionDetailsSortByT
  >(
    collectionItems,
    {
      key: TcgCollectionDetailsSortBy.AcquiredAt,
      direction: OrderDirection.Desc,
    },
    customCompare,
  );

  // Compute total pages based on sorted items
  const totalPages = Math.ceil(
    sortedItems.length / POKEMON_COLLECTION_DETAILS_PAGE_SIZE,
  );

  // Slice items for the current page
  const displayedItems: PokemonCollectionItem[] = useMemo(() => {
    const start = (page - 1) * POKEMON_COLLECTION_DETAILS_PAGE_SIZE;
    return sortedItems.slice(
      start,
      start + POKEMON_COLLECTION_DETAILS_PAGE_SIZE,
    );
  }, [sortedItems, page]);

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

      <div className="w-full">
        <div className="h-[382px] flex flex-col bg-primary-800 rounded-xl p-3 py-2">
          {status === "loading" && (
            <div className="h-full flex justify-center items-center">
              <Spinner />
            </div>
          )}
          {status === "authenticated" && (
            <div className="h-full flex flex-col justify-between">
              {collectionItems.length > 0 ? (
                <>
                  {/* Main content area with table */}
                  <div className="flex-grow overflow-hidden">
                    <div className="h-full custom-scroll-container relative">
                      {/* Add a spacing div to prevent content from scrolling under the action column */}
                      <div className="absolute top-0 bottom-0 right-0 w-[5%] bg-transparent z-20 pointer-events-none" />

                      <div className="h-full">
                        <div className="custom-table-wrapper h-full">
                          <Table className="table-fixed h-full">
                            <TableHead>
                              <TableRow>
                                <SortableTableHeader
                                  label={t(
                                    "tcg.collection.details.acquired-on",
                                  )}
                                  field={TcgCollectionDetailsSortBy.AcquiredAt}
                                  requestSort={requestSort}
                                  sortConfig={sortConfig}
                                  className="w-[15%]"
                                />
                                <SortableTableHeader
                                  label={t("tcg.collection.details.condition")}
                                  field={TcgCollectionDetailsSortBy.Condition}
                                  requestSort={requestSort}
                                  sortConfig={sortConfig}
                                  className="w-[15%]"
                                />
                                <SortableTableHeader
                                  label={t("tcg.collection.details.company")}
                                  field={
                                    TcgCollectionDetailsSortBy.GradingCompany
                                  }
                                  requestSort={requestSort}
                                  sortConfig={sortConfig}
                                  className="w-[15%]"
                                />
                                <SortableTableHeader
                                  label={t("tcg.collection.details.rating")}
                                  field={
                                    TcgCollectionDetailsSortBy.GradingRating
                                  }
                                  requestSort={requestSort}
                                  sortConfig={sortConfig}
                                  className="w-[10%]"
                                />
                                <SortableTableHeader
                                  label={t("tcg.collection.details.quantity")}
                                  field={TcgCollectionDetailsSortBy.Quantity}
                                  requestSort={requestSort}
                                  sortConfig={sortConfig}
                                  className="w-[10%]"
                                />
                                <SortableTableHeader
                                  label={t("tcg.collection.details.price")}
                                  field={TcgCollectionDetailsSortBy.Price}
                                  requestSort={requestSort}
                                  sortConfig={sortConfig}
                                  className="w-[10%]"
                                />
                                <SortableTableHeader
                                  label={t("tcg.collection.details.notes")}
                                  field={TcgCollectionDetailsSortBy.Notes}
                                  requestSort={requestSort}
                                  sortConfig={sortConfig}
                                  className="w-[20%] pr-[5%]"
                                />
                                {/* Fixed action column header with enhanced z-index */}
                                <TableHeader className="w-[5%] sticky right-0 z-30 border-b border-b-primary-950/10 dark:border-b-white/10 bg-primary-800 shadow-lg">
                                  {t("tcg.collection.details.actions")}
                                </TableHeader>
                              </TableRow>
                            </TableHead>
                            <TableBody className="w-full">
                              {displayedItems.map((item) => {
                                if (!item.card) return null;
                                return (
                                  <TableRow key={item.id} className="w-full">
                                    <TableCell>
                                      {item.acquiredAt
                                        ? new Date(
                                            item.acquiredAt,
                                          ).toLocaleDateString()
                                        : "-"}
                                    </TableCell>
                                    <TableCell>
                                      {item.condition
                                        ? t(
                                            `tcg.grading.conditions-list.${item.condition}`,
                                          )
                                        : "-"}
                                    </TableCell>
                                    <TableCell>
                                      {item.gradingCompany
                                        ? t(
                                            `tcg.grading.companies-list.${item.gradingCompany.toLowerCase()}`,
                                          )
                                        : "-"}
                                    </TableCell>
                                    <TableCell>
                                      {item.gradingRating || "-"}
                                    </TableCell>
                                    <TableCell>
                                      {item.quantity ?? "-"}
                                    </TableCell>
                                    <TableCell>
                                      <PriceFormatter
                                        price={item.price}
                                        priceChangeState={
                                          item.price < TEMPORARY_PREV_PRICE
                                            ? PriceChangeState.Decreased
                                            : item.price > TEMPORARY_PREV_PRICE
                                              ? PriceChangeState.Increased
                                              : PriceChangeState.Unchanged
                                        }
                                      />
                                    </TableCell>
                                    <TableCell className="max-w-[320px] pr-[5%]">
                                      <p className="block max-w-full truncate">
                                        {item.notes ?? "-"}
                                      </p>
                                    </TableCell>
                                    {/* Fixed action column cell with enhanced z-index */}
                                    <TableCell className="sticky right-0 z-30 border-b border-primary-950/5 dark:border-white/5 bg-primary-800 shadow-lg">
                                      <div className="flex gap-1.5 items-center">
                                        <div
                                          className="cursor-pointer p-1 hover:text-accent-500"
                                          onClick={() => handleEdit(item)}
                                        >
                                          <FiEdit size={16} />
                                        </div>
                                        <div
                                          className="cursor-pointer p-1 hover:text-accent-500"
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
                        </div>
                      </div>
                    </div>
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-2">
                      <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={(newPage) => setPage(newPage)}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex w-full justify-center items-center grow">
                  <p className="text font-medium">
                    {t("card-page.collection-empty")}
                  </p>
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
