import type { FC } from "react";
import { AutocompleteField, PhotoUpload, Select } from "@/components/ui";
import type {
	Details,
	Location,
	UserRole,
	ValidationErrors,
} from "@/libs/types";
import { EMPLOYMENT_TYPES } from "@/libs/types";
import { wizardService } from "@/services/wizard.service";
import "./DetailStep.css";

interface DetailsStepProps {
	data: Partial<Details>;
	locations: Location[];
	errors: ValidationErrors;
	role: UserRole;
	onChange: (field: keyof Details, value: string) => void;
}

const DetailsStep: FC<DetailsStepProps> = ({
	data,
	errors,
	role,
	onChange,
}) => {
	return (
		<div className="wizard-step">
			<h3 className="wizard-step__title">
				Details & Submit ({role === "admin" ? "Admin + Ops" : "Ops"})
			</h3>

			<div className="gap">
				<PhotoUpload
					label="Photo"
					required
					onPhotoSelect={(base64, filename) => {
						onChange("photo", base64);
						onChange("photoFilename", filename);
					}}
					currentPhoto={data.photo}
				/>
			</div>

			<div className="gap">
				<Select
					isRequired
					label="Employment Type"
					placeholder="Select employment type"
					size="md"
					options={EMPLOYMENT_TYPES.map((type) => ({
						value: type,
						label: type,
					}))}
					value={data.employmentType || ""}
					onChange={(e) => onChange("employmentType", e.target.value)}
					error={errors.employmentType}
				/>
			</div>

			<div className="gap">
				<AutocompleteField
					label="Office Location"
					placeholder="Search location..."
					fetchSuggestions={(query) => wizardService.searchLocations(query)}
					value={data.officeLocation || ""}
					onSelect={(item) => onChange("officeLocation", item.name)}
					required
				/>
			</div>

			<div className="details-step__form-group gap">
				<label htmlFor="notes" className="details-step__label">
					Notes
				</label>
				<textarea
					id="notes"
					className="details-step__textarea"
					placeholder="Additional notes..."
					rows={4}
					value={data.notes || ""}
					onChange={(e) => onChange("notes", e.target.value)}
				/>
				<p className="details-step__helper">Included in draft auto-save</p>
			</div>
		</div>
	);
};

export default DetailsStep;
