const formatReleaseDate = (unixSeconds) => {
	if (!unixSeconds) {
		return "Release date: TBD";
	}

	const date = new Date(unixSeconds * 1000);
	return `Release date: ${date.toLocaleDateString()}`;
};

const formatRating = (rating) => {
	if (!rating && rating !== 0) {
		return "Metascore: TBD";
	}

	const rounded = Math.round(rating);
	return `Metascore: ${rounded}`;
};

const withImageSize = (url, size) => {
	if (!url) {
		return null;
	}

	return url.replace(/t_[a-z0-9_]+/i, size);
};

const DetailHeroSection = ({
	game,
	isAuthReady,
	isLoggedIn,
	isFavorite,
	onToggleFavorite,
	isSubmittingFavorite
}) => {
	if (!game) {
		return null;
	}

	const backgroundUrl = game.coverUrl
		? withImageSize(game.coverUrl, "t_1080p")
		: null;
	const cover1xUrl = game.coverUrl ? withImageSize(game.coverUrl, "t_cover_big") : null;
	const cover2xUrl = game.coverUrl ? withImageSize(game.coverUrl, "t_cover_big_2x") : null;

	return (
		<section className="gd-hero">
			{backgroundUrl && (
				<div
					className="gd-hero__bg"
					style={{ backgroundImage: `url(${backgroundUrl})` }}
				/>
			)}

			<div className="gd-hero__content">
				{cover1xUrl && (
					<div className="gd-hero__cover">
						<img
							className="gd-hero__coverImg"
							src={cover1xUrl}
							srcSet={cover2xUrl ? `${cover1xUrl} 1x, ${cover2xUrl} 2x` : undefined}
							alt={game.name}
						/>
					</div>
				)}

				<div className="gd-hero__info">
					<h1 className="gd-hero__title">{game.name}</h1>

					<p className="gd-hero__line">{formatReleaseDate(game.firstReleaseDate)}</p>

					<p className="gd-hero__line gd-hero__meta">{game.genres?.length ? `Genre: ${game.genres.join(", ")}` : "Genre: TBD"}</p>

					<p className="gd-hero__line gd-hero__meta">
						{game.platforms?.length ? `Platforms: ${game.platforms.join(", ")}` : "Platforms: TBD"}
					</p>

					<div className="gd-hero__score">{formatRating(game.rating)}</div>

					{isAuthReady && isLoggedIn ? (
						<div className="gd-hero__actions">
							<button
								className={`gd-btn ${isFavorite ? "gd-btn--danger" : "gd-btn--primary"}`}
								type="button"
								onClick={onToggleFavorite}
								disabled={isSubmittingFavorite}
							>
								{isFavorite ? "Remove from Favorites" : "Add to Favorites"}
							</button>
						</div>
					) : null}
				</div>
			</div>
		</section>
	);
};

export default DetailHeroSection;
