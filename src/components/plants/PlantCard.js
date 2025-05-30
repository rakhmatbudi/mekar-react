import React from 'react';

const PlantCard = ({ plant, onPlantClick }) => {
  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md hover:border-green-300 transition-all duration-200"
      onClick={() => onPlantClick(plant)}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-900 truncate flex-1 mr-2">
          {plant.name}
        </h3>
        <span className="text-xs font-mono bg-green-100 text-green-800 px-2 py-1 rounded flex-shrink-0">
          {plant.plantCode}
        </span>
      </div>
    </div>
  );
};

export default PlantCard;