import { request } from './httpClient';

export function getMe() {
	return request('/api/users/me');
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
