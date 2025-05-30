import React from 'react';
import { Calendar, ArrowLeft, Camera, AlertCircle } from 'lucide-react';
import ActionItem from './ActionItem';
import { formatDate, daysBetween } from '../../utils/dateUtils';

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

export default PlantDetail;