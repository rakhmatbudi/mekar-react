// components/plants/AddPlantModal.js
import React, { useState, useEffect } from 'react';
import { Plus, X, RefreshCw, Upload } from 'lucide-react';
// Assume these utilities and hooks exist in your project
import CameraCapture from '../camera/CameraCapture'; // You need to provide this component
import { generatePlantCode } from '../../utils/plantUtils'; // You need to provide this utility
import { formatDateForInput } from '../../utils/dateUtils'; // You need to provide this utility
import { useCategories } from '../../hooks/useCategories'; // You need to provide this hook
import { API_BASE_URL } from '../../config'; // <--- ADD THIS IMPORT

// Default plant image - consider adding a placeholder image URL here
const DEFAULT_PLANT_IMAGE = '/path/to/default-plant-image.png';

// Cloudinary Configuration Constants for Client-Side
// These are used to form the payload for the /api/upload-image endpoint on your server
const COMMUNITY_NAME = 'Mekar';
const COMMUNITY_MEMBER_ID = '00000001'; // IMPORTANT: In a real app, get this from user authentication
const UPLOAD_FOLDER = 'Collection';

const AddPlantModal = ({ isOpen, onClose, onAddPlant }) => {
  const { categories, loading: categoriesLoading } = useCategories();

  // Adjusted formData to match API's snake_case for consistency
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    photo_path: '', // Will store Cloudinary URL after upload
    location: '',
    pot_description: '',
    last_media_changed: formatDateForInput(new Date()),
    watering_frequency: '',
    notes: ''
  });

  const [plantCode, setPlantCode] = useState('');
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false); // For image upload status
  const [isAddingPlant, setIsAddingPlant] = useState(false); // For overall plant submission status

  useEffect(() => {
    if (isOpen) {
      setPlantCode(generatePlantCode());
      // Reset form data when opening the modal for a fresh start
      setFormData({
        name: '',
        category_id: '',
        photo_path: '', // Reset photo path
        location: '',
        pot_description: '',
        last_media_changed: formatDateForInput(new Date()),
        watering_frequency: '',
        notes: ''
      });
      setErrors({}); // Clear errors
      setIsUploading(false);
      setIsAddingPlant(false);
    }
  }, [isOpen]);

  const regenerateCode = () => {
    setPlantCode(generatePlantCode());
  };

  // Function to upload the photo to your Node.js server's /api/upload-image endpoint
  const uploadPhotoToServer = async (file) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('plantCode', plantCode);
      formData.append('communityName', COMMUNITY_NAME);
      formData.append('communityMemberId', COMMUNITY_MEMBER_ID); // Dynamic in real app
      formData.append('uploadFolder', UPLOAD_FOLDER);

      const response = await fetch(`${API_BASE_URL}/api/upload-image`, { // Ensure this path is correct for your proxy/setup
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Image upload failed on server.');
      }

      const result = await response.json();
      return result.imageUrl; // This is the Cloudinary URL returned by your server
    } catch (error) {
      console.error('Error uploading image to server:', error);
      throw error; // Re-throw to be caught by handleSubmit
    } finally {
      setIsUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Plant name is required.';
    if (!formData.category_id) newErrors.category_id = 'Plant category is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setErrors(prev => ({ ...prev, submit: 'Please fix the highlighted errors before submitting.' }));
      return;
    }

    setIsAddingPlant(true); // Indicate that the overall plant submission process has started
    setErrors({}); // Clear previous submission errors

    try {
      let finalPhotoPath = formData.photo_path || DEFAULT_PLANT_IMAGE;

      // If a photo was captured (base64 string) or selected (processed to base64 for preview), upload it
      if (formData.photo_path && formData.photo_path !== DEFAULT_PLANT_IMAGE) {
        let fileToUpload;
        if (formData.photo_path.startsWith('data:image/')) {
          // Convert base64 to Blob, then to File for upload
          const response = await fetch(formData.photo_path);
          const blob = await response.blob();
          fileToUpload = new File([blob], `${plantCode}_photo.jpeg`, { type: 'image/jpeg' });
        } else {
          // This case might occur if you are re-editing and the photo_path is already a Cloudinary URL.
          // For adding, it should primarily be a base64 from capture/file input.
          // If it's already a URL, no re-upload needed.
          fileToUpload = null; // No new file to upload if it's already a URL
        }

        if (fileToUpload) {
          finalPhotoPath = await uploadPhotoToServer(fileToUpload);
        }
      }

      // Prepare the plant data to be sent to your /plants API
      const plantDataToSend = {
        ...formData,
        code: plantCode, // Include the generated plant code
        photo_path: finalPhotoPath, // Use the Cloudinary URL (or default)
      };

      console.log('Sending plant data to API:', plantDataToSend);

      // Call the onAddPlant prop from the parent component, which will make the /plants API call
      await onAddPlant(plantDataToSend);

      // If successful, close the modal and reset form states
      onClose();
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
    } catch (error) {
      console.error('Error during plant submission:', error);

      let errorMessage = 'Failed to add plant. Please try again.';
      // Enhance error message based on the type of error
      if (error instanceof Error && error.message) {
        errorMessage = `Submission error: ${error.message}`;
      } else if (error.response) { // Assuming Axios or similar for error.response
        errorMessage = `Server error: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`;
      } else if (error.request) { // Network error
        errorMessage = 'Network error: Please check your connection and try again.';
      }

      setErrors({ submit: errorMessage });
    } finally {
      setIsAddingPlant(false); // End overall plant submission process
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) { // Clear error for the field being changed
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    handleChange('category_id', selectedCategoryId);
  };

  // Image compression function (client-side before upload)
  const compressImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      img.onerror = (error) => {
        console.error("Error loading image for compression:", error);
        reject(new Error("Failed to load image for compression."));
      };
    });
  };

  // Handle file input for photo upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, photo: 'Please select a valid image file.' }));
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // Check initial size before compression
      setErrors(prev => ({ ...prev, photo: 'Image size should be less than 10MB.' }));
      return;
    }

    try {
      setIsUploading(true);
      const compressedBlob = await compressImage(file);

      // Convert compressed blob to base64 for local preview in the UI
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('photo_path', reader.result); // Store base64 for preview
        setIsUploading(false); // Stop indicating upload once local processing/preview is ready
      };
      reader.readAsDataURL(compressedBlob);

    } catch (error) {
      console.error('Error processing file for upload:', error);
      setErrors(prev => ({ ...prev, photo: error.message || 'Error processing image for upload.' }));
      setIsUploading(false);
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
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

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
            
            {/* Camera Capture Component */}
            <CameraCapture
              onPhotoCapture={(photo) => handleChange('photo_path', photo)}
              capturedPhoto={formData.photo_path}
              onRemovePhoto={() => handleChange('photo_path', '')}
            />

            {/* Alternative File Upload */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Or upload from device</p>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
            </div>

            {/* Upload/Processing Progress Indicator */}
            {isUploading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                  <span className="text-blue-600 text-sm">Processing image...</span>
                </div>
              </div>
            )}
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
                  value={formData.category_id}
                  onChange={handleCategoryChange}
                  disabled={categoriesLoading}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.category_id ? 'border-red-500' : 'border-gray-300'
                  } ${categoriesLoading ? 'bg-gray-100' : ''}`}
                >
                  <option value="">
                    {categoriesLoading ? 'Loading categories...' : 'Select plant category'}
                  </option>
                  {categories.map(category => (
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
                  value={formData.watering_frequency}
                  onChange={(e) => handleChange('watering_frequency', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.watering_frequency ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Weekly, Every 3-4 days"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Media Change
                </label>
                <input
                  type="date"
                  value={formData.last_media_changed}
                  onChange={(e) => handleChange('last_media_changed', e.target.value)}
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
              disabled={categoriesLoading || isUploading || isAddingPlant}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading || isAddingPlant ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  {isUploading ? 'Uploading Image...' : 'Adding Plant...'}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Plant
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlantModal;