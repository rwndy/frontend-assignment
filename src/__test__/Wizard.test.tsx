import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Wizard } from "@/pages/Wizard";
import { wizardService } from "@/services/wizard.service";

// Mock the services
vi.mock("@/services/wizard.service");
vi.mock("@/libs/api");

describe("Wizard - Submit Flow with Sequential POST", () => {
	const mockDepartments = [
		{ id: 1, name: "Engineering" },
		{ id: 2, name: "Finance" },
		{ id: 3, name: "Lending" },
		{ id: 4, name: "Operations" },
	];

	const mockLocations = [
		{ id: 1, name: "Jakarta" },
		{ id: 2, name: "New York" },
		{ id: 3, name: "Singapore" },
	];

	beforeEach(() => {
		vi.clearAllMocks();

		vi.mocked(wizardService.getDepartments).mockResolvedValue(mockDepartments);
		vi.mocked(wizardService.getLocations).mockResolvedValue(mockLocations);
		vi.mocked(wizardService.searchDepartments).mockImplementation(
			async (query) => {
				if (!query) return mockDepartments;
				return mockDepartments.filter((d) =>
					d.name.toLowerCase().includes(query.toLowerCase()),
				);
			},
		);
		vi.mocked(wizardService.searchLocations).mockImplementation(
			async (query) => {
				if (!query) return mockLocations;
				return mockLocations.filter((l) =>
					l.name.toLowerCase().includes(query.toLowerCase()),
				);
			},
		);

		vi.mocked(wizardService.submitBasicInfo).mockResolvedValue({ id: "123" });
		vi.mocked(wizardService.submitDetails).mockResolvedValue();
	});

	describe("Sequential POST Flow", () => {
		it("should handle sequential POST to both APIs with progress states", async () => {
			const user = userEvent.setup();

			render(<Wizard />);

			await waitFor(() => {
				expect(wizardService.getDepartments).toHaveBeenCalled();
			});

			const adminButton = screen.getByText("Admin");
			expect(adminButton).toHaveClass("primary");

			const fullNameInput = screen.getByLabelText(/Full Name/i);
			await user.type(fullNameInput, "John Doe");

			const emailInput = screen.getByLabelText(/Email/i);
			await user.type(emailInput, "john.doe@example.com");

			const departmentInput = screen.getByPlaceholderText(/Search department/i);
			await user.type(departmentInput, "Engineering");

			await waitFor(() => {
				expect(screen.getByText("Engineering")).toBeInTheDocument();
			});

			fireEvent.click(screen.getByText("Engineering"));

			await waitFor(() => {
				const employeeIdInput = screen.getByLabelText(
					/Employee ID/i,
				) as HTMLInputElement;
				expect(employeeIdInput.value).toMatch(/^ENG-\d{3}$/);
			});

			const roleSelect = screen.getByLabelText(/Role/i);
			await user.selectOptions(roleSelect, "Engineer");

			const nextButton = screen.getByText("Next");
			expect(nextButton).not.toBeDisabled();
			fireEvent.click(nextButton);

			await waitFor(() => {
				expect(wizardService.getLocations).toHaveBeenCalled();
			});

			const photoInput = screen.getByLabelText(/Photo/i);
			const file = new File(["photo"], "photo.jpg", { type: "image/jpeg" });
			await user.upload(photoInput, file);

			await waitFor(() => {
				expect(screen.getByAltText(/preview/i)).toBeInTheDocument();
			});

			const employmentTypeSelect = screen.getByLabelText(/Employment Type/i);
			await user.selectOptions(employmentTypeSelect, "Full-time");

			const locationInput = screen.getByPlaceholderText(/Search location/i);
			await user.type(locationInput, "Jakarta");

			await waitFor(() => {
				expect(screen.getByText("Jakarta")).toBeInTheDocument();
			});

			fireEvent.click(screen.getByText("Jakarta"));

			const notesTextarea = screen.getByLabelText(/Notes/i);
			await user.type(notesTextarea, "New employee onboarding");

			const submitButton = screen.getByText("Submit");
			expect(submitButton).not.toBeDisabled();
			fireEvent.click(submitButton);

			await waitFor(() => {
				expect(screen.getByText("Submitting...")).toBeInTheDocument();
			});

			expect(submitButton).toBeDisabled();

			await waitFor(() => {
				expect(wizardService.submitBasicInfo).toHaveBeenCalledWith(
					expect.objectContaining({
						fullName: "John Doe",
						email: "john.doe@example.com",
						department: "Engineering",
						role: "Engineer",
						employeeId: expect.stringMatching(/^ENG-\d{3}$/),
					}),
				);
			});

			await waitFor(() => {
				expect(wizardService.submitDetails).toHaveBeenCalledWith(
					expect.objectContaining({
						basicInfoId: "123", // ID from first POST
						photo: expect.stringContaining("data:image"), // Base64
						photoFilename: "photo.jpg",
						employmentType: "Full-time",
						officeLocation: "Jakarta",
						notes: "New employee onboarding",
					}),
				);
			});

			await waitFor(() => {
				expect(screen.queryByText("Submitting...")).not.toBeInTheDocument();
			});
		});

		it("should show progress indicator during submission", async () => {
			const user = userEvent.setup();

			vi.mocked(wizardService.submitBasicInfo).mockImplementation(
				() =>
					new Promise((resolve) =>
						setTimeout(() => resolve({ id: "123" }), 500),
					),
			);
			vi.mocked(wizardService.submitDetails).mockImplementation(
				() => new Promise((resolve) => setTimeout(resolve, 500)),
			);

			render(<Wizard />);

			await waitFor(() => {
				expect(wizardService.getDepartments).toHaveBeenCalled();
			});

			await fillBasicInfo(user);
			fireEvent.click(screen.getByText("Next"));

			await waitFor(() => {
				expect(wizardService.getLocations).toHaveBeenCalled();
			});

			await fillDetails(user);

			fireEvent.click(screen.getByText("Submit"));

			expect(await screen.findByText("Submitting...")).toBeInTheDocument();

			await waitFor(
				() => {
					expect(wizardService.submitBasicInfo).toHaveBeenCalled();
					expect(wizardService.submitDetails).toHaveBeenCalled();
				},
				{ timeout: 2000 },
			);
		});

		it("should handle error in first POST (basicInfo)", async () => {
			const user = userEvent.setup();

			vi.mocked(wizardService.submitBasicInfo).mockRejectedValue(
				new Error("Failed to submit basic info"),
			);

			render(<Wizard />);

			await waitFor(() => {
				expect(wizardService.getDepartments).toHaveBeenCalled();
			});

			await fillBasicInfo(user);
			fireEvent.click(screen.getByText("Next"));

			await waitFor(() => {
				expect(wizardService.getLocations).toHaveBeenCalled();
			});

			await fillDetails(user);

			fireEvent.click(screen.getByText("Submit"));

			await waitFor(() => {
				expect(
					screen.getByText(/Failed to submit basic info/i),
				).toBeInTheDocument();
			});
			expect(wizardService.submitDetails).not.toHaveBeenCalled();

			expect(screen.getByText("Submit")).not.toBeDisabled();
		});

		it("should handle error in second POST (details)", async () => {
			const user = userEvent.setup();

			vi.mocked(wizardService.submitBasicInfo).mockResolvedValue({ id: "123" });
			vi.mocked(wizardService.submitDetails).mockRejectedValue(
				new Error("Failed to submit details"),
			);

			render(<Wizard />);

			await waitFor(() => {
				expect(wizardService.getDepartments).toHaveBeenCalled();
			});

			await fillBasicInfo(user);
			fireEvent.click(screen.getByText("Next"));

			await waitFor(() => {
				expect(wizardService.getLocations).toHaveBeenCalled();
			});

			await fillDetails(user);

			// Submit
			fireEvent.click(screen.getByText("Submit"));

			await waitFor(() => {
				expect(wizardService.submitBasicInfo).toHaveBeenCalled();
			});
			await waitFor(() => {
				expect(
					screen.getByText(/Failed to submit details/i),
				).toBeInTheDocument();
			});
		});

		it("should maintain form data when going back from Step 2 to Step 1", async () => {
			const user = userEvent.setup();

			render(<Wizard />);

			await waitFor(() => {
				expect(wizardService.getDepartments).toHaveBeenCalled();
			});

			await user.type(screen.getByLabelText(/Full Name/i), "Jane Smith");
			await user.type(screen.getByLabelText(/Email/i), "jane@example.com");

			const departmentInput = screen.getByPlaceholderText(/Search department/i);
			await user.type(departmentInput, "Finance");
			await waitFor(() => {
				expect(screen.getByText("Finance")).toBeInTheDocument();
			});
			fireEvent.click(screen.getByText("Finance"));

			const roleSelect = screen.getByLabelText(/Role/i);
			await user.selectOptions(roleSelect, "Admin");

			fireEvent.click(screen.getByText("Next"));

			await waitFor(() => {
				expect(wizardService.getLocations).toHaveBeenCalled();
			});

			fireEvent.click(screen.getByText("Back"));

			await waitFor(() => {
				expect(screen.getByDisplayValue("Jane Smith")).toBeInTheDocument();
				expect(
					screen.getByDisplayValue("jane@example.com"),
				).toBeInTheDocument();
				expect(screen.getByDisplayValue("Finance")).toBeInTheDocument();
			});
		});
	});

	describe("Validation", () => {
		it("should disable Next button when Step 1 is incomplete", async () => {
			render(<Wizard />);

			await waitFor(() => {
				expect(wizardService.getDepartments).toHaveBeenCalled();
			});

			const nextButton = screen.getByText("Next");

			expect(nextButton).toBeDisabled();

			await userEvent.type(screen.getByLabelText(/Full Name/i), "John");

			expect(nextButton).toBeDisabled();
		});

		it("should enable Next button when all required fields are filled", async () => {
			const user = userEvent.setup();

			render(<Wizard />);

			await waitFor(() => {
				expect(wizardService.getDepartments).toHaveBeenCalled();
			});

			await fillBasicInfo(user);

			const nextButton = screen.getByText("Next");
			expect(nextButton).not.toBeDisabled();
		});

		it("should disable Submit button when Step 2 is incomplete", async () => {
			const user = userEvent.setup();

			render(<Wizard />);

			await waitFor(() => {
				expect(wizardService.getDepartments).toHaveBeenCalled();
			});

			await fillBasicInfo(user);
			fireEvent.click(screen.getByText("Next"));

			await waitFor(() => {
				expect(wizardService.getLocations).toHaveBeenCalled();
			});

			const submitButton = screen.getByText("Submit");

			expect(submitButton).toBeDisabled();
		});
	});

	describe("Auto-generation", () => {
		it("should auto-generate Employee ID when department is selected", async () => {
			const user = userEvent.setup();

			render(<Wizard />);

			await waitFor(() => {
				expect(wizardService.getDepartments).toHaveBeenCalled();
			});

			const departmentInput = screen.getByPlaceholderText(/Search department/i);
			await user.type(departmentInput, "Engineering");

			await waitFor(() => {
				expect(screen.getByText("Engineering")).toBeInTheDocument();
			});

			fireEvent.click(screen.getByText("Engineering"));

			await waitFor(() => {
				const employeeIdInput = screen.getByLabelText(
					/Employee ID/i,
				) as HTMLInputElement;
				expect(employeeIdInput.value).toMatch(/^ENG-\d{3}$/);
				expect(employeeIdInput).toBeDisabled();
			});
		});

		it("should update Employee ID when department changes", async () => {
			const user = userEvent.setup();

			render(<Wizard />);

			await waitFor(() => {
				expect(wizardService.getDepartments).toHaveBeenCalled();
			});

			const departmentInput = screen.getByPlaceholderText(/Search department/i);
			await user.type(departmentInput, "Engineering");
			await waitFor(() => screen.getByText("Engineering"));
			fireEvent.click(screen.getByText("Engineering"));

			const employeeIdInput = screen.getByLabelText(
				/Employee ID/i,
			) as HTMLInputElement;
			const firstId = employeeIdInput.value;
			expect(firstId).toMatch(/^ENG-\d{3}$/);

			await user.clear(departmentInput);
			await user.type(departmentInput, "Finance");
			await waitFor(() => screen.getByText("Finance"));
			fireEvent.click(screen.getByText("Finance"));

			await waitFor(() => {
				expect(employeeIdInput.value).toMatch(/^FIN-\d{3}$/);
			});
		});
	});
});

