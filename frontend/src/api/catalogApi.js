import { request } from "./httpClient";

export const getGenres = () => {
	return request('/api/catalog/genres');
};

export const getPlatforms = () => {
	return request('/api/catalog/platforms');
};
