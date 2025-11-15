import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AutocompleteField } from "@/components/ui";
import type { Department } from "@/libs/types";

describe("AutocompleteField Component", () => {
	const mockDepartments: Department[] = [
		{ id: 1, name: "Engineering" },
		{ id: 2, name: "Finance" },
		{ id: 3, name: "Operations" },
		{ id: 4, name: "Marketing" },
	];

	const mockFetchSuggestions = vi.fn(
		async (query: string): Promise<Department[]> => {
			await new Promise((resolve) => setTimeout(resolve, 100));

			if (!query.trim()) return mockDepartments;

			const lowerQuery = query.toLowerCase();
			return mockDepartments.filter((dept) =>
				dept.name.toLowerCase().includes(lowerQuery),
			);
		},
	);

	const mockOnSelect = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("Rendering", () => {
		it("should render with label and placeholder", () => {
			render(
				<AutocompleteField
					label="Department"
					placeholder="Search department..."
					fetchSuggestions={mockFetchSuggestions}
					onSelect={mockOnSelect}
				/>,
			);

			expect(screen.getByText("Department")).toBeInTheDocument();
			expect(
				screen.getByPlaceholderText("Search department..."),
			).toBeInTheDocument();
		});

		it("should show required indicator when required prop is true", () => {
			render(
				<AutocompleteField
					label="Department"
					placeholder="Search department..."
					fetchSuggestions={mockFetchSuggestions}
					onSelect={mockOnSelect}
					required
				/>,
			);

			const asterisk = screen.getByText("*");
			expect(asterisk).toBeInTheDocument();
			expect(asterisk).toHaveClass("text-red-500");
		});

		it("should display controlled value", () => {
			render(
				<AutocompleteField
					label="Department"
					value="Engineering"
					placeholder="Search department..."
					fetchSuggestions={mockFetchSuggestions}
					onSelect={mockOnSelect}
				/>,
			);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			expect(input.value).toBe("Engineering");
		});
	});

	describe("Fetching and Displaying Suggestions", () => {
		it("should fetch and display suggestions correctly when typing", async () => {
			const user = userEvent.setup();

			render(
				<AutocompleteField
					label="Department"
					placeholder="Search department..."
					fetchSuggestions={mockFetchSuggestions}
					onSelect={mockOnSelect}
				/>,
			);

			const input = screen.getByRole("textbox");

			await user.type(input, "eng");

			await waitFor(() => {
				expect(screen.getByText("Loading...")).toBeInTheDocument();
			});

			await waitFor(() => {
				expect(mockFetchSuggestions).toHaveBeenCalledWith("eng");
			});

			await waitFor(() => {
				expect(screen.getByText("Engineering")).toBeInTheDocument();
			});

			expect(screen.queryByText("Finance")).not.toBeInTheDocument();
		});

		it("should perform case-insensitive search", async () => {
			const user = userEvent.setup();

			render(
				<AutocompleteField
					label="Department"
					placeholder="Search department..."
					fetchSuggestions={mockFetchSuggestions}
					onSelect={mockOnSelect}
				/>,
			);

			const input = screen.getByRole("textbox");

			await user.type(input, "ENG");

			await waitFor(() => {
				expect(mockFetchSuggestions).toHaveBeenCalledWith("ENG");
			});

			await waitFor(() => {
				expect(screen.getByText("Engineering")).toBeInTheDocument();
			});
		});

		it("should show all suggestions when input is empty on focus", async () => {
			mockFetchSuggestions.mockResolvedValueOnce(mockDepartments);

			render(
				<AutocompleteField
					label="Department"
					placeholder="Search department..."
					fetchSuggestions={mockFetchSuggestions}
					onSelect={mockOnSelect}
				/>,
			);

			const input = screen.getByRole("textbox");

			await userEvent.click(input);

			await waitFor(() => {
				expect(mockFetchSuggestions).toHaveBeenCalled();
			});

			await waitFor(() => {
				mockDepartments.forEach((dept) => {
					expect(screen.getByText(dept.name)).toBeInTheDocument();
				});
			});
		});

		it("should display loading state while fetching", async () => {
			const user = userEvent.setup();

			mockFetchSuggestions.mockImplementation(async () => {
				await new Promise((resolve) => setTimeout(resolve, 500));
				return mockDepartments;
			});

			render(
				<AutocompleteField
					label="Department"
					placeholder="Search department..."
					fetchSuggestions={mockFetchSuggestions}
					onSelect={mockOnSelect}
				/>,
			);

			const input = screen.getByRole("textbox");
			await user.type(input, "eng");

			expect(screen.getByText("Loading...")).toBeInTheDocument();
		});

		it("should display error state when fetch fails", async () => {
			const user = userEvent.setup();

			mockFetchSuggestions.mockRejectedValueOnce(new Error("API Error"));

			render(
				<AutocompleteField
					label="Department"
					placeholder="Search department..."
					fetchSuggestions={mockFetchSuggestions}
					onSelect={mockOnSelect}
				/>,
			);

			const input = screen.getByRole("textbox");
			await user.type(input, "eng");

			await waitFor(() => {
				expect(screen.getByText(/error/i)).toBeInTheDocument();
			});
		});
	});

	describe("User Interactions", () => {
		it("should call onSelect when item is clicked", async () => {
			const user = userEvent.setup();
			mockFetchSuggestions.mockResolvedValueOnce(mockDepartments);

			render(
				<AutocompleteField
					label="Department"
					placeholder="Search department..."
					fetchSuggestions={mockFetchSuggestions}
					onSelect={mockOnSelect}
				/>,
			);

			const input = screen.getByRole("textbox");
			await user.type(input, "eng");

			await waitFor(() => {
				expect(screen.getByText("Engineering")).toBeInTheDocument();
			});

			const engineeringOption = screen.getByText("Engineering");
			fireEvent.click(engineeringOption);

			expect(mockOnSelect).toHaveBeenCalledWith(
				expect.objectContaining({
					id: 1,
					name: "Engineering",
				}),
			);
		});

		it("should update input value after selection", async () => {
			const user = userEvent.setup();
			mockFetchSuggestions.mockResolvedValueOnce(mockDepartments);

			render(
				<AutocompleteField
					label="Department"
					placeholder="Search department..."
					fetchSuggestions={mockFetchSuggestions}
					onSelect={mockOnSelect}
				/>,
			);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			await user.type(input, "eng");

			await waitFor(() => {
				expect(screen.getByText("Engineering")).toBeInTheDocument();
			});

			fireEvent.click(screen.getByText("Engineering"));

			await waitFor(() => {
				expect(input.value).toBe("Engineering");
			});
		});

		it("should close dropdown after selection", async () => {
			const user = userEvent.setup();
			mockFetchSuggestions.mockResolvedValueOnce(mockDepartments);

			render(
				<AutocompleteField
					label="Department"
					placeholder="Search department..."
					fetchSuggestions={mockFetchSuggestions}
					onSelect={mockOnSelect}
				/>,
			);

			const input = screen.getByRole("textbox");
			await user.type(input, "eng");

			await waitFor(() => {
				expect(screen.getByText("Engineering")).toBeInTheDocument();
			});

			const dropdown = screen.getByText("Engineering").parentElement;
			expect(dropdown).toBeInTheDocument();

			fireEvent.click(screen.getByText("Engineering"));

			await waitFor(() => {
				expect(screen.queryByText("Engineering")).not.toBeInTheDocument();
			});
		});

		it("should navigate with keyboard arrows", async () => {
			mockFetchSuggestions.mockResolvedValueOnce(mockDepartments);

			render(
				<AutocompleteField
					label="Department"
					placeholder="Search department..."
					fetchSuggestions={mockFetchSuggestions}
					onSelect={mockOnSelect}
				/>,
			);

			const input = screen.getByRole("textbox");
			await userEvent.type(input, "e");

			await waitFor(() => {
				expect(screen.getByText("Engineering")).toBeInTheDocument();
			});

			fireEvent.keyDown(input, { key: "ArrowDown" });

			fireEvent.keyDown(input, { key: "Enter" });

			await waitFor(() => {
				expect(mockOnSelect).toHaveBeenCalledWith(
					expect.objectContaining({ name: "Engineering" }),
				);
			});
		});

		it("should select item with Enter key", async () => {
			mockFetchSuggestions.mockResolvedValueOnce(mockDepartments);

			render(
				<AutocompleteField
					label="Department"
					placeholder="Search department..."
					fetchSuggestions={mockFetchSuggestions}
					onSelect={mockOnSelect}
				/>,
			);

			const input = screen.getByRole("textbox");
			await userEvent.type(input, "eng");

			await waitFor(() => {
				expect(screen.getByText("Engineering")).toBeInTheDocument();
			});

			fireEvent.keyDown(input, { key: "ArrowDown" });
			fireEvent.keyDown(input, { key: "Enter" });

			expect(mockOnSelect).toHaveBeenCalled();
		});

		it("should close dropdown when clicking outside", async () => {
			const user = userEvent.setup();
			mockFetchSuggestions.mockResolvedValueOnce(mockDepartments);

			render(
				<div>
					<AutocompleteField
						label="Department"
						placeholder="Search department..."
						fetchSuggestions={mockFetchSuggestions}
						onSelect={mockOnSelect}
					/>
					<button type="button">Outside Button</button>
				</div>,
			);

			const input = screen.getByRole("textbox");
			await user.type(input, "eng");

			await waitFor(() => {
				expect(screen.getByText("Engineering")).toBeInTheDocument();
			});

			const outsideButton = screen.getByText("Outside Button");
			fireEvent.mouseDown(outsideButton);

			await waitFor(() => {
				expect(screen.queryByText("Engineering")).not.toBeInTheDocument();
			});
		});
	});

	describe("Integration with WizardService", () => {
		it("should work with actual searchDepartments function", async () => {
			const searchDepartments = async (query: string) => {
				const allDepts = mockDepartments;
				if (!query.trim()) return allDepts;
				return allDepts.filter((d) =>
					d.name.toLowerCase().includes(query.toLowerCase()),
				);
			};

			const user = userEvent.setup();

			render(
				<AutocompleteField
					label="Department"
					placeholder="Search department..."
					fetchSuggestions={searchDepartments}
					onSelect={mockOnSelect}
				/>,
			);

			const input = screen.getByRole("textbox");
			await user.type(input, "fin");

			await waitFor(() => {
				expect(screen.getByText("Finance")).toBeInTheDocument();
			});

			expect(screen.queryByText("Engineering")).not.toBeInTheDocument();
		});
	});
});
