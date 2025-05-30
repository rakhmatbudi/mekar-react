import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import CameraCapture from '../camera/CameraCapture';
import { generatePlantCode } from '../../utils/plantUtils';
import { formatDateForInput } from '../../utils/dateUtils';
import { PLANT_TYPES, LIGHT_OPTIONS, DEFAULT_PLANT_IMAGE } from '../../utils/constants';

const AddPlantModal = ({ isOpen, onClose, onAddPlant }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    photo: '',
    location: '',
    potSize: '',
    lastMediaChange: formatDateForInput(new Date()),
    nextWatering: formatDateForInput(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 days from now
    lightRequirement: '',
    wateringFrequency: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Plant name is required';
    if (!formData.type.trim()) newErrors.type = 'Plant type is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.potSize.trim()) newErrors.potSize = 'Pot size is required';
    if (!formData.lightRequirement.trim()) newErrors.lightRequirement = 'Light requirement is required';
    if (!formData.wateringFrequency.trim()) newErrors.wateringFrequency = 'Watering frequency is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newPlant = {
      id: Date.now(),
      plantCode: generatePlantCode(),
      ...formData,
      photo: formData.photo || DEFAULT_PLANT_IMAGE,
      actions: []
    };

    onAddPlant(newPlant);
    
    // Reset form
    setFormData({
      name: '',
      type: '',
      photo: '',
      location: '',
      potSize: '',
      lastMediaChange: formatDateForInput(new Date()),
      nextWatering: formatDateForInput(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
      lightRequirement: '',
      wateringFrequency: '',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
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
          {/* Plant Photo Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Plant Photo</h3>
            <CameraCapture
              onPhotoCapture={(photo) => handleChange('photo', photo)}
              capturedPhoto={formData.photo}
              onRemovePhoto={() => handleChange('photo', '')}
            />
          </div>

          {/* Basic Information */}
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
                  Plant Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.type ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select plant type</option>
                  {PLANT_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
              </div>
            </div>
          </div>

          {/* Location and Pot */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Location & Container</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
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
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pot Size *
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
                {errors.potSize && <p className="text-red-500 text-sm mt-1">{errors.potSize}</p>}
              </div>
            </div>
          </div>

          {/* Care Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Care Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Light Requirement *
                </label>
                <select
                  value={formData.lightRequirement}
                  onChange={(e) => handleChange('lightRequirement', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.lightRequirement ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select light requirement</option>
                  {LIGHT_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.lightRequirement && <p className="text-red-500 text-sm mt-1">{errors.lightRequirement}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Watering Frequency *
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
                {errors.wateringFrequency && <p className="text-red-500 text-sm mt-1">{errors.wateringFrequency}</p>}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Watering
                </label>
                <input
                  type="date"
                  value={formData.nextWatering}
                  onChange={(e) => handleChange('nextWatering', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
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

          {/* Form Actions */}
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
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2"
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