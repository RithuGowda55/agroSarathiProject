import React from 'react';
import Select from 'react-select';
import './Filters.css'; // Import the CSS file

const FilterDropdown = ({ label, options, value, onChange }) => {
  const formattedOptions = options.map(option => ({
    label: option,
    value: option
  }));

  return (
    <div className="filter-dropdown">
      <label>{label}:</label>
      <Select
        options={formattedOptions}
        value={value ? { label: value, value } : null} // Show null when no value is selected
        onChange={selectedOption => onChange(selectedOption ? selectedOption.value : '')} // Reset value when cleared
        isSearchable
        isClearable // Allows the user to clear the selected value
        placeholder={`Select ${label}`}
      />
    </div>
  );
};

export const Filters = ({ filters, setFilters, setPage }) => {
  const availableStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Lakshadweep', 'Delhi', 'Puducherry', 'Ladakh', 'Jammu and Kashmir'
  ];

  const availableCropTypes = [
    'Rice', 'Wheat', 'Maize', 'Sorghum', 'Bajra', 'Barley', 'Cotton', 'Sugarcane',
    'Groundnut', 'Mustard', 'Sunflower', 'Soybean', 'Pulses', 'Tea', 'Coffee',
    'Coconut', 'Jute', 'Rubber', 'Tobacco', 'Spices', 'Fruits', 'Vegetables',
    'Millets', 'Oilseeds', 'Chickpeas', 'Lentils', 'Peas', 'Cashews'
  ];

  const availableIncomeLevels = ['Low', 'Medium', 'High'];

  const handleChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value
    });
    setPage(1);  // Reset to first page whenever a filter changes
  };

  return (
    <div className="filters-container">
      <FilterDropdown
        label="State"
        options={availableStates}
        value={filters.state}
        onChange={value => handleChange('state', value)}
      />
      <FilterDropdown
        label="Crop Type"
        options={availableCropTypes}
        value={filters.cropType}
        onChange={value => handleChange('cropType', value)}
      />
      <FilterDropdown
        label="Income Level"
        options={availableIncomeLevels}
        value={filters.incomeLevel}
        onChange={value => handleChange('incomeLevel', value)}
      />
    </div>
  );
};
