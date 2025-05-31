// components/hooks/usePlants.js

import { useState, useEffect, useCallback } from 'react';
import { useCategories } from './useCategories';

const API_BASE_URL = 'https://api.mekar.pood.lol';

export const usePlants = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getCategoryName, getCategoryId, categories } = useCategories();

  const fetchPlants = async () => {
    try {
      console.log('🌱 Starting to fetch plants...'); // Debug log
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/plants`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('🌱 Plants API response status:', response.status); // Debug log
      console.log('🌱 Plants API response ok:', response.ok); // Debug log

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('🌱 Plants data received:', data); // Debug log
      
      // Use the complete API response structure directly
      const transformedPlants = data.map(plant => ({
        // Primary API fields
        id: plant.id,
        name: plant.name,
        category_id: plant.category_id,
        category_name: plant.category_name,
        code: plant.code,
        last_media_changed: plant.last_media_changed,
        location: plant.location,
        pot_description: plant.pot_description,
        watering_frequency: plant.watering_frequency,
        notes: plant.notes,
        photo_path: plant.photo_path,
        
        // Legacy fields for backward compatibility
        plantCode: plant.code,
        type: plant.category_name,
        categoryId: plant.category_id,
        photo: plant.photo_path || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
        potSize: plant.pot_description || 'Not specified',
        lastMediaChange: plant.last_media_changed || new Date().toISOString().split('T')[0],
        nextWatering: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lightRequirement: 'Not specified',
        wateringFrequency: plant.watering_frequency || 'Not specified',
        actions: []
      }));

      console.log('🌱 Transformed plants:', transformedPlants.length); // Debug log
      setPlants(transformedPlants);
    } catch (err) {
      console.error('❌ Error fetching plants:', err);
      setError(err.message);
    } finally {
      console.log('🌱 Plants fetch completed, setting loading to false'); // Debug log
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🚀 usePlants useEffect triggered - fetching plants immediately');
    fetchPlants();
  }, []); // Fetch plants immediately

  const addPlant = async (newPlant) => {
    try {
      // Use category_id directly if provided, otherwise try to get it from type
      const categoryId = newPlant.category_id || getCategoryId(newPlant.type);
      if (!categoryId) {
        throw new Error('Invalid category selected');
      }

      const response = await fetch(`${API_BASE_URL}/plants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newPlant.name,
          category_id: categoryId,
          code: newPlant.code,
          last_media_changed: newPlant.last_media_changed,
          location: newPlant.location || null,
          pot_description: newPlant.pot_description || null,
          watering_frequency: newPlant.watering_frequency || null,
          notes: newPlant.notes || null,
          photo_path: newPlant.photo_path || null
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchPlants(); // Refresh to get updated data with category_name
    } catch (err) {
      console.error('Error adding plant:', err);
      setError(err.message);
      throw err; // Re-throw to let the modal handle the error
    }
  };

  const updatePlant = async (plantId, updatedPlant) => {
    try {
      const categoryId = getCategoryId(updatedPlant.type);
      if (!categoryId && updatedPlant.type !== 'Unknown') {
        throw new Error(`Invalid category selected: ${updatedPlant.type}`);
      }

      const response = await fetch(`${API_BASE_URL}/plants/${plantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: updatedPlant.name,
          category_id: categoryId,
          code: updatedPlant.plantCode,
          last_media_changed: updatedPlant.lastMediaChange
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchPlants(); // Refresh the list to get updated category_name
    } catch (err) {
      console.error('Error updating plant:', err);
      setError(err.message);
      throw err;
    }
  };

  const deletePlant = async (plantId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/plants/${plantId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setPlants(prevPlants => prevPlants.filter(plant => plant.id !== plantId));
    } catch (err) {
      console.error('Error deleting plant:', err);
      setError(err.message);
      throw err;
    }
  };

  return { 
    plants, 
    loading, 
    error, 
    addPlant,
    updatePlant,
    deletePlant, 
    refetch: fetchPlants,
    categories 
  };
};