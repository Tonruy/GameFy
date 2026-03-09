import { request } from './httpClient.js';

export function getMe() {
	return request('/api/users/me');
}

export function updateMyProfile(profileData) {
	return request('/api/users/me', {
		method: 'PATCH',
		body: JSON.stringify(profileData)
	});
}

export function deleteMyProfile() {
	return request('/api/users/me', {
		method: 'DELETE'
	});
}

export function addFavorite(gameId) {
	return request(`/api/users/me/favorites/${gameId}`, {
		method: 'POST'
	});
}

export function removeFavorite(gameId) {
	return request(`/api/users/me/favorites/${gameId}`, {
		method: 'DELETE'
	});
}

export function getMyFavorites() {
	return request('/api/users/me/favorites');
}
