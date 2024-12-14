"use client";

import {
  Pagination,
  PaginationGap,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "@/components/catalyst-ui/pagination";
import { usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";

type Props = {
  currentPage: number;
  totalPages: number;
};

const PaginationComponent = ({ currentPage, totalPages }: Props) => {
  const searchParams = useSearchParams(); // To read existing query parameters
  const pathname = usePathname(); // Get the current pathname

  const createPageLink = (page: number) => {
    const params = new URLSearchParams(searchParams.toString()); // Clone existing query params
    params.set("page", page.toString()); // Update the `page` parameter
    return `${pathname}?${params.toString()}`; // Combine with the current pathname
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Pagination className={`mt-8`}>
      {currentPage > 1 ? (
        <PaginationPrevious href={createPageLink(currentPage - 1)} />
      ) : (
        <PaginationPrevious />
      )}
      <PaginationList>
        {pageNumbers.map((number) => (
          <PaginationPage
            key={number}
            href={createPageLink(number)}
            current={number === currentPage}
          >
            {number}
          </PaginationPage>
        ))}
        {totalPages > pageNumbers.length && <PaginationGap />}
      </PaginationList>
      {currentPage < totalPages ? (
        <PaginationNext href={createPageLink(currentPage + 1)} />
      ) : (
        <PaginationNext />
      )}
    </Pagination>
  );
};

export default PaginationComponent;
