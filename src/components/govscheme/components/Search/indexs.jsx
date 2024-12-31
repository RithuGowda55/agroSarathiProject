import React from 'react';
import './Searchs.css'; // Import the CSS file for styling

export const Searchs = ({ filters, setFilters }) => {
  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  return (
    <div className="search-container">
      <label>Search by Scheme Name:</label>
      <input
        type="text"
        value={filters.search}
        onChange={handleSearchChange}
        placeholder="Enter scheme name"
      />
    </div>
  );
};
