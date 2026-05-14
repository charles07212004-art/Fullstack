const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
const localFallback = 'http://localhost:3000/api';

const makeRequest = async (url, options) => {
  try {
    const response = await fetch(`${baseURL}${url}`, options);
    if (!response.ok && baseURL === '/api') {
      return fetch(`${localFallback}${url}`, options);
    }
    return response;
  } catch (error) {
    if (baseURL === '/api') {
      return fetch(`${localFallback}${url}`, options);
    }
    throw error;
  }
};

const api = {
  get: async (url, options = {}) => {
    const params = options.params
      ? `?${new URLSearchParams(options.params).toString()}`
      : '';
    const response = await makeRequest(`${url}${params}`);

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || response.statusText);
    }

    return { data: await response.json() };
  },

  post: async (url, data, options = {}) => {
    const response = await makeRequest(`${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || response.statusText);
    }

    return { data: await response.json() };
  },

  delete: async (url, options = {}) => {
    const response = await makeRequest(`${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...(options.body ? { body: JSON.stringify(options.body) } : {}),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || response.statusText);
    }

    return { data: await response.json().catch(() => null) };
  },
};

export default api;