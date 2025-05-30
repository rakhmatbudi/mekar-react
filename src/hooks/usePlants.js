import { useState, useEffect } from 'react';
import { samplePlants } from '../data/sampleData';

export const usePlants = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlants = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setPlants(samplePlants);
      setLoading(false);
    };
    
    loadPlants();
  }, []);

  const addPlant = (newPlant) => {
    setPlants(prevPlants => [...prevPlants, newPlant]);
  };

  return { plants, loading, addPlant };
};