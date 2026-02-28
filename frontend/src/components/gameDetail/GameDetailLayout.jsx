import { useState } from "react";
import DetailHeroSection from "./DetailHeroSection";
import TrailerSection from "./TrailerSection";
import DescriptionSection from "./DescriptionSection";
import ScreenshotsGallery from "./ScreenshotsGallery";
import SimilarGamesSection from "./SimilarGamesSection";
import ImageModalSlider from "../ui/ImageModalSlider/ImageModalSlider";
import "./style/gameDetail.css";

const buildHdImageUrl = (url) => {
	if (!url) {
		return null;
	}
	// Secured hd screenshoots from layout and it is used in both ScreenshotsGallery and Slider
	// it gives null when the URL is not correct
	return url.replace("t_thumb", "t_720p").replace("t_screenshot_big", "t_720p");
};

const GameDetailLayout = ({ game, similarGames }) => {
	const [isImageModalOpen, setIsImageModalOpen] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);

	if (!game) {
		return null;
	}
	// Filters the null urls from buildHdImageUrl and create a new array without falsy from the array (null, undefined,"")
	// When buildHdImageUrl => (url, url, null, url, null) . filter(Boolean) => (url,url,url)
	const hdScreenshots = Array.isArray(game.screenshotsUrls)
		? game.screenshotsUrls.map(buildHdImageUrl).filter(Boolean)
		: [];

	const openImageModal = (index) => {
		setSelectedImageIndex(index);
		setIsImageModalOpen(true);
	};

	const closeImageModal = () => {
		setIsImageModalOpen(false);
	};

	return (
		<div className="gd">
			<div className="gd__card">
				<DetailHeroSection game={game} />
				<TrailerSection videoIds={game.videoIds} />
				<DescriptionSection summary={game.summary} storyline={game.storyline} />
				<ScreenshotsGallery
					screenshotsUrls={hdScreenshots}
					onImageClick={openImageModal}
				/>
				<SimilarGamesSection games={similarGames} />
			</div>
			<ImageModalSlider
				isOpen={isImageModalOpen}
				images={hdScreenshots}
				initialIndex={selectedImageIndex}
				onClose={closeImageModal}
			/>
		</div>
	);
};

export default GameDetailLayout;
