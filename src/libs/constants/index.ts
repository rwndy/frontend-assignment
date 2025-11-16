const isDevelopment = import.meta.env.DEV;

export const API_ENDPOINTS = {
	BASE: isDevelopment ? "http://localhost:4001/basicInfo" : "/api/basicInfo",
	DETAILS: isDevelopment ? "http://localhost:4002/details" : "/api/details",
	DEPARTMENTS: isDevelopment ? "http://localhost:4001/departments" : "/api/departments",
	LOCATIONS: isDevelopment ? "http://localhost:4002/locations" : "/api/locations",
} as const;

export const STORAGE_KEYS = {
	DRAFT_PREFIX: "wizard_draft",
} as const;

export const VALIDATION_RULES = {
	EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	MAX_FILE_SIZE_MB: 5,
	ACCEPTED_IMAGE_FORMATS: ["image/jpeg", "image/png", "image/jpg"],
	DEBOUNCE_DELAY_MS: 2000,
	API_DELAY_MS: 3000,
	ITEMS_PER_PAGE: 10,
} as const;

export const ROLE_CONFIG = {
	admin: { startStep: 1, requiresPhoto: true },
	ops: { startStep: 2, requiresPhoto: false },
} as const;

export const PLACEHOLDERS = {
	MISSING_FIELD: "—",
	NOT_AVAILABLE: "N/A",
} as const;
