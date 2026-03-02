import GamesGrid from "../ui/gamesGrid/gamesGrid";

const GamesCatalogLayout = ({
	title,
	games,
	currentPage,
	totalPages,
	onPreviousPage,
	onNextPage
}) => {
	return (
		<div>
			<h1>{title}</h1>
			<GamesGrid games={games} />
			<div className="catalog-pagination">
				<button
					type="button"
					className="catalog-pagination__button"
					onClick={onPreviousPage}
					disabled={currentPage === 1}
				>
					Prev
				</button>
				<p className="catalog-pagination__label">
					Page {currentPage} of {totalPages}
				</p>
				<button
					type="button"
					className="catalog-pagination__button"
					onClick={onNextPage}
					disabled={currentPage === totalPages}
				>
					Next
				</button>
			</div>
		</div>
	);
};

export default GamesCatalogLayout;
