export interface PaginationData {
  currentPage: number;
  totalPages: number;
  offset: number;
  limit: number;
}

export const getPagination = (
  page: string | undefined,
  total: number,
  pageSize: number,
): PaginationData => {
  const currentPage = Math.max(parseInt(page || "1", 10), 1); // Default to page 1, ensure it's at least 1
  const totalPages = Math.ceil(total / pageSize);
  const offset = (currentPage - 1) * pageSize;

  return {
    currentPage,
    totalPages,
    offset,
    limit: pageSize,
  };
};