async function fillBasicInfo(user: ReturnType<typeof userEvent.setup>) {
	await user.type(screen.getByLabelText(/Full Name/i), "Test User");
	await user.type(screen.getByLabelText(/Email/i), "test@example.com");

	const departmentInput = screen.getByPlaceholderText(/Search department/i);
	await user.type(departmentInput, "Engineering");
	await waitFor(() => screen.getByText("Engineering"));
	fireEvent.click(screen.getByText("Engineering"));

	const roleSelect = screen.getByLabelText(/Role/i);
	await user.selectOptions(roleSelect, "Engineer");
}

async function fillDetails(user: ReturnType<typeof userEvent.setup>) {
	const photoInput = screen.getByLabelText(/Photo/i);
	const file = new File(["photo"], "test.jpg", { type: "image/jpeg" });
	await user.upload(photoInput, file);

	const employmentTypeSelect = screen.getByLabelText(/Employment Type/i);
	await user.selectOptions(employmentTypeSelect, "Full-time");

	const locationInput = screen.getByPlaceholderText(/Search location/i);
	await user.type(locationInput, "Jakarta");
	await waitFor(() => screen.getByText("Jakarta"));
	fireEvent.click(screen.getByText("Jakarta"));

	await user.type(screen.getByLabelText(/Notes/i), "Test notes");
}
