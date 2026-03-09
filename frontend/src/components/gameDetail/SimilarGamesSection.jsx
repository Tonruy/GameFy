import GameRow from "../ui/gameRow/GameRow.jsx";

const SimilarGamesSection = ({ games }) => {
	if (!games || games.length === 0) {
		return null;
	}

	return (
		<section className="gd-section">
			<GameRow title="Similar Games" games={games} />
		</section>
	);
};

export default SimilarGamesSection;
