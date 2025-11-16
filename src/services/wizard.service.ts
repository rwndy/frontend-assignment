import { apiClient } from "@/libs/api";
import { API_ENDPOINTS, VALIDATION_RULES } from "@/libs/constants";
import type { BasicInfo, Department, Details, Location } from "@/libs/types";

interface SubmitBasicInfoResponse {
	id: string;
}

class WizardService {
	private async delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async getDepartments(): Promise<Department[]> {
		return apiClient.get<Department[]>(API_ENDPOINTS.DEPARTMENTS);
	}

	async getLocations(): Promise<Location[]> {
		return apiClient.get<Location[]>(API_ENDPOINTS.LOCATIONS);
	}

	async searchDepartments(query: string): Promise<Department[]> {
		const departments = await this.getDepartments();
		if (!query.trim()) return departments;

		const lowerQuery = query.toLowerCase();
		return departments.filter((dept) =>
			dept.name.toLowerCase().includes(lowerQuery),
		);
	}

	async searchLocations(query: string): Promise<Location[]> {
		const locations = await this.getLocations();
		if (!query.trim()) return locations;

		const lowerQuery = query.toLowerCase();
		return locations.filter((loc) =>
			loc.name.toLowerCase().includes(lowerQuery),
		);
	}

	async submitBasicInfo(data: BasicInfo): Promise<SubmitBasicInfoResponse> {
		await this.delay(VALIDATION_RULES.API_DELAY_MS);

		return apiClient.post<SubmitBasicInfoResponse>(API_ENDPOINTS.BASE, data);
	}

	async submitDetails(data: Details & { basicInfoId: string }): Promise<void> {
		await this.delay(VALIDATION_RULES.API_DELAY_MS);

		await apiClient.post<void>(API_ENDPOINTS.DETAILS, data);
	}
}

export const wizardService = new WizardService();
