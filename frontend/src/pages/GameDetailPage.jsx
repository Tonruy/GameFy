import { useOutletContext, useParams } from 'react-router-dom';
import { useGameDetail } from '../hooks/useGameDetail.js';
import GameDetailLayout from '../components/gameDetail/GameDetailLayout.jsx';
import Spinner from "../components/ui/spinner/Spinner.jsx";


export default function GameDetailPage() {

	const { gameId } = useParams();
	const { authUser, isAuthReady, syncAuthFavorites, showFeedback } = useOutletContext();
	const {
		gameData,
		gameSimilars,
		errorMessage,
		isLoading
	} = useGameDetail(gameId);

	return (
		isLoading ? (
			<Spinner />
		) : errorMessage ? (
			<p>Error: {errorMessage}</p>
		) : (
			<GameDetailLayout
				game={gameData}
				similarGames={gameSimilars}
				authUser={authUser}
				isAuthReady={isAuthReady}
				syncAuthFavorites={syncAuthFavorites}
				showFeedback={showFeedback}
			/>
		)
	)
}
