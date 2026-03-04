import { request } from './httpClient';

export function registerUser(email, username, password) {
	return request('/api/auth/register', {
		method: 'POST',
		body: JSON.stringify({ email, username, password })
	});
}

export function loginUser(identifier, password) {
	return request('/api/auth/login', {
		method: 'POST',
		body: JSON.stringify({ identifier, password })
	});
}
