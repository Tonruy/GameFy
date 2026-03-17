import GameRow from "../ui/gameRow/GameRow.jsx";

const TopRatedSection = ({ games }) => {
	if (!games || games.length === 0) {
		return null;
	}

	return <GameRow title="Top Rated" games={games} />;
};

export default TopRatedSection;
