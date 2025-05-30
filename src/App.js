import React, { useState } from 'react';
import { Plus } from 'lucide-react';
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
        <Header plantCount={0} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSpinner />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Header plantCount={plants.length} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedPlant ? (
          <PlantDetail plant={selectedPlant} onBack={handleBackToList} />
        ) : (
          <PlantList plants={plants} onPlantClick={handlePlantClick} />
        )}
      </main>
      
      {/* Floating Action Button */}
      <button
        onClick={openAddModal}
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40"
        aria-label="Add new plant"
      >
        <Plus className="w-6 h-6" />
      </button>
      
      <AddPlantModal 
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onAddPlant={handleAddPlant}
      />
    </div>
  );
};

export default App;