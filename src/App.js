import React, { useState } from 'react';
import { Plus, AlertCircle, RefreshCw } from 'lucide-react';
import Header from './components/common/Header';
import LoadingSpinner from './components/common/LoadingSpinner';
import PlantList from './components/plants/PlantList';
import PlantDetail from './components/plants/PlantDetail';
import AddPlantModal from './components/plants/AddPlantModal';
import { usePlants } from './hooks/usePlants';

const App = () => {
  const { plants, loading, error, addPlant, updatePlant, deletePlant, refetch } = usePlants();
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

  const handleUpdatePlant = (plant) => {
    // For now, just show an alert - you can implement edit modal later
    console.log('Update plant:', plant.name);
    alert(`Update functionality for ${plant.name} will be implemented soon!`);
    
    // TODO: You can add edit modal logic here later:
    // setEditingPlant(plant);
    // setIsEditModalOpen(true);
  };

  const handleDeletePlant = async (plantId) => {
    try {
      await deletePlant(plantId);
      // Go back to list after successful deletion
      setSelectedPlant(null);
    } catch (error) {
      // Error handling is already done in the hook
      console.error('Delete failed:', error);
    }
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <Header plantCount={0} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h2 className="text-lg font-semibold text-red-800">Error Loading Plants</h2>
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Header plantCount={plants.length} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedPlant ? (
          <PlantDetail 
            plant={selectedPlant} 
            onBack={handleBackToList}
            onUpdate={handleUpdatePlant}
            onDelete={handleDeletePlant}
          />
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