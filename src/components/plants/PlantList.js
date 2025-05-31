import React, { useState } from 'react';
import { Leaf } from 'lucide-react';
import SearchFilter from '../common/SearchFilter';
import { filterPlants } from '../../utils/plantUtils';

const PlantList = ({ plants, onPlantClick, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Use plants data directly from API response (no transformation needed)
  // Filter first, then sort alphabetically by plant name
  const filteredPlants = filterPlants(plants, searchTerm, filterType);
  const sortedPlants = filteredPlants.sort((a, b) => a.name.localeCompare(b.name));

  // Get unique plant types (category names) for filter dropdown
  const plantTypes = [...new Set(plants.map(plant => plant.category_name || plant.type).filter(Boolean))];

  if (loading) {
    return (
      <div className="text-center py-12">
        <Leaf className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Loading plants...</h3>
        <p className="text-gray-600">Please wait while we fetch the data.</p>
      </div>
    );
  }

  return (
    <>
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterType={filterType}
        onFilterChange={setFilterType}
        plantTypes={plantTypes}
      />

      {sortedPlants.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plant Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plant Code
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedPlants.map((plant, index) => (
                <tr
                  key={plant.id}
                  onClick={() => onPlantClick(plant)}
                  className={`cursor-pointer hover:bg-green-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {plant.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                      {plant.category_name || plant.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 font-mono">
                      {plant.code || plant.plantCode}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <Leaf className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No plants found</h3>
          <p className="text-gray-600">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'No plants available at the moment.'
            }
          </p>
        </div>
      )}
    </>
  );
};

export default PlantList;