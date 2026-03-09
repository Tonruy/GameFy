import { useEffect, useState } from 'react';
import { getMyFavorites } from '../../api/usersApi.js';
import Spinner from '../ui/spinner/Spinner.jsx';
import GamesGrid from '../ui/gamesGrid/gamesGrid.jsx';

export default function UserFavoritesComponent() {
	const [favorites, setFavorites] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		const fetchFavorites = async () => {
			try {
				setIsLoading(true);
				setErrorMessage('');

				const favoritesData = await getMyFavorites();
				setFavorites(favoritesData || []);
			} catch (error) {
				setErrorMessage(error.message || 'Could not load favorites');
				setFavorites([]);
			} finally {
				setIsLoading(false);
			}
		};

		fetchFavorites();
	}, []);

	if (isLoading) {
		return <Spinner />;
	}

	if (errorMessage) {
		return <p>Error: {errorMessage}</p>;
	}

	return (
		<div>
			<h1>My Favorites</h1>
			{favorites.length ? <GamesGrid games={favorites} /> : <p>No favorites yet.</p>}
		</div>
	);
}
