import React, { useState } from 'react';
import Header from './components/common/Header';
import LoadingSpinner from './components/common/LoadingSpinner';
import PlantList from './components/plants/PlantList';
import PlantDetail from './components/plants/PlantDetail';
import AddPlantModal from './components/plants/AddPlantModal';
import { usePlants } from './hooks/usePlants';

const App = () => {
  const { plants, loading, addPlant } = usePlants();
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handlePlantClick = (plant) => {
    setSelectedPlant(plant);
  };

  const handleBackToList = () => {
    setSelectedPlant(null);
  };

  const handleAddPlant = (newPlant) => {
    addPlant(newPlant);
    setIsAddModalOpen(false);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <Header plantCount={0} onAddPlant={openAddModal} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSpinner />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Header plantCount={plants.length} onAddPlant={openAddModal} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedPlant ? (
          <PlantDetail plant={selectedPlant} onBack={handleBackToList} />
        ) : (
          <PlantList plants={plants} onPlantClick={handlePlantClick} />
        )}
      </main>
      
      <AddPlantModal 
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onAddPlant={handleAddPlant}
      />
    </div>
  );
};

export default App;