import { request } from './httpClient';

export function getMe() {
	return request('/api/users/me');
}
