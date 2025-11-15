export const USER_ROLES = ["admin", "ops"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const EMPLOYMENT_TYPES = [
	"Full-time",
	"Part-time",
	"Contract",
	"Intern",
] as const;
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

export interface Department {
	id: number;
	name: string;
}

export interface Location {
	id: number;
	name: string;
}

export interface BasicInfo {
	fullName: string;
	email: string;
	department: string;
	role: string;
	employeeId: string;
}

export interface Details {
	photo: string;
	photoFilename: string;
	employmentType: EmploymentType;
	officeLocation: string;
	notes: string;
}

export type SubmissionStatus = "idle" | "pending" | "success" | "error";

export interface SubmissionProgress {
	step: "basicInfo" | "details";
	status: SubmissionStatus;
	message?: string;
}

export interface WizardState {
	currentStep: 1 | 2;
	basicInfo: Partial<BasicInfo>;
	details: Partial<Details>;
	isSubmitting: boolean;
	submitProgress: SubmissionProgress[];
	error: string | null;
}

export interface ValidationErrors {
	[key: string]: string | undefined;
}

export type WizardStep = 1 | 2;

export interface AutocompleteItem {
	id: number;
	name: string;
}

export interface Department {
	id: number;
	name: string;
}

export interface BasicInfo {
	fullName: string;
	email: string;
	department: string;
	employeeId: string;
	role: string;
}

export interface BasicInfoWithId extends BasicInfo {
	id: number;
}

export interface DetailsEmployee {
	id: string;
	location: string;
	photo: string;
	photoFilename: string;
	employmentType: string;
	officeLocation: string;
	notes: string;
	basicInfoId: number;
}

export interface MergedEmployee extends BasicInfoWithId {
	location?: string;
	photo?: string;
}

export interface BasicInfoApiResponse {
	departments: Department[];
	basicInfo: BasicInfoWithId[];
}

export interface DetailsApiResponse {
	details: Details[];
}
