import { useEffect, useState } from "react";
import type { Department, Location } from "@/libs/types";
import { wizardService } from "@/services/wizard.service";

interface WizardData {
	departments: Department[];
	locations: Location[];
	isLoading: boolean;
	error: string | null;
}

export function useWizardData(): WizardData {
	const [data, setData] = useState<WizardData>({
		departments: [],
		locations: [],
		isLoading: true,
		error: null,
	});

	useEffect(() => {
		let isMounted = true;

		async function fetchData() {
			try {
				const [departments, locations] = await Promise.all([
					wizardService.getDepartments(),
					wizardService.getLocations(),
				]);

				if (isMounted) {
					setData({
						departments,
						locations,
						isLoading: false,
						error: null,
					});
				}
			} catch (error) {
				if (isMounted) {
					setData((prev) => ({
						...prev,
						isLoading: false,
						error:
							error instanceof Error ? error.message : "Failed to fetch data",
					}));
				}
			}
		}

		fetchData();

		return () => {
			isMounted = false;
		};
	}, []);

	return data;
}
