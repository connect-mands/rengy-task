import React from 'react';

export default function Pagination({ page, pages, total, onPageChange }) {
  if (pages <= 1) return null;
  return (
    <div className="pagination">
      <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Previous
      </button>
      <span>
        Page {page} of {pages} ({total} total)
      </span>
      <button type="button" disabled={page >= pages} onClick={() => onPageChange(page + 1)}>
        Next
      </button>
    </div>
  );
}
