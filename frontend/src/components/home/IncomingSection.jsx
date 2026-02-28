import GameRow from "../ui/gameRow/GameRow";

const IncomingSection = ({ games }) => {
	if (!games || games.length === 0) {
		return null;
	}

	return <GameRow title="Incoming" games={games} />;
};

export default IncomingSection;
