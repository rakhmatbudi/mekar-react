import React, { useState } from 'react';
import { Leaf } from 'lucide-react';
import PlantCard from './PlantCard';
import SearchFilter from '../common/SearchFilter';
import { filterPlants } from '../../utils/plantUtils';

const PlantList = ({ plants, onPlantClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredPlants = filterPlants(plants, searchTerm, filterType);
  const plantTypes = [...new Set(plants.map(plant => plant.type))];

  return (
    <>
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterType={filterType}
        onFilterChange={setFilterType}
        plantTypes={plantTypes}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPlants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} onPlantClick={onPlantClick} />
        ))}
      </div>

      {filteredPlants.length === 0 && (
        <div className="text-center py-12">
          <Leaf className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No plants found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </>
  );
};

export default PlantList;