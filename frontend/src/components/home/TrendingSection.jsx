
import GameRow from "../ui/gameRow/gameRow";


const TrendingSection = ({ games }) => {
	// No need destructuring of props because it only recieves games
	if (!games || games.length === 0) {
		return null;
	}

	return <GameRow title="Trending" games={games} />;
};

export default TrendingSection;