import React from 'react';
import './Sorts.css'; // Ensure to import the CSS file for styling

export const Sorts = ({ setSort }) => {
  const handleSortChange = (field, order) => {
    setSort({ by: field, order });
  };

  return (
    <div className="sorts-container">
      <label>Sort By:</label>

      <button className="sort-button" onClick={() => handleSortChange('incomeLevel', 'asc')}>
        Income Level (Asc)
      </button>
      <button className="sort-button" onClick={() => handleSortChange('incomeLevel', 'desc')}>
        Income Level (Desc)
      </button>

      <button className="sort-button" onClick={() => handleSortChange('amount', 'asc')}>
        Amount (Asc)
      </button>
      <button className="sort-button" onClick={() => handleSortChange('amount', 'desc')}>
        Amount (Desc)
      </button>

      <button className="sort-button" onClick={() => handleSortChange('applicationDeadline', 'asc')}>
        Deadline (Asc)
      </button>
      <button className="sort-button" onClick={() => handleSortChange('applicationDeadline', 'desc')}>
        Deadline (Desc)
      </button>
    </div>
  );
};
