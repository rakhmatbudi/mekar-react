import React, { useState } from 'react';
import { Calendar, ArrowLeft, Camera, AlertCircle, Edit, Trash2 } from 'lucide-react';
import ActionItem from './ActionItem';
import { formatDate, daysBetween } from '../../utils/dateUtils';

const PlantDetail = ({ plant, onBack, onUpdate, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const daysSinceMediaChange = daysBetween(new Date(plant.lastMediaChange || plant.last_media_changed), new Date());
  const daysUntilWatering = daysBetween(new Date(), new Date(plant.nextWatering));

  const handleDelete = async () => {
    if (onDelete) {
      try {
        setIsDeleting(true);
        await onDelete(plant.id);
        // Go back to list after successful deletion
        onBack();
      } catch (error) {
        console.error('Error deleting plant:', error);
        alert('Failed to delete plant. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    } else {
      console.log('Delete clicked for plant:', plant.name);
      alert(`Delete functionality not implemented yet for ${plant.name}`);
    }
    setShowDeleteConfirm(false);
  };

  const handleUpdate = () => {
    if (onUpdate) {
      onUpdate(plant);
    } else {
      console.log('Update clicked for plant:', plant.name);
      alert(`Update functionality not implemented yet for ${plant.name}`);
    }
  };

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
        {/* Header Content */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-6">
          {/* Plant Info - Left Side */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 break-words leading-tight">
              {plant.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white">
                {plant.type || plant.category_name}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-medium bg-white bg-opacity-15 text-white">
                #{plant.plantCode || plant.code}
              </span>
            </div>
          </div>
          
          {/* Action Buttons - Right Side */}
          <div className="flex-shrink-0">
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors whitespace-nowrap"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Update</span>
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 bg-opacity-80 hover:bg-opacity-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">{isDeleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Location and Status Bar */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white bg-opacity-60 rounded-full"></div>
            <span className="text-green-100">Location:</span>
            <span className="font-medium">{plant.location || 'Not specified'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white bg-opacity-60 rounded-full"></div>
            <span className="text-green-100">Last updated:</span>
            <span className="font-medium">{formatDate(plant.lastMediaChange || plant.last_media_changed || new Date().toISOString().split('T')[0])}</span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Plant</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{plant.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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

export default PlantDetail;