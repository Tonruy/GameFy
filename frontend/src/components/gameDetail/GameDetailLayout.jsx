import DetailHeroSection from "./DetailHeroSection";
import TrailerSection from "./TrailerSection";
import DescriptionSection from "./DescriptionSection";
import ScreenshotsGallery from "./ScreenshotsGallery";
import SimilarGamesSection from "./SimilarGamesSection";
import "./style/gameDetail.css";

const GameDetailLayout = ({ game, similarGames }) => {
	if (!game) {
		return null;
	}

	return (
		<div className="gd">
			<div className="gd__card">
				<DetailHeroSection game={game} />
				<TrailerSection videoIds={game.videoIds} />
				<DescriptionSection summary={game.summary} storyline={game.storyline} />
				<ScreenshotsGallery screenshotsUrls={game.screenshotsUrls} />
				<SimilarGamesSection games={similarGames} />
			</div>
		</div>
	);
};

export default GameDetailLayout;
