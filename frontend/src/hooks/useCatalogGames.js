import { useEffect, useState } from "react";
import { getGamesByGenre, getGamesByPlatform } from "../api/gamesApi.js";

export const useCatalogGames = (mode, id) => {
	const [games, setGames] = useState([]);
	const [errorMessage, setErrorMessage] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const isValidMode = mode === "genre" || mode === "platform";
		const parsedId = Number(id);
		const isValidId = Number.isInteger(parsedId) && parsedId > 0;

		if (!isValidMode || !isValidId) {
			setGames([]);
			setErrorMessage(null);
			setIsLoading(false);
			return;
		}

		const fetchGames = async () => {
			try {
				setIsLoading(true);
				setErrorMessage(null);

				const gamesFetched = mode === "genre"
					? await getGamesByGenre(parsedId)
					: await getGamesByPlatform(parsedId);

				setGames(gamesFetched);
			} catch (error) {
				setErrorMessage(error.message);
			} finally {
				setIsLoading(false);
			}
		};

		fetchGames();
	}, [mode, id]);

	return {
		games,
		errorMessage,
		isLoading
	};
};
