export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const daysBetween = (date1, date2) => {
  return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
};

export const formatDateForInput = (date) => {
  return date.toISOString().split('T')[0];
};