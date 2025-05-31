export const API_BASE_URL = 'https://api.mekar.pood.lol';
export const API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsImlhdCI6MTc0ODYyMjU5MiwiZXhwIjoxNzQ4NjI2MTkyfQ.Er-HcNx5HFn76OWG121PXSxvmh3s8mHjKy0MsF9PHug';

export const apiHeaders = {
  'Authorization': `Bearer ${API_TOKEN}`,
  'Content-Type': 'application/json',
};

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: apiHeaders,
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};