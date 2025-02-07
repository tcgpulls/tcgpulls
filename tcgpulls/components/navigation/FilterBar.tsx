"use client";

import React from "react";
import { Select } from "@/components/catalyst-ui/select";
import { OrderDirection } from "@/graphql/generated";
import { Field, Label } from "@/components/catalyst-ui/fieldset";
import { useTranslations } from "use-intl";
import camelCaseToWords from "@/utils/camelCaseToWords";

interface FilterBarProps {
  sortBy: string;
  onSortByChange: (newSortBy: string) => void;
  sortOrder: OrderDirection;
  onSortOrderChange: (newSortOrder: OrderDirection) => void;
  sortOptions: string[];
}

const replaceDotWithColon = (str: string) => str.replace(".", ": ");

export function FilterBar({
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  sortOptions,
}: FilterBarProps) {
  const t = useTranslations();

  return (
    <div className={`flex items-center justify-end`}>
      <div className="flex gap-12 mb-4 items-center">
        <Field className={`flex gap-4 items-center`}>
          <Label className={`whitespace-nowrap mt-2`}>
            {t("common.sort-by")}:
          </Label>
          <Select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>
                {/* Convert something like "releaseDate" to user-friendly text */}
                {camelCaseToWords(replaceDotWithColon(option))}
              </option>
            ))}
          </Select>
        </Field>

        <Field className={`flex gap-4 items-center`}>
          <Label className={`whitespace-nowrap mt-2`}>
            {t("common.order-by")}:
          </Label>
          <Select
            value={sortOrder}
            onChange={(e) =>
              onSortOrderChange(e.target.value as OrderDirection)
            }
          >
            <option value={OrderDirection.Desc}>
              {t("common.order-by-desc")}
            </option>
            <option value={OrderDirection.Asc}>
              {t("common.order-by-asc")}
            </option>
          </Select>
        </Field>
      </div>
    </div>
  );
}
