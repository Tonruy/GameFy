import { useEffect, useMemo, useState } from "react";

export const useCatalogPagination = (games, mode, id, pageSize = 20) => {
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		setCurrentPage(1);
	}, [mode, id]);

	// useMemo evade to calc again when nothing changes
	const totalPages = useMemo(() => {
		// Calc how many pages we need . 1 -> Never less than 1 . Math.ceil -> rounded above
		return Math.max(1, Math.ceil(games.length / pageSize));
	}, [games.length, pageSize]);

	const currentPageGames = useMemo(() => {
		const startIndex = (currentPage - 1) * pageSize;
		// Render stops before startIndex+pageSize (Example: stops at 20 but charge from 0 to 19)
		return games.slice(startIndex, startIndex + pageSize);
	}, [games, currentPage, pageSize]);

	const goToPreviousPage = () => {
		// min page -> 1
		setCurrentPage((previousPage) => Math.max(1, previousPage - 1));
	};

	const goToNextPage = () => {
		// max page -> totalPages
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
