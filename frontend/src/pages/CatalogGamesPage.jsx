import { useLocation, useParams } from 'react-router-dom';
import { useCatalogGames } from '../hooks/useCatalogGames';
import { useCatalogPagination } from '../hooks/useCatalogPagination';
import Spinner from '../components/ui/spinner/Spinner';
import GamesCatalogLayout from '../components/gamesCatalog/GamesCatalogLayout';

const pageSize = 20;

export default function CatalogGamesPage() {
	const { mode, id } = useParams();
	const { state } = useLocation();
	const { games, isLoading, errorMessage } = useCatalogGames(mode, id);
	const sectionTitle = state?.selectedName ? `${state.selectedName} Games` : 'Games';
	const {
		currentPage,
		totalPages,
		currentPageGames,
		goToPreviousPage,
		goToNextPage
	} = useCatalogPagination(games, mode, id, pageSize);

	if (isLoading) {
		return <Spinner />;
	}

	if (errorMessage) {
		return <p>Error: {errorMessage}</p>;
	}

	if (!games.length) {
		return <p>No games found.</p>;
	}

	return (
		<GamesCatalogLayout
			title={sectionTitle}
			games={currentPageGames}
			currentPage={currentPage}
			totalPages={totalPages}
			onPreviousPage={goToPreviousPage}
			onNextPage={goToNextPage}
		/>
	);
}
