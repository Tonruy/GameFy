import { useEffect, useState } from "react"
import { getGameById, getSimilarGames } from "../api/gamesApi"



export const useGameDetail = (gameId) => {
	const [gameData, setGameData] = useState(null); //Object
	const [gameSimilars, setGameSimilars] = useState([]);
	const [errorMessage, setErrorMessage] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {

		if (!gameId) {
			return;
		}

		const fetchGame = async () => {
			try {
				//Reset if thee game changes
				setIsLoading(true);
				setErrorMessage(null);

				const [gameData, gameSimilars] = await Promise.all([getGameById(gameId),
					getSimilarGames(gameId)
				])

				setGameData(gameData);
				setGameSimilars(gameSimilars);

			} catch (error) {
				setErrorMessage(error);

			} finally{
				setIsLoading(false);
			}
		};
		fetchGame();
	},[gameId]);

	return{
		gameData,
		gameSimilars,
		errorMessage,
		isLoading
	};
};