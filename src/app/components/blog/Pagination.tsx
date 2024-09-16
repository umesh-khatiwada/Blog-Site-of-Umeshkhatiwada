// src/app/components/Pagination.tsx
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex justify-center items-center mt-8 space-x-2">
      <button
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-700 text-white rounded-l hover:bg-gray-600 disabled:bg-gray-500 transition"
      >
        First
      </button>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-700 text-white hover:bg-gray-600 disabled:bg-gray-500 transition"
      >
        Previous
      </button>
      <span className="px-4 py-2 bg-gray-800 text-white rounded">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-700 text-white hover:bg-gray-600 disabled:bg-gray-500 transition"
      >
        Next
      </button>
      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-700 text-white rounded-r hover:bg-gray-600 disabled:bg-gray-500 transition"
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;
