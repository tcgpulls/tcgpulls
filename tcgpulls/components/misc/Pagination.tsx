import {
  Pagination,
  PaginationGap,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "@/components/catalyst-ui/pagination";

type Props = {
  currentPage: number;
  totalPages: number;
};

const PaginationComponent = ({ currentPage, totalPages }: Props) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Pagination className={`mt-8`}>
      {currentPage > 1 ? (
        <PaginationPrevious href={`?page=${currentPage - 1}`} />
      ) : (
        <PaginationPrevious />
      )}
      <PaginationList>
        {pageNumbers.map((number) => (
          <PaginationPage
            key={number}
            href={`?page=${number}`}
            current={number === currentPage}
          >
            {number}
          </PaginationPage>
        ))}
        {totalPages > pageNumbers.length && <PaginationGap />}
      </PaginationList>
      {currentPage < totalPages ? (
        <PaginationNext href={`?page=${currentPage + 1}`} />
      ) : (
        <PaginationNext />
      )}
    </Pagination>
  );
};

export default PaginationComponent;
