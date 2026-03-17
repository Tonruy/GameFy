import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HERO_GAMES_COUNT = 8;

const HeroSection = ({ games }) => {
	const [order, setOrder] = useState([]);
	const [position, setPosition] = useState(0);

	const shuffle = (array) => {
		for (let i = array.length - 1; i > 0; i--) {
			const random = Math.floor(Math.random() * (i + 1));

			[array[i], array[random]] = [array[random], array[i]];
		}
		return array;
	};

	useEffect(() => {
		if (!games.length) {
			return;
		}

		const indexes = Array.from({ length: games.length }, (_, i) => i);
		const shuffled = shuffle(indexes);
		const heroIndexes = shuffled.slice(0, Math.min(HERO_GAMES_COUNT, shuffled.length));

		setOrder(heroIndexes);
		setPosition(0);
	}, [games]);

	useEffect(() => {
		if (!order.length) {
			return;
		}

		const timer = setInterval(() => {
			setPosition((previousPosition) => {
				return (previousPosition + 1) % order.length;
			});
		}, 6000);

		return () => {
			clearInterval(timer);
		};
	}, [order]);

	const toHeroImageUrl = (game) => {
		if (!game) {
			return "";
		}

		if (game.heroImageUrl) {
			return game.heroImageUrl.replace(/t_[a-z0-9_]+/i, "t_1080p");
		}

		if (game.coverUrl) {
			return game.coverUrl.replace(/t_[a-z0-9_]+/i, "t_cover_big_2x");
		}

		return "";
	};

	const currentGame = games.length && order.length ? games[order[position]] : null;
	const heroImage = toHeroImageUrl(currentGame);
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
