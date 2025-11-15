const API_URL = "http://192.168.0.185:5001/api";

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
