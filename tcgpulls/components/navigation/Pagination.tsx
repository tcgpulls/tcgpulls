"use client";

import React from "react";

/**
 * A simple local pagination component using plain buttons and Tailwind classes.
 *
 * Props:
 * - page: current page number (1-based)
 * - totalPages: total number of pages
 * - onPageChange: callback to update the page in parent
 */
type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
};

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null; // No pagination if only one page

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };
  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  return (
    <div
      className="flex items-center justify-center gap-2"
      role="navigation"
      aria-label="Pagination"
    >
      {/* Previous button */}
      <button
        className={`px-3 py-1.5 text-sm rounded 
          ${page === 1 ? "text-primary-400 cursor-not-allowed" : "hover:text-accent-400 hover:bg-primary-800"}
        `}
        onClick={handlePrev}
        disabled={page === 1}
      >
        Prev
      </button>

      {/* Page number buttons */}
      <div className={`grow flex gap-1 justify-center`}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => {
          const isActive = num === page;
          return (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              className={`px-3 py-1.5 text-sm rounded 
              ${isActive ? " text-accent-400 bg-primary-800" : "hover:bg-primary-700 hover:text-accent-400"}`}
            >
              {num}
            </button>
          );
        })}
      </div>

      {/* Next button */}
      <button
        className={`px-3 py-1.5 text-sm rounded 
          ${page === totalPages ? "text-primary-400 cursor-not-allowed" : "hover:text-accent-400 hover:bg-primary-700"}
        `}
        onClick={handleNext}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
}
