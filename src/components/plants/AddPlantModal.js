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

  // Adjusted formData to match API's snake_case for consistency
  const [formData, setFormData] = useState({
    name: '',
    category_id: '', // Storing category_id directly for API payload
    photo_path: '', // Changed to photo_path to match API
    location: '',
    pot_description: '', // Changed from potDescription to pot_description
    last_media_changed: formatDateForInput(new Date()), // Changed from lastMediaChange
    watering_frequency: '', // Changed from wateringFrequency
    notes: ''
  });

  const [plantCode, setPlantCode] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setPlantCode(generatePlantCode());
      // Reset form data when opening the modal, to ensure fresh start
      setFormData({
        name: '',
        category_id: '',
        photo_path: '',
        location: '',
        pot_description: '',
        last_media_changed: formatDateForInput(new Date()),
        watering_frequency: '',
        notes: ''
      });
      setErrors({}); // Clear errors on modal open
    }
  }, [isOpen]);

  const regenerateCode = () => {
    setPlantCode(generatePlantCode());
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Plant name is required';
    // Validate category_id instead of type
    if (!formData.category_id) newErrors.category_id = 'Plant category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // The API might expect 'code' to be sent, or it might generate it.
    // Assuming you send it as 'code' if it's part of the creation payload.
    // If the API generates `code` and `id`, remove `plantCode` from the payload.
    const plantDataToSend = {
      ...formData,
      code: plantCode, // Send the generated code
      photo_path: formData.photo_path || DEFAULT_PLANT_IMAGE, // Ensure photo_path is set or default
      // No need for 'id' here, as the API will assign it
    };

    // Assuming onAddPlant is responsible for making the API call
    // It should receive plantDataToSend
    onAddPlant(plantDataToSend);

    // Form reset handled by useEffect on subsequent opens, but good to have here too
    // in case modal stays open or you want to clear immediately after successful add
    setFormData({
      name: '',
      category_id: '',
      photo_path: '',
      location: '',
      pot_description: '',
      last_media_changed: formatDateForInput(new Date()),
      watering_frequency: '',
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

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Special handleChange for category dropdown
  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    handleChange('category_id', selectedCategoryId);
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
              // Updated to photo_path
              onPhotoCapture={(photo) => handleChange('photo_path', photo)}
              capturedPhoto={formData.photo_path}
              onRemovePhoto={() => handleChange('photo_path', '')}
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
                  // Value now maps to category_id
                  value={formData.category_id}
                  onChange={handleCategoryChange} // Use special handler for category
                  disabled={categoriesLoading}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.category_id ? 'border-red-500' : 'border-gray-300' // Changed error check
                  } ${categoriesLoading ? 'bg-gray-100' : ''}`}
                >
                  <option value="">
                    {categoriesLoading ? 'Loading categories...' : 'Select plant category'}
                  </option>
                  {categories.map(category => (
                    // Send category.id as value for the API
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pot Description
                </label>
                <input
                  type="text"
                  // Updated to pot_description
                  value={formData.pot_description}
                  onChange={(e) => handleChange('pot_description', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.pot_description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 12 inch ceramic pot, self-watering planter"
                />
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
                  // Updated to watering_frequency
                  value={formData.watering_frequency}
                  onChange={(e) => handleChange('watering_frequency', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.watering_frequency ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Weekly, Every 3-4 days"
                />
              </div>
              <div>
                {/* This div is here to maintain grid layout consistency, or can be removed if layout changes */}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Media Change
                </label>
                <input
                  type="date"
                  // Updated to last_media_changed
                  value={formData.last_media_changed}
                  onChange={(e) => handleChange('last_media_changed', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                {/* This div is here to maintain grid layout consistency, or can be removed if layout changes */}
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