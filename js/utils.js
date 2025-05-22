const BASE_URL = 'https://smart-management-backend-4.onrender.com/api';
export async function apiFetch(path, { method = 'GET', body, requiresAuth = true } = {}) {
  const headers = { 'Content-Type': 'application/json; charset=UTF-8' };
  if (requiresAuth) {
    const token = localStorage.getItem('jwt');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const resp = await fetch(`${BASE_URL}/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (resp.status === 401) {
    window.location = '/login.html';
    throw new Error('Unauthorized');
  }
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }
  if (resp.status === 204) return null;
  return resp.json();
}
