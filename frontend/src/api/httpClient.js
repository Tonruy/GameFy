// httpClient is the natural name for the api 
// This is the only archive which uses fetch with the backend
// HTTP error control
// Parsed Json


const API_URL = import.meta.env.VITE_API_BASE_URL;

// Without options, the method is GET as default
export async function request(endpoint, options = {}) {
	const token = localStorage.getItem('gamefy_access_token');
	// B.Practices = not changing real options -> create a copy and mutate it
	const headers = {
		'Content-Type': 'application/json', // In case is a GET , it doesn't affect
		...(token && { Authorization: `Bearer ${token}` }),
		...options.headers
	};
	// Copy of options + new header
  const config = {
    ...options,
    headers
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
}