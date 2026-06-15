'use client';

import React from 'react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const from = (currentPage - 1) * itemsPerPage + 1;
  const to = Math.min(currentPage * itemsPerPage, totalItems);

  const pages = Array.from(
    { length: totalPages },
    (_, i) => i + 1
  ).filter(
    page =>
      page === 1 ||
      page === totalPages ||
      Math.abs(page - currentPage) <= 1
  );

  return (
    <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-sm text-grayMedium">
        Mostrando {from}–{to} de {totalItems} transações
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            onPageChange(Math.max(1, currentPage - 1))
          }
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg border border-gold/30 text-gold text-sm font-medium transition-all duration-300 hover:bg-gold/10 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        {pages.map((page, idx) => (
          <React.Fragment key={page}>
            {idx > 0 && pages[idx - 1] !== page - 1 && (
              <span className="text-grayMedium px-1">…</span>
            )}
            <button
              onClick={() => onPageChange(page)}
              className={`h-9 w-9 rounded-lg text-sm font-medium transition-all duration-300 ${
                currentPage === page
                  ? 'bg-gold text-background'
                  : 'border border-gold/30 text-gold hover:bg-gold/10'
              }`}
            >
              {page}
            </button>
          </React.Fragment>
        ))}
        <button
          onClick={() =>
            onPageChange(
              Math.min(totalPages, currentPage + 1)
            )
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg border border-gold/30 text-gold text-sm font-medium transition-all duration-300 hover:bg-gold/10 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
