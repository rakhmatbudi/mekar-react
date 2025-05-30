export const generatePlantCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const getPriorityColorClass = (priority) => {
  switch (priority) {
    case 'high': return 'priority-high';
    case 'medium': return 'priority-medium';
    case 'low': return 'priority-low';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const filterPlants = (plants, searchTerm, filterType) => {
  return plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plant.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plant.plantCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || plant.type.toLowerCase().includes(filterType.toLowerCase());
    return matchesSearch && matchesFilter;
  });
};