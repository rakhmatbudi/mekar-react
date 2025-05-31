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
      
      // Use API data directly with minimal transformation
      const transformedPlants = data.map(plant => ({
        id: plant.id,
        name: plant.name,
        category_name: plant.category_name,
        code: plant.code,
        category_id: plant.category_id,
        last_media_changed: plant.last_media_changed,
        // Legacy fields for backward compatibility
        plantCode: plant.code,
        type: plant.category_name,
        categoryId: plant.category_id,
        photo: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
        location: 'Not specified',
        potSize: 'Not specified',
        lastMediaChange: plant.last_media_changed || new Date().toISOString().split('T')[0],
        nextWatering: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lightRequirement: 'Not specified',
        wateringFrequency: 'Not specified',
        notes: '',
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
      const categoryId = getCategoryId(newPlant.type);
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
          code: newPlant.plantCode,
          last_media_changed: newPlant.lastMediaChange
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchPlants(); // Refresh to get updated data with category_name
    } catch (err) {
      console.error('Error adding plant:', err);
      setError(err.message);
      setPlants(prevPlants => [...prevPlants, newPlant]);
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