import GameRow from "../ui/gameRow/GameRow";

const NewReleasesSection = ({ games }) => {
	if (!games || games.length === 0) {
		return null;
	}

	return <GameRow title="New Releases" games={games} />;
};

export default NewReleasesSection;
