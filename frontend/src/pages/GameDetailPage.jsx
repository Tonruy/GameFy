import { useParams } from 'react-router-dom';

export default function GameDetailPage() {
	const { gameId } = useParams();
	return <h1>Game Detail: {gameId}</h1>;
}