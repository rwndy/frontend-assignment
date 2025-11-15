/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
import type { FC } from "react";
import { Button } from "../Button";
import "./Pagination.css";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
	onPageChange: (page: number) => void;
	onNext: () => void;
	onPrev: () => void;
}

const Pagination: FC<PaginationProps> = ({
	currentPage,
	totalPages,
	totalItems,
	itemsPerPage,
	onPageChange,
	onNext,
	onPrev,
}) => {
	const startItem = (currentPage - 1) * itemsPerPage + 1;
	const endItem = Math.min(currentPage * itemsPerPage, totalItems);

	const getPageNumbers = () => {
		const pages: (number | string)[] = [];
		const maxVisiblePages = 7;

		if (totalPages <= maxVisiblePages) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			pages.push(1);

			if (currentPage > 3) {
				pages.push("...");
			}

			const start = Math.max(2, currentPage - 1);
			const end = Math.min(totalPages - 1, currentPage + 1);

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (currentPage < totalPages - 2) {
				pages.push("...");
			}

			pages.push(totalPages);
		}

		return pages;
	};

	return (
		<div className={"container"}>
			<div className={"mobileControls"}>
				<Button
					onClick={onPrev}
					disabled={currentPage === 1}
					variant="secondary"
				>
					Previous
				</Button>
				<Button
					onClick={onNext}
					disabled={currentPage === totalPages}
					variant="secondary"
				>
					Next
				</Button>
			</div>

			<div className={"desktopControls"}>
				<div className={"info"}>
					<p>
						Showing <span className={"highlight"}>{startItem}</span> to{" "}
						<span className={"highlight"}>{endItem}</span> of{" "}
						<span className={"highlight"}>{totalItems}</span> results
					</p>
				</div>

				<nav className={"navigation"}>
					<Button
						onClick={onPrev}
						disabled={currentPage === 1}
						variant="secondary"
						className={"navButton"}
					>
						Previous
					</Button>

					<div className={"pageNumbers"}>
						{getPageNumbers().map((page) => {
							if (page === "...") {
								return (
									<span key={`ellipsis-${page}`} className={"ellipsis"}>
										...
									</span>
								);
							}

							return (
								<button
									key={page}
									onClick={() => onPageChange(page as number)}
									className={`pageButton ${
										currentPage === page ? "active" : ""
									}`}
									aria-current={currentPage === page ? "page" : undefined}
								>
									{page}
								</button>
							);
						})}
					</div>

					<Button
						onClick={onNext}
						disabled={currentPage === totalPages}
						variant="secondary"
						className={"navButton"}
					>
						Next
					</Button>
				</nav>
			</div>
		</div>
	);
};

export default Pagination;
