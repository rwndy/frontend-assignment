import { apiClient } from "@/libs/api";
import { API_ENDPOINTS } from "@/libs/constants";
import type {
	BasicInfoWithId,
	DetailsEmployee,
	MergedEmployee,
} from "@/libs/types";

class EmployeeService {
	private async fetchBasicInfo(): Promise<BasicInfoWithId[]> {
		return apiClient.get<BasicInfoWithId[]>(`${API_ENDPOINTS.BASE}/basicInfo`);
	}

	private async fetchDetails(): Promise<DetailsEmployee[]> {
		return apiClient.get<DetailsEmployee[]>(`${API_ENDPOINTS.DETAILS}/details`);
	}

	async fetchAndMergeEmployees(): Promise<MergedEmployee[]> {
		const [basicInfoArray, detailsArray] = await Promise.all([
			this.fetchBasicInfo(),
			this.fetchDetails(),
		]);

		const mergedEmployees: MergedEmployee[] = basicInfoArray.map((basic) => {
			const detail = detailsArray.find((d) => d.basicInfoId === basic.id);

			return {
				...basic,
				location: detail?.officeLocation,
				photo: detail?.photo,
			};
		});

		return mergedEmployees;
	}
}

export const employeeService = new EmployeeService();
