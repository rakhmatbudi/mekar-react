import React from 'react';
import { Droplets, Scissors, Sun, AlertCircle } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { getPriorityColorClass } from '../../utils/plantUtils';

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

export default ActionItem;