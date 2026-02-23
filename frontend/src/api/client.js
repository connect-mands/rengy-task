const API = import.meta.env.VITE_API_URL || '';

const getAccessToken = () => window.__accessToken ?? null;

export const setAccessToken = (token) => {
  window.__accessToken = token;
};

export const getAuthHeaders = () => {
  const t = getAccessToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
};

export async function api(method, path, body, opts = {}) {
  const url = path.startsWith('http') ? path : `${API}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...opts.headers
  };
  const config = { method, headers };
  if (body != null && method !== 'GET') config.body = JSON.stringify(body);
  const res = await fetch(url, config);
  const text = await res.text();
  const data = text ? (() => { try { return JSON.parse(text); } catch { return {}; } })() : {};
  if (!res.ok) {
    const err = new Error(data.message || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}
