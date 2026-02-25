import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getGameMedia } from "../../api/gamesApi";

const HeroSection = ({ games }) => {
	// Initial states for games showed in Hero (I dont want the same order than trending)
	const [order, setOrder] = useState([]);
	const [position, setPosition] = useState(0);
	const [heroBackgroundByGameId, setHeroBackgroundByGameId] = useState({});

	// Shuffle Fisher-Yates
	const shuffle = (array) => {
		for (let i = array.length - 1; i > 0; i--) {
			const random = Math.floor(Math.random() * (i + 1));

			[array[i], array[random]] = [array[random], array[i]];
		}
		return array;
	};

	//Shuffle order and set position
	useEffect(() => {
		if (!games.length) {
			return;
		}

		// Array.from(array.like , function(value, index)) -> _ means: don't use the value
		const indexes = Array.from({ length: games.length }, (_, i) => i);
		const shuffled = shuffle(indexes);

		setOrder(shuffled);
		setPosition(0);
	}, [games]);

	//Timer 
	useEffect(() => {
		if (!order.length) {
			return;
		}

		const timer = setInterval(() => {
			//setState -> saves the initial position (0) and update its with +1 (the next position)
			setPosition((previousPosition) => {
				return (previousPosition + 1) % order.length; // When order is 0 it starts again
			});
		}, 6000);

		return () => {
			clearInterval(timer);
		};
	}, [order]);

	useEffect(() => {
		const toHighResScreenshot = (url) => {
			if (!url) {
				return "";
			}

			return url.replace("t_thumb", "t_screenshot_huge");
		};

		const toHighResCover = (url) => {
			if (!url) {
				return "";
			}

			return url.replace("t_thumb", "t_cover_big_2x");
		};

		let isCancelled = false;

		const loadAllHeroScreenshots = async () => {
			if (!games.length) {
				return;
			}

			const uniqueGameIds = [];
			games.forEach((game) => {
				if (game && game.id && !uniqueGameIds.includes(game.id)) {
					uniqueGameIds.push(game.id);
				}
			});

			await Promise.all(
				uniqueGameIds.map(async (gameId) => {
					try {
						const media = await getGameMedia(gameId);
						const screenshot = media ? media.heroScreenshotUrl : "";
						const highResScreenshot = toHighResScreenshot(screenshot);
						const game = games.find((item) => item.id === gameId);
						const highResCover = game ? toHighResCover(game.coverUrl) : "";
						const finalHeroImage = highResScreenshot || highResCover;

						if (!finalHeroImage || isCancelled) {
							return;
						}

						setHeroBackgroundByGameId((previousBackgrounds) => ({
							...previousBackgrounds,
							[gameId]: finalHeroImage
						}));
					} catch (error) {
						if (isCancelled) {
							return null;
						}

						const game = games.find((item) => item.id === gameId);
						const highResCover = game ? toHighResCover(game.coverUrl) : "";

						if (!highResCover) {
							return null;
						}

						setHeroBackgroundByGameId((previousBackgrounds) => ({
							...previousBackgrounds,
							[gameId]: highResCover
						}));

						return null;
					}
				})
			);
		};

		loadAllHeroScreenshots();

		return () => {
			isCancelled = true;
		};
	}, [games]);

	const currentGame = games.length && order.length ? games[order[position]] : null;
	const heroImage =
		currentGame
			? heroBackgroundByGameId[currentGame.id] || (currentGame.coverUrl ? currentGame.coverUrl.replace("t_thumb", "t_cover_big_2x") : "")
			: "";
	const heroStyle = {};

	if (!games.length || !order.length || !currentGame) {
		return null;
	}

	if (heroImage) {
		heroStyle["--hero-image"] = `url("${heroImage}")`;
	}

	return (
		<Link
			className="hero-section hero-section--card"
			to={`/games/${currentGame.id}`}
			style={heroStyle}
		>
			<span className="hero-section__title">
				{currentGame.name}
			</span>
		</Link>
	);
};

export default HeroSection;
