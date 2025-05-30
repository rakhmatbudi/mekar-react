import React from 'react';

const SearchFilter = ({ 
  searchTerm, 
  onSearchChange, 
  filterType, 
  onFilterChange, 
  plantTypes 
}) => {
  return (
    <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Plants
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search by name, type, or plant code..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="sm:w-48">
          <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Type
          </label>
          <select
            id="filter"
            value={filterType}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            {plantTypes.map(type => (
              <option key={type} value={type.toLowerCase()}>{type}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;