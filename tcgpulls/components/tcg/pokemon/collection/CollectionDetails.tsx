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
import CardPageAddToCollection from "../card-page/CardPageAddToCollection";
import PriceFormatter from "@/components/misc/PriceFormatter";
import SortableTableHeader from "@/components/misc/SortableTableHeader";
import useSortableTable from "@/hooks/useSortableTable";
import { TcgCollectionDetailsSortByT } from "@/types/Tcg";

type Props = {
  cardId: string;
  collectionItems: PokemonCollectionItem[];
};

// Temporary constant for demonstration
const TEMPORARY_PREV_PRICE = 100;

export default function CollectionDetails({ cardId, collectionItems }: Props) {
  const t = useTranslations();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

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
      case "acquiredAt":
        aValue = a.acquiredAt ? new Date(a.acquiredAt).getTime() : 0;
        bValue = b.acquiredAt ? new Date(b.acquiredAt).getTime() : 0;
        break;
      case "price":
        aValue = parseFloat(a.price || "0");
        bValue = parseFloat(b.price || "0");
        break;
      case "condition":
        // Compare condition strings (you could also map these to numeric values if needed)
        aValue = a.condition || "";
        bValue = b.condition || "";
        break;
      case "gradingCompany":
        // Compare companies case-insensitively
        aValue = a.gradingCompany ? a.gradingCompany.toLowerCase() : "";
        bValue = b.gradingCompany ? b.gradingCompany.toLowerCase() : "";
        break;
      case "gradingRating":
        aValue = a.gradingRating || "";
        bValue = b.gradingRating || "";
        break;
      case "quantity":
        aValue = a.quantity || 0;
        bValue = b.quantity || 0;
        break;
      case "notes":
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
    { key: "acquiredAt", direction: OrderDirection.Desc },
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
                    <SortableTableHeader
                      label={t("tcg.collection.details.acquired-on")}
                      field="acquiredAt"
                      requestSort={requestSort}
                      sortConfig={sortConfig}
                      className="w-[15%]"
                    />
                    <SortableTableHeader
                      label={t("tcg.collection.details.condition")}
                      field="condition"
                      requestSort={requestSort}
                      sortConfig={sortConfig}
                      className="w-[10%]"
                    />
                    <SortableTableHeader
                      label={t("tcg.collection.details.company")}
                      field="gradingCompany"
                      requestSort={requestSort}
                      sortConfig={sortConfig}
                      className="w-[10%]"
                    />
                    <SortableTableHeader
                      label={t("tcg.collection.details.rating")}
                      field="gradingRating"
                      requestSort={requestSort}
                      sortConfig={sortConfig}
                      className="w-[10%]"
                    />
                    <SortableTableHeader
                      label={t("tcg.collection.details.quantity")}
                      field="quantity"
                      requestSort={requestSort}
                      sortConfig={sortConfig}
                      className="w-[10%]"
                    />
                    <SortableTableHeader
                      label={t("tcg.collection.details.price")}
                      field="price"
                      requestSort={requestSort}
                      sortConfig={sortConfig}
                      className="w-[10%]"
                    />
                    <SortableTableHeader
                      label={t("tcg.collection.details.notes")}
                      field="notes"
                      requestSort={requestSort}
                      sortConfig={sortConfig}
                      className="w-[30%]"
                    />
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
                          <PriceFormatter
                            price={item.price}
                            priceActionCondition={
                              item.price < TEMPORARY_PREV_PRICE
                            }
                          />
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
                <div className={`flex w-full justify-center items-center grow`}>
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
