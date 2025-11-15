import type { FC } from "react";
import { AutocompleteField, Input, Select } from "@/components/ui";
import type { BasicInfo, ValidationErrors } from "@/libs/types";

import { wizardService } from "@/services/wizard.service";

interface BasicInfoStepProps {
	data: Partial<BasicInfo>;
	errors: ValidationErrors;
	onChange: (field: keyof BasicInfo, value: string) => void;
}

const BasicInfoStep: FC<BasicInfoStepProps> = ({ data, errors, onChange }) => {
	return (
		<div className="wizard-step">
			<h3 className="wizard-step__title">Basic Info (Admin Only)</h3>

			<Input
				required
				label="Full Name"
				id="fullName"
				name="fullName"
				placeholder="Enter your full name"
				value={data.fullName || ""}
				onChange={(e) => onChange("fullName", e.target.value)}
				error={errors.fullName}
				size="lg"
			/>

			<Input
				required
				type="email"
				label="Email"
				id="email"
				name="email"
				placeholder="Enter your email"
				value={data.email || ""}
				onChange={(e) => onChange("email", e.target.value)}
				error={errors.email}
				size="lg"
			/>

			<AutocompleteField
				label="Department"
				placeholder="Search department..."
				fetchSuggestions={(query) => wizardService.searchDepartments(query)}
				value={data.department || ""}
				onSelect={(item) => onChange("department", item.name)}
				required
			/>

			<Select
				isRequired
				label="Role"
				placeholder="Select Role"
				size="lg"
				options={[
					{ value: "Ops", label: "Ops" },
					{ value: "Admin", label: "Admin" },
					{ value: "Engineer", label: "Engineer" },
					{ value: "Finance", label: "Finance" },
				]}
				value={data.role || ""}
				onChange={(e) => onChange("role", e.target.value)}
				error={errors.role}
			/>

			<Input
				disabled
				label="Employee ID"
				id="employeeId"
				name="employeeId"
				value={data.employeeId || ""}
				helperText="Auto-generated (e.g., ENG-003)"
				size="lg"
			/>
		</div>
	);
};

export default BasicInfoStep;
