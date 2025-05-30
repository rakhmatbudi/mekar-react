import React from 'react';

const PlantCard = ({ plant, onPlantClick }) => {
  return (
    <div 
      className="plant-card cursor-pointer hover:scale-105 transition-transform duration-200"
      onClick={() => onPlantClick(plant)}
    >
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold">{plant.name}</h3>
          <div className="flex items-center gap-1 bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-mono">
            {plant.plantCode}
          </div>
        </div>
        <p className="text-green-100 text-base">{plant.type}</p>
      </div>
    </div>
  );
};

export default PlantCard;