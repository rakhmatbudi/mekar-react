// components/hooks/useCategories.js
import { useState, useEffect } from 'react';

const API_BASE_URL = 'https://api.mekar.pood.lol';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: {
            'Content-Type': 'application/json',
        },
     });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Helper function to get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  // Helper function to get category ID by name
  const getCategoryId = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.id : null;
  };

  return {
    categories,
    loading,
    error,
    getCategoryName,
    getCategoryId,
    refetch: fetchCategories
  };
};