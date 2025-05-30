import React from 'react';
import { Leaf, Plus } from 'lucide-react';

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

export default Header;