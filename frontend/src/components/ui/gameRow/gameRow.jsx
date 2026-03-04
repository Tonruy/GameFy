import { Link } from "react-router-dom";
import { useMemo, useRef, useState } from "react";
import "./GameRow.css";

const GameRow = ({ title, games }) => {
	if (!games || !games.length) {
		return null;
	}
	// useMemo saves the result so it doesn't render again when 
	const validGames = useMemo(() => games.filter((game) => game.coverUrl), [games]);

	if (!validGames.length) {
		return null;
	}

	const getHighResCover = (url) => {
		if (!url) {
			return null;
		}

		return url.replace("t_thumb", "t_cover_big");
	};

	const listRef = useRef(null);
	const [canGoLeft, setCanGoLeft] = useState(false);
	const [canGoRight, setCanGoRight] = useState(true);

	const updateArrowsState = () => {
		const listElement = listRef.current;
		if (!listElement) {
			return;
		}

		const maxScrollLeft = listElement.scrollWidth - listElement.clientWidth;
		const nextCanGoLeft = listElement.scrollLeft > 0;
		const nextCanGoRight = listElement.scrollLeft < maxScrollLeft - 2;

		setCanGoLeft(nextCanGoLeft);
		setCanGoRight(nextCanGoRight);
	};

	const scrollByCards = (directionCards) => {
		const listElement = listRef.current;
		if (!listElement) {
			return;
		}

		// Card width + gap, measured from DOM to avoid wrong view
		const firstCard = listElement.querySelector(".game-row__card");
		if (!firstCard) {
			return;
		}

		const cardWidth = firstCard.getBoundingClientRect().width;

		// Gap from computed style (safe)
		const computed = window.getComputedStyle(listElement);
		const gapValue = computed.gap || "0px";
		const gap = Number.parseFloat(gapValue.replace("px", "")) || 0;

		const step = (cardWidth + gap) * Math.abs(directionCards);
		const direction = directionCards > 0 ? 1 : -1;

		listElement.scrollBy({ left: step * direction, behavior: "smooth" });

		// Update arrows after scroll animation
		// First card -> no left arrow , last card -> no right arrow
		window.setTimeout(updateArrowsState, 220);
	};

	return (
		<section className="game-row">
			<div className="game-row__header">
				<h2 className="game-row__title">{title}</h2>
			</div>

			<div className="game-row__viewport">
				<button
					type="button"
					className="game-row__arrow game-row__arrow--left"
					onClick={() => scrollByCards(-4)}
					disabled={!canGoLeft}
					aria-label="Scroll left"
				>
					<span className="game-row__arrowIcon">‹</span>
				</button>

				<div
					ref={listRef}
					className="game-row__list"
					role="list"
					onScroll={updateArrowsState}
				>
					{validGames.map((game) => (
						<Link
							key={game.id}
							to={`/games/${game.id}`}
							className="game-row__card"
							role="listitem"
						>
							<div className="game-row__cover">
								<img
									className="game-row__img"
									src={getHighResCover(game.coverUrl)}
									alt={game.name || "Game cover"}
									loading="lazy"
									onLoad={updateArrowsState}
								/>

								<div className="game-row__overlay">
									<p className="game-row__overlayTitle">{game.name}</p>
								</div>
							</div>
						</Link>
					))}
				</div>

				<button
					type="button"
					className="game-row__arrow game-row__arrow--right"
					onClick={() => scrollByCards(4)}
					disabled={!canGoRight}
					aria-label="Scroll right"
				>
					<span className="game-row__arrowIcon">›</span>
				</button>
			</div>
		</section>
	);
};

export default GameRow;