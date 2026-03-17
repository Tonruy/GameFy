import { request } from "./httpClient.js";

export const getTrendingGames = () => {
	return request('/api/games/trending')
};

export const getNewGames =  () => {
	return request('/api/games/new');
};

export const getTopRatedGames = () => {
	return request('/api/games/top-rated');
};

export const getDiscoverGames = () => {
	return request('/api/games/discover');
};

export const getIncomingGames = () => {
	return request('/api/games/incoming');
};

export const getGameById = (gameId) => {
	return request (`/api/games/${gameId}`);
};

export const getSimilarGames = (gameId) => {
	return request (`/api/games/${gameId}/similar`);
};

export const getGamesByGenre = (genreId) => {
	return request (`/api/games/genre/${genreId}`);
};
export const getGamesByPlatform = (platformId) => {
	return request (`/api/games/platform/${platformId}`);
};

export const searchGames = (searchQuery) => {
  return request(`/api/games/search?searchQuery=${encodeURIComponent(searchQuery)}`);
};
