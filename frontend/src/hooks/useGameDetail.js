import { useEffect, useState } from "react"
import { getGameById, getSimilarGames } from "../api/gamesApi.js"

export const useGameDetail = (gameId) => {
	const [gameData, setGameData] = useState(null); //Object
	const [gameSimilars, setGameSimilars] = useState([]);
	const [errorMessage, setErrorMessage] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// If theres not gameId it start a loop with isLoading so It has to set everything to stop the loop.
		if (!gameId) {
			setGameData(null);
			setGameSimilars([]);
			setErrorMessage(null);
			setIsLoading(false);
			return;
		}

		const fetchGame = async () => {
			try {
				// Reset if the game changes
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
