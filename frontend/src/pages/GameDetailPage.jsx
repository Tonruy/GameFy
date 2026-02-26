import { useParams } from 'react-router-dom';
import { useGameDetail } from '../hooks/useGameDetail';
import GameDetailLayout from '../components/gameDetail/GameDetailLayout';


export default function GameDetailPage() {

	const { gameId } = useParams();
	const {
		gameData,
		gameSimilars,
		errorMessage,
		isLoading
	} = useGameDetail(gameId);

	if (isLoading) {
		return <p> Cargando...</p>
	};

	if (errorMessage) {
		return <p>Error: {errorMessage}</p>;
	}


	return (
		<GameDetailLayout game={gameData} similarGames={gameSimilars} />

	)
}