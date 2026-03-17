import { useEffect, useState } from "react";
import DetailHeroSection from "./DetailHeroSection.jsx";
import TrailerSection from "./TrailerSection.jsx";
import DescriptionSection from "./DescriptionSection.jsx";
import ScreenshotsGallery from "./ScreenshotsGallery.jsx";
import SimilarGamesSection from "./SimilarGamesSection.jsx";
import ImageModalSlider from "../ui/ImageModalSlider/ImageModalSlider.jsx";
import { addFavorite, removeFavorite } from "../../api/usersApi.js";
import "./style/gameDetail.css";

const buildHdImageUrl = (url) => {
	if (!url) {
		return null;
	}
	return url.replace("t_thumb", "t_720p").replace("t_screenshot_big", "t_720p");
};

const GameDetailLayout = ({
	game,
	similarGames,
	authUser,
	isAuthReady,
	syncAuthFavorites = () => {},
	showFeedback = () => {}
}) => {
	const [isImageModalOpen, setIsImageModalOpen] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [isFavorite, setIsFavorite] = useState(false);
	const [isSubmittingFavorite, setIsSubmittingFavorite] = useState(false);
	const isLoggedIn = Boolean(authUser);
	const hdScreenshots = Array.isArray(game?.screenshotsUrls)
		? game.screenshotsUrls.map(buildHdImageUrl).filter(Boolean)
		: [];

	const openImageModal = (index) => {
		setSelectedImageIndex(index);
		setIsImageModalOpen(true);
	};

	const closeImageModal = () => {
		setIsImageModalOpen(false);
	};

	useEffect(() => {
		if (!isLoggedIn || !game?.id) {
			setIsFavorite(false);
			return;
		}

		const favoritesIds = Array.isArray(authUser?.favorites) ? authUser.favorites : [];
		const gameIsFavorite = favoritesIds.some((favoriteId) => String(favoriteId) === String(game.id));
		setIsFavorite(gameIsFavorite);
	}, [isLoggedIn, game?.id, authUser?.favorites]);

	const handleToggleFavorite = async () => {
		if (!isLoggedIn || !game?.id || isSubmittingFavorite) {
			return;
		}

		setIsSubmittingFavorite(true);

		try {
			if (isFavorite) {
				await removeFavorite(game.id);
				setIsFavorite(false);
				syncAuthFavorites(game.id, false);
				showFeedback('Game removed from favorites');
			} else {
				await addFavorite(game.id);
				setIsFavorite(true);
				syncAuthFavorites(game.id, true);
				showFeedback('Game saved into favorites');
			}
		} catch (error) {
			showFeedback('Could not update favorites', 'danger');
		} finally {
			setIsSubmittingFavorite(false);
		}
	};

	if (!game) {
		return null;
	}

	return (
		<div className="gd">
			<div className="gd__card">
				<DetailHeroSection
					game={game}
					isAuthReady={isAuthReady}
					isLoggedIn={isLoggedIn}
					isFavorite={isFavorite}
					onToggleFavorite={handleToggleFavorite}
					isSubmittingFavorite={isSubmittingFavorite}
				/>
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
