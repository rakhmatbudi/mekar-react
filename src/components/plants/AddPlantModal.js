// components/plants/AddPlantModal.js
import React, { useState, useEffect } from 'react';
import { Plus, X, RefreshCw } from 'lucide-react';
import CameraCapture from '../camera/CameraCapture';
import { generatePlantCode } from '../../utils/plantUtils';
import { formatDateForInput } from '../../utils/dateUtils';
import { DEFAULT_PLANT_IMAGE } from '../../utils/constants';
import { useCategories } from '../../hooks/useCategories';

const AddPlantModal = ({ isOpen, onClose, onAddPlant }) => {
  const { categories, loading: categoriesLoading } = useCategories();

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    photo: '',
    location: '', // Now optional
    potSize: '', // Now optional
    lastMediaChange: formatDateForInput(new Date()),
    wateringFrequency: '', // Now optional
    notes: ''
  });

  const [plantCode, setPlantCode] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setPlantCode(generatePlantCode());
    }
  }, [isOpen]);

  const regenerateCode = () => {
    setPlantCode(generatePlantCode());
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Plant name is required';
    if (!formData.type.trim()) newErrors.type = 'Plant category is required';
    // Removed validation for location
    // Removed validation for potSize
    // Removed validation for wateringFrequency

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newPlant = {
      // In a real app, 'id' would be assigned by the database/API after successful creation
      id: Date.now(),
      plantCode: plantCode,
      ...formData,
      photo: formData.photo || DEFAULT_PLANT_IMAGE,
      actions: [] // Assuming actions are managed separately or initialized empty
    };

    onAddPlant(newPlant);

    // Reset formData to initial empty state after submission
    setFormData({
      name: '',
      type: '',
      photo: '',
      location: '',
      potSize: '',
      lastMediaChange: formatDateForInput(new Date()),
      wateringFrequency: '',
      notes: ''
    });
    setPlantCode('');
    setErrors({});
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for the field if it was previously set
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Plus className="w-6 h-6 text-green-500" />
            Add New Plant
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Plant Code</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 mb-1">Generated Plant Code</p>
                  <p className="text-2xl font-mono font-bold text-green-800">{plantCode}</p>
                </div>
                <button
                  type="button"
                  onClick={regenerateCode}
                  className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  New Code
                </button>
              </div>
              <p className="text-xs text-green-600 mt-2">
                This unique code will identify your plant. You can generate a new one if needed.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Plant Photo</h3>
            <CameraCapture
              onPhotoCapture={(photo) => handleChange('photo', photo)}
              capturedPhoto={formData.photo}
              onRemovePhoto={() => handleChange('photo', '')}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plant Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Monstera Deliciosa"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plant Category *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  disabled={categoriesLoading}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.type ? 'border-red-500' : 'border-gray-300'
                  } ${categoriesLoading ? 'bg-gray-100' : ''}`}
                >
                  <option value="">
                    {categoriesLoading ? 'Loading categories...' : 'Select plant category'}
                  </option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                  ))}
                </select>
                {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Location & Container</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Living Room - East Window"
                />
                {/* No error message for location now */}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pot Size
                </label>
                <input
                  type="text"
                  value={formData.potSize}
                  onChange={(e) => handleChange('potSize', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.potSize ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 12 inch ceramic pot"
                />
                {/* No error message for potSize now */}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Care Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Watering Frequency
                </label>
                <input
                  type="text"
                  value={formData.wateringFrequency}
                  onChange={(e) => handleChange('wateringFrequency', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.wateringFrequency ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Weekly, Every 3-4 days"
                />
                {/* No error message for wateringFrequency now */}
              </div>
              {/* This div is now empty or might need re-structuring if you only have one input left in this row */}
              <div>
                {/* This div is here to maintain grid layout, remove if you redesign the layout */}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Media Change
                </label>
                <input
                  type="date"
                  value={formData.lastMediaChange}
                  onChange={(e) => handleChange('lastMediaChange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* This div is here to maintain grid layout, remove if you redesign the layout */}
              <div>
                {/* No next watering input here */}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Care Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Add any special care instructions or notes about this plant..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={categoriesLoading}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Add Plant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlantModal;