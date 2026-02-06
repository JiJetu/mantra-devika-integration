import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePagination } from "../../lib/hooks/usePagination";

const Pagination = ({
  currentPage = 1,
  pageSize = 10,
  totalCount = 0,
  totalPages,
  onPageChange,
  className = "",
}) => {
  const { totalPages: pages, startIndex, endIndex } = usePagination({
    currentPage,
    pageSize,
    totalCount,
    totalPages,
  });

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between px-6 py-4 text-sm text-gray-600 border-t ${className}`}>
      <div>
        Showing {Math.min(startIndex + 1, totalCount)} to {Math.min(endIndex, totalCount)} of {totalCount} users
      </div>

      <div className="flex items-center gap-2 mt-3 sm:mt-0">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronLeft size={18} />
        </button>

        {Array.from({ length: pages || 0 }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              px-3 py-1.5 rounded-md border border-gray-300 font-medium
              ${currentPage === page ? "bg-primary text-white border-primary" : "hover:bg-gray-50"}
            `}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === pages || pages === 0}
          className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
