import { request } from "./httpClient";

export const getTrendingGames = () => {
	// request is async but the data does not change so we don't need async here. Only if we use the data for any transform (data.slice... example)
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
