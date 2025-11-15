import { useCallback, useMemo, useState } from "react";

interface UsePaginationReturn<T> {
	currentPage: number;
	totalPages: number;
	paginatedData: T[];
	goToPage: (page: number) => void;
	nextPage: () => void;
	prevPage: () => void;
	reset: () => void;
}

export const usePagination = <T>(
	data: T[],
	itemsPerPage: number,
): UsePaginationReturn<T> => {
	const [currentPage, setCurrentPage] = useState(1);

	const totalPages = Math.ceil(data.length / itemsPerPage);

	const paginatedData = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return data.slice(startIndex, endIndex);
	}, [data, currentPage, itemsPerPage]);

	const goToPage = useCallback(
		(page: number) => {
			const pageNumber = Math.max(1, Math.min(page, totalPages));
			setCurrentPage(pageNumber);
		},
		[totalPages],
	);

	const nextPage = useCallback(() => {
		setCurrentPage((prev) => Math.min(prev + 1, totalPages));
	}, [totalPages]);

	const prevPage = useCallback(() => {
		setCurrentPage((prev) => Math.max(prev - 1, 1));
	}, []);

	const reset = useCallback(() => {
		setCurrentPage(1);
	}, []);

	return {
		currentPage,
		totalPages,
		paginatedData,
		goToPage,
		nextPage,
		prevPage,
		reset,
	};
};
