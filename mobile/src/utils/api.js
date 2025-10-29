// src/utils/api.js
import { getToken } from './authStorage';

const API_URL = 'http://10.209.226.168:5000/api'; // CHANGE TO YOUR IP

export const api = async (endpoint, { method = 'GET', body } = {}) => {
  const token = await getToken();
  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : null,
  });
  return res.json();
};