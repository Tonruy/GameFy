import { request } from "./httpClient";

export const getTrendingGames = () => {
	// request is async but the data does not change so we don't need async here. Only if we use the data for any transform (data.slice... example)
	return request('/api/games/trending')
	
}