import { Link } from 'react-router-dom';
import './gamesGrid.css';

const getHighResCover = (url) => {
	if (!url) {
		return null;
	}

	return url.replace('t_thumb', 't_cover_big');
};

export default function GamesGrid({ games }) {
	if (!games || games.length === 0) {
		return null;
	}

	const validGames = games.filter((game) => game.coverUrl);

	if (!validGames.length) {
		return null;
	}

	return (
		<div className="games-grid">
			{validGames.map((game) => (
				<Link key={game.id} to={`/games/${game.id}`} className="games-grid__card">
					<div className="games-grid__coverWrap">
						<img
							className="games-grid__cover"
							src={getHighResCover(game.coverUrl)}
							alt={game.name || 'Game cover'}
							loading="lazy"
						/>
						<div className="games-grid__overlay">
							<p className="games-grid__title">{game.name}</p>
						</div>
					</div>
				</Link>
			))}
		</div>
	);
}
