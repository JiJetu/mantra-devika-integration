export const usePagination = ({
  currentPage = 1,
  pageSize = 10,
  totalCount = 0,
  totalPages,
}) => {
  const pages =
    typeof totalPages === "number" ? totalPages : Math.ceil(totalCount / pageSize) || 0;
  const startIndex = Math.max(0, (currentPage - 1) * pageSize);
  const endIndex = Math.min(startIndex + pageSize, totalCount);
  return { totalPages: pages, startIndex, endIndex };
};
