import { VALIDATION_RULES } from "@/libs/constants";
import type {
	BasicInfo,
	Details,
	UserRole,
	ValidationErrors,
} from "@/libs/types";

export const validators = {
	required: (
		value: string | undefined,
		fieldName: string,
	): string | undefined => {
		return !value?.trim() ? `${fieldName} is required` : undefined;
	},

	email: (value: string | undefined): string | undefined => {
		if (!value?.trim()) return "Email is required";
		return !VALIDATION_RULES.EMAIL_REGEX.test(value)
			? "Invalid email format"
			: undefined;
	},

	fileSize: (file: File, maxSizeMB: number): string | undefined => {
		const maxSizeBytes = maxSizeMB * 1024 * 1024;
		return file.size > maxSizeBytes
			? `File size must be less than ${maxSizeMB}MB`
			: undefined;
	},

	fileType: (
		file: File,
		acceptedFormats: readonly string[],
	): string | undefined => {
		return !acceptedFormats.includes(file.type)
			? `Please upload a valid image (${acceptedFormats.join(", ")})`
			: undefined;
	},
};

export function validateBasicInfo(data: Partial<BasicInfo>): ValidationErrors {
	return {
		fullName: validators.required(data.fullName, "Full name"),
		email: validators.email(data.email),
		department: validators.required(data.department, "Department"),
		role: validators.required(data.role, "Role"),
	};
}

export function validateDetails(
	data: Partial<Details>,
	role: UserRole,
): ValidationErrors {
	const errors: ValidationErrors = {
		employmentType: validators.required(data.employmentType, "Employment type"),
		officeLocation: validators.required(data.officeLocation, "Office location"),
	};

	if (role === "admin" && !data.photo) {
		errors.photo = "Photo is required for admin users";
	}

	return errors;
}

export function hasErrors(errors: ValidationErrors): boolean {
	return Object.values(errors).some((error) => error !== undefined);
}

export function getFirstError(errors: ValidationErrors): string | null {
	return Object.values(errors).find((error) => error !== undefined) ?? null;
}
