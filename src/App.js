import React, { useState, useEffect } from 'react';
import { Leaf, Calendar, QrCode, Droplets, Scissors, Sun, AlertCircle, ArrowLeft, Camera, Plus, X } from 'lucide-react';

// Sample plant data
const samplePlants = [
  {
    id: 1,
    plantCode: 'Mn4X9',
    name: 'Monstera Deliciosa',
    type: 'Tropical Houseplant',
    photo: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=300&fit=crop',
    location: 'Living Room - East Window',
    potSize: '12 inch ceramic pot',
    lastMediaChange: '2024-03-15',
    nextWatering: '2024-06-01',
    lightRequirement: 'Bright, indirect light',
    wateringFrequency: 'Weekly',
    notes: 'Beautiful variegated leaves. New growth showing excellent fenestrations.',
    actions: [
      { id: 1, task: 'Water thoroughly', priority: 'high', dueDate: '2024-05-31' },
      { id: 2, task: 'Check for pests', priority: 'medium', dueDate: '2024-06-05' },
      { id: 3, task: 'Rotate pot for even growth', priority: 'low', dueDate: '2024-06-02' }
    ]
  },
  {
    id: 2,
    plantCode: 'Sk7pQ',
    name: 'Snake Plant',
    type: 'Succulent',
    photo: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400&h=300&fit=crop',
    location: 'Bedroom - Corner',
    potSize: '8 inch terracotta pot',
    lastMediaChange: '2024-02-20',
    nextWatering: '2024-06-10',
    lightRequirement: 'Low to bright, indirect light',
    wateringFrequency: 'Every 2-3 weeks',
    notes: 'Very low maintenance. Perfect for beginners. Tolerates neglect well.',
    actions: [
      { id: 4, task: 'Water lightly', priority: 'medium', dueDate: '2024-06-10' },
      { id: 5, task: 'Dust leaves', priority: 'low', dueDate: '2024-06-08' }
    ]
  },
  {
    id: 3,
    plantCode: 'Fi3L8',
    name: 'Fiddle Leaf Fig',
    type: 'Tree',
    photo: 'https://images.unsplash.com/photo-1586093944106-734ab7698e98?w=400&h=300&fit=crop',
    location: 'Living Room - South Window',
    potSize: '14 inch planter with drainage',
    lastMediaChange: '2024-04-01',
    nextWatering: '2024-06-01',
    lightRequirement: 'Bright, indirect light',
    wateringFrequency: 'Weekly when soil is dry',
    notes: 'Dramatic large leaves. Keep away from drafts. Watch for brown spots.',
    actions: [
      { id: 6, task: 'Water when soil is dry', priority: 'high', dueDate: '2024-06-01' },
      { id: 7, task: 'Prune dead leaves', priority: 'medium', dueDate: '2024-06-03' },
      { id: 8, task: 'Check humidity levels', priority: 'medium', dueDate: '2024-06-02' }
    ]
  },
  {
    id: 4,
    plantCode: 'Po2vE',
    name: 'Pothos',
    type: 'Vine',
    photo: 'https://images.unsplash.com/photo-1586093944106-734ab7698e98?w=400&h=300&fit=crop',
    location: 'Kitchen - Hanging basket',
    potSize: '6 inch hanging planter',
    lastMediaChange: '2024-01-30',
    nextWatering: '2024-05-30',
    lightRequirement: 'Medium to bright, indirect light',
    wateringFrequency: 'Every 5-7 days',
    notes: 'Fast-growing trailing vine. Propagates easily in water. Great air purifier.',
    actions: [
      { id: 9, task: 'Water moderately', priority: 'high', dueDate: '2024-05-30' },
      { id: 10, task: 'Trim long vines', priority: 'low', dueDate: '2024-06-07' },
      { id: 11, task: 'Change potting media', priority: 'high', dueDate: '2024-05-31' }
    ]
  },
  {
    id: 5,
    plantCode: 'Rb9Kx',
    name: 'Rubber Plant',
    type: 'Tree',
    photo: 'https://images.unsplash.com/photo-1558618047-8e69c41b4bb8?w=400&h=300&fit=crop',
    location: 'Office - Near window',
    potSize: '10 inch ceramic pot',
    lastMediaChange: '2024-04-10',
    nextWatering: '2024-06-04',
    lightRequirement: 'Bright, indirect light',
    wateringFrequency: 'Weekly',
    notes: 'Glossy dark green leaves. Wipe leaves regularly for shine.',
    actions: [
      { id: 12, task: 'Water when soil is dry', priority: 'medium', dueDate: '2024-06-04' }
    ]
  },
  {
    id: 6,
    plantCode: 'Sp1nM',
    name: 'Spider Plant',
    type: 'Hanging Plant',
    photo: 'https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=400&h=300&fit=crop',
    location: 'Bathroom - Hanging hook',
    potSize: '8 inch hanging basket',
    lastMediaChange: '2024-03-25',
    nextWatering: '2024-06-01',
    lightRequirement: 'Bright, indirect light',
    wateringFrequency: 'Every 4-5 days',
    notes: 'Produces baby plants (spiderettes). Great for propagation.',
    actions: [
      { id: 13, task: 'Water regularly', priority: 'high', dueDate: '2024-06-01' },
      { id: 14, task: 'Remove dead leaves', priority: 'low', dueDate: '2024-06-06' }
    ]
  }
];

