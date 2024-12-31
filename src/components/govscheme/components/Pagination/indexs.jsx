import React from 'react';
import './Paginations.css'; // Import the CSS file for styling

export const Paginations = ({ total, limit, page, setPage }) => {
  const totalPages = Math.ceil(total / limit);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <>
    <div className="pagination-container">
      <button onClick={handlePrev} disabled={page === 1}>Previous</button>
      <span>Page {page} of {totalPages}</span>
      <button onClick={handleNext} disabled={page === totalPages}>Next</button>
     
    </div>
    <br /><br /><br />
    </>
  );
};
