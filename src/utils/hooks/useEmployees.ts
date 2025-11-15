import { useCallback, useEffect, useState } from "react";
import type { MergedEmployee } from "@/libs/types";
import { employeeService } from "@/services/employee.service";

interface UseEmployeesReturn {
	employees: MergedEmployee[];
	loading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
}

export const useEmployees = (): UseEmployeesReturn => {
	const [employees, setEmployees] = useState<MergedEmployee[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchEmployees = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await employeeService.fetchAndMergeEmployees();
			setEmployees(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchEmployees();
	}, [fetchEmployees]);

	return {
		employees,
		loading,
		error,
		refetch: fetchEmployees,
	};
};