// Utility functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const daysBetween = (date1, date2) => {
  return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
};

const getPriorityColorClass = (priority) => {
  switch (priority) {
    case 'high': return 'priority-high';
    case 'medium': return 'priority-medium';
    case 'low': return 'priority-low';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const generatePlantCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const formatDateForInput = (date) => {
  return date.toISOString().split('T')[0];
};

// Components
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
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState(null);

  const plantTypes = [
    'Tropical Houseplant',
    'Succulent',
    'Tree',
    'Vine',
    'Hanging Plant',
    'Flowering Plant',
    'Herb',
    'Cactus',
    'Fern',
    'Palm'
  ];

  const lightOptions = [
    'Bright, direct light',
    'Bright, indirect light',
    'Medium, indirect light',
    'Low to bright, indirect light',
    'Low light',
    'Partial shade',
    'Full shade'
  ];

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

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      setStream(mediaStream);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions or use a different device.');
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    const video = document.getElementById('camera-video');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0);
    
    const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setFormData(prev => ({ ...prev, photo: photoDataUrl }));
    stopCamera();
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, photo: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newPlant = {
      id: Date.now(),
      plantCode: generatePlantCode(),
      ...formData,
      photo: formData.photo || `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop`,
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
    stopCamera();
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

  const handleClose = () => {
    stopCamera();
    onClose();
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
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Plant Photo Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Plant Photo</h3>
            
            {!formData.photo && !isCapturing && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Take a photo of your plant</p>
                <button
                  type="button"
                  onClick={startCamera}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  Open Camera
                </button>
              </div>
            )}

            {isCapturing && (
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    id="camera-video"
                    ref={(video) => {
                      if (video && stream) {
                        video.srcObject = stream;
                        video.play();
                      }
                    }}
                    className="w-full h-64 object-cover"
                    autoPlay
                    playsInline
                  />
                </div>
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    Capture Photo
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {formData.photo && !isCapturing && (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={formData.photo}
                    alt="Plant preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    Retake Photo
                  </button>
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    Remove Photo
                  </button>
                </div>
              </div>
            )}
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
                  {plantTypes.map(type => (
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
                  {lightOptions.map(option => (
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
              onClick={handleClose}
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

const Header = ({ plantCount = 0, onAddPlant }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 p-2 rounded-xl">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mekar</h1>
              <p className="text-sm text-gray-600">Plant Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Plants</p>
              <p className="text-2xl font-bold text-green-600">{plantCount}</p>
            </div>
            <button
              onClick={onAddPlant}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Plant
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

const SearchFilter = ({ 
  searchTerm, 
  onSearchChange, 
  filterType, 
  onFilterChange, 
  plantTypes 
}) => {
  return (
    <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Plants
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search by name, type, or plant code..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="sm:w-48">
          <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Type
          </label>
          <select
            id="filter"
            value={filterType}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            {plantTypes.map(type => (
              <option key={type} value={type.toLowerCase()}>{type}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

const ActionItem = ({ action }) => {
  const getActionIcon = (task) => {
    if (task.toLowerCase().includes('water')) return <Droplets className="w-4 h-4" />;
    if (task.toLowerCase().includes('prune') || task.toLowerCase().includes('trim')) return <Scissors className="w-4 h-4" />;
    if (task.toLowerCase().includes('light') || task.toLowerCase().includes('sun')) return <Sun className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border">
      <div className="text-gray-500 mt-1">
        {getActionIcon(action.task)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 mb-1">{action.task}</p>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColorClass(action.priority)}`}>
            {action.priority}
          </span>
          <span className="text-xs text-gray-500">Due: {formatDate(action.dueDate)}</span>
        </div>
      </div>
    </div>
  );
};

const PlantDetail = ({ plant, onBack }) => {
  const daysSinceMediaChange = daysBetween(new Date(plant.lastMediaChange), new Date());
  const daysUntilWatering = daysBetween(new Date(), new Date(plant.nextWatering));

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-6 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Plants
      </button>

      {/* Plant Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-t-xl p-6 text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{plant.name}</h1>
            <p className="text-green-100 text-lg">{plant.type}</p>
          </div>
          <div className="text-right">
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full mb-2">
              <span className="text-sm font-medium">Plant Code</span>
              <div className="font-mono text-lg font-bold">{plant.plantCode}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-b-xl shadow-lg border border-gray-200 border-t-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          
          {/* Plant Photo */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Plant Photo
            </h3>
            <div className="relative">
              <img
                src={plant.photo}
                alt={plant.name}
                className="w-full h-64 object-cover rounded-lg shadow-md"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop';
                }}
              />
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                {formatDate(new Date().toISOString().split('T')[0])}
              </div>
            </div>
          </div>

          {/* Plant Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Plant Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Location</div>
                <div className="font-medium">{plant.location}</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Pot Size</div>
                <div className="font-medium">{plant.potSize}</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Light Requirement</div>
                <div className="font-medium">{plant.lightRequirement}</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Watering Frequency</div>
                <div className="font-medium">{plant.wateringFrequency}</div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">Care Notes</div>
              <div className="text-gray-800">{plant.notes}</div>
            </div>
          </div>
        </div>

        {/* Care Schedule */}
        <div className="border-t border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Care Schedule
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="text-sm text-blue-600 mb-1">Last Media Change</div>
              <div className="font-semibold text-blue-800">{formatDate(plant.lastMediaChange)}</div>
              <div className="text-sm text-blue-600 mt-1">{daysSinceMediaChange} days ago</div>
            </div>
            
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="text-sm text-green-600 mb-1">Next Watering</div>
              <div className="font-semibold text-green-800">{formatDate(plant.nextWatering)}</div>
              <div className="text-sm text-green-600 mt-1">
                {daysUntilWatering > 0 ? `In ${daysUntilWatering} days` : 
                 daysUntilWatering === 0 ? 'Today' : 
                 `${Math.abs(daysUntilWatering)} days overdue`}
              </div>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="border-t border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Upcoming Actions ({plant.actions.length})
          </h3>
          
          <div className="space-y-3">
            {plant.actions.map((action) => (
              <ActionItem key={action.id} action={action} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PlantCard = ({ plant, onPlantClick }) => {
  return (
    <div 
      className="plant-card cursor-pointer hover:scale-105 transition-transform duration-200"
      onClick={() => onPlantClick(plant)}
    >
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold">{plant.name}</h3>
          <div className="flex items-center gap-1 bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-mono">
            {plant.plantCode}
          </div>
        </div>
        <p className="text-green-100 text-base">{plant.type}</p>
      </div>
    </div>
  );
};

const PlantList = ({ plants, onPlantClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plant.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plant.plantCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || plant.type.toLowerCase().includes(filterType.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const plantTypes = [...new Set(plants.map(plant => plant.type))];

  return (
    <>
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterType={filterType}
        onFilterChange={setFilterType}
        plantTypes={plantTypes}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPlants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} onPlantClick={onPlantClick} />
        ))}
      </div>

      {filteredPlants.length === 0 && (
        <div className="text-center py-12">
          <Leaf className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No plants found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </>
  );
};

// Main App Component
const App = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    // Simulate loading
    const loadPlants = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setPlants(samplePlants);
      setLoading(false);
    };
    
    loadPlants();
  }, []);

  const handlePlantClick = (plant) => {
    setSelectedPlant(plant);
  };

  const handleBackToList = () => {
    setSelectedPlant(null);
  };

  const handleAddPlant = (newPlant) => {
    setPlants(prevPlants => [...prevPlants, newPlant]);
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
          <div className="flex justify-center items-center min-h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
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