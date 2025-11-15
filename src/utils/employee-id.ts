/**
 * Generates an employee ID based on department name and sequence
 * Format: <3-letter department prefix>-<3-digit sequence>
 * Example: ENG-003, LEN-001
 */

export function generateEmployeeId(
	departmentName: string,
	existingCount: number,
): string {
	const prefix = departmentName.substring(0, 3).toUpperCase().padEnd(3, "X");

	const sequence = String(existingCount + 1).padStart(3, "0");

	return `${prefix}-${sequence}`;
}

export function isValidEmployeeId(id: string): boolean {
	return /^[A-Z]{3}-\d{3}$/.test(id);
}
