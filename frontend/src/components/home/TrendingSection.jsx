import GameRow from "../ui/gameRow/GameRow.jsx";

const TrendingSection = ({ games }) => {
	if (!games || games.length === 0) {
		return null;
	}

	return <GameRow title="Trending" games={games} />;
};

export default TrendingSection;
