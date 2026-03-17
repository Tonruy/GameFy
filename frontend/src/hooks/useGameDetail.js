import { useEffect, useState } from "react"
import { getGameById, getSimilarGames } from "../api/gamesApi.js"

export const useGameDetail = (gameId) => {
	const [gameData, setGameData] = useState(null);
	const [gameSimilars, setGameSimilars] = useState([]);
	const [errorMessage, setErrorMessage] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!gameId) {
			setGameData(null);
			setGameSimilars([]);
			setErrorMessage(null);
			setIsLoading(false);
			return;
		}

		const fetchGame = async () => {
			try {
				setIsLoading(true);
				setErrorMessage(null);

				const [gameDataFetched, gameSimilarsFetched] = await Promise.all([
					getGameById(gameId),
					getSimilarGames(gameId)
				]);

				setGameData(gameDataFetched);
				setGameSimilars(gameSimilarsFetched);
			} catch (error) {
				setErrorMessage(error.message);
			} finally {
				setIsLoading(false);
			}
		};

		fetchGame();
	}, [gameId]);

	return {
		gameData,
		gameSimilars,
		errorMessage,
		isLoading
	};
};
