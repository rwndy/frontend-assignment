import type { FC } from "react";
import { useNavigate } from "react-router-dom";

import { EmployeeTable } from "@/components/featuers";
import {
	Button,
	ErrorMessage,
	LoadingSpinner,
	Pagination,
} from "@/components/ui";
import { VALIDATION_RULES } from "@/libs/constants";
import { useEmployees, usePagination } from "@/utils/hooks";
import "./Employee.css";

const EmployeePage: FC = () => {
	const { employees, loading, error } = useEmployees();
	const navigate = useNavigate();

	console.log('tadddaaa!')

	const {
		currentPage,
		totalPages,
		paginatedData,
		goToPage,
		nextPage,
		prevPage,
	} = usePagination(employees, VALIDATION_RULES.ITEMS_PER_PAGE);

	if (loading) {
		return (
			<div className={"centerContainer"}>
				<LoadingSpinner />
			</div>
		);
	}

	if (error) {
		return (
			<div className={"centerContainer"}>
				<ErrorMessage message={error} />
			</div>
		);
	}

	return (
		<div className={"container"}>
			<div className={"header"}>
				<h1 className={"title"}>Employee List Page</h1>
				<Button
					onClick={() => navigate("/wizard?role=admin")}
					variant="primary"
				>
					+ Add Wizard
				</Button>
			</div>

			<div className={"content"}>
				<EmployeeTable employees={paginatedData} />

				{totalPages > 1 && (
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						totalItems={employees.length}
						itemsPerPage={VALIDATION_RULES.ITEMS_PER_PAGE}
						onPageChange={goToPage}
						onNext={nextPage}
						onPrev={prevPage}
					/>
				)}
			</div>
		</div>
	);
};

export default EmployeePage;
