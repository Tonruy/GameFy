import GameRow from "../ui/gameRow/gameRow";

const DiscoverSection = ({ games }) => {
	if (!games || games.length === 0) {
		return null;
	}

	return <GameRow title="Discover" games={games} />;
};

export default DiscoverSection;
