// src/config.js
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.mekar.pood.lol'
  : 'https://api.mekar.pood.lol'; // Or your local dev server port

export { API_BASE_URL };