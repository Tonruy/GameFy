const API_URL = import.meta.env.VITE_API_BASE_URL;

export async function request(endpoint, options = {}) {
	const token = localStorage.getItem('gamefy_access_token');
	const method = (options.method || 'GET').toUpperCase();
	const headers = {
		...(token && { 
			Authorization: `Bearer ${token}`,
			'auth-token': token }),
		...options.headers
	};

	if (method !== 'GET' && method !== 'HEAD' && !headers['Content-Type']) {
		headers['Content-Type'] = 'application/json';
	
	}
  const config = {
    ...options,
    headers
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errorMessage || data.message || 'Request failed');
  }
  return data;
}
