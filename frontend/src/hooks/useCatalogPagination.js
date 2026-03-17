import { useEffect, useMemo, useState } from "react";

export const useCatalogPagination = (games, mode, id, pageSize = 20) => {
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		setCurrentPage(1);
	}, [mode, id]);

	const totalPages = useMemo(() => {
		return Math.max(1, Math.ceil(games.length / pageSize));
	}, [games.length, pageSize]);

	const currentPageGames = useMemo(() => {
		const startIndex = (currentPage - 1) * pageSize;
		return games.slice(startIndex, startIndex + pageSize);
	}, [games, currentPage, pageSize]);

	const goToPreviousPage = () => {
		setCurrentPage((previousPage) => Math.max(1, previousPage - 1));
	};

	const goToNextPage = () => {
		setCurrentPage((previousPage) => Math.min(totalPages, previousPage + 1));
	};

	return {
		currentPage,
		totalPages,
		currentPageGames,
		goToPreviousPage,
		goToNextPage
	};
};
