import React from "react";
import { Select } from "@/components/catalyst-ui/select";
import { OrderDirection } from "@/graphql/generated";
import { Field, Label } from "@/components/catalyst-ui/fieldset";
import { useTranslations } from "use-intl";
import slugifyText from "@/utils/slugifyText";
import { Divider } from "@/components/catalyst-ui/divider";
import { Input } from "../catalyst-ui/input";

interface FilterBarProps {
  title?: string;

  sortBy: string;
  onSortByChange: (newSortBy: string) => void;
  sortOrder: OrderDirection;
  onSortOrderChange: (newSortOrder: OrderDirection) => void;
  sortOptions: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function FilterBar({
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  sortOptions,
  searchQuery,
  onSearchChange,
}: FilterBarProps) {
  const t = useTranslations();

  return (
    <>
      <Divider className={`sm:mt-5 mb-2`} />
      <div className={`flex flex-col sm:flex-row sm:items-end justify-end`}>
        <div className="w-full sm:w-auto flex flex-col md:flex-row md:items-end md:gap-8 mb-6">
          <Field className={`flex gap-2 items-center`}>
            <Label
              title={t("common.search")}
              className={`whitespace-nowrap mt-2 w-24 sm:w-auto`}
            >
              {t("common.search")}:
            </Label>
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t("common.search")}
              type="search"
              onKeyDown={(e) => {
                if (e.key === "a" && (e.ctrlKey || e.metaKey)) {
                  e.stopPropagation();
                }
              }}
            />
          </Field>

          <Field className={`flex gap-2 items-center`}>
            <Label className={`whitespace-nowrap mt-2 w-24 sm:w-auto`}>
              {t("filter-bar.sort-by")}:
            </Label>
            <Select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>
                  {t(`filter-bar.${slugifyText(option)}`)}
                </option>
              ))}
            </Select>
          </Field>

          <Field className={`flex gap-2 items-center`}>
            <Label className={`whitespace-nowrap mt-2 w-24 sm:w-auto`}>
              {t("filter-bar.order-by")}:
            </Label>
            <Select
              value={sortOrder}
              onChange={(e) =>
                onSortOrderChange(e.target.value as OrderDirection)
              }
            >
              <option value={OrderDirection.Desc}>
                {t("filter-bar.order-by-desc")}
              </option>
              <option value={OrderDirection.Asc}>
                {t("filter-bar.order-by-asc")}
              </option>
            </Select>
          </Field>
        </div>
      </div>
    </>
  );
}
