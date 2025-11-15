/* eslint-disable react-hooks/exhaustive-deps */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
import { useEffect, useRef } from "react";
import type { AutocompleteItem } from "@/libs";
import { useAutocomplete } from "@/utils/hooks";
import "./Autocomplete.css";

interface Props<T extends AutocompleteItem> {
	label: string;
	value?: string;
	placeholder?: string;
	fetchSuggestions: (query: string) => Promise<T[]>;
	onSelect: (item: T) => void;
	required?: boolean;
}

/**
 * AutoComplete input component with dynamic suggestion list, keyboard navigation,
 * click-outside handling, and full accessibility support.
 *
 * This component can accept any list of items (e.g. Departments or Locations),
 * and allows users to filter, navigate, and select items easily.
 *
 * @example
 * ```tsx
 * <AutoComplete
 *   label="Department"
 *   items={[
 *     { id: 1, name: "Lending" },
 *     { id: 2, name: "Funding" },
 *     { id: 3, name: "Operations" },
 *     { id: 4, name: "Engineering" }
 *   ]}
 *   placeholder="Select department"
 *   onSelect={(item) => console.log(item)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <AutoComplete
 *   label="Location"
 *   items={[
 *     { id: 1, name: "Jakarta" },
 *     { id: 2, name: "Depok" },
 *     { id: 3, name: "Surabaya" },
 *   ]}
 *   placeholder="Select city"
 *   onSelect={(item) => console.log(item)}
 * />
 * ```
 *
 * @param {string} label - Label text shown above the input.
 * @param {{ id: number; name: string }[]} items - Array of selectable items.
 * @param {(item: { id: number; name: string }) => void} onSelect - Callback fired when a user selects an item.
 * @param {string} [placeholder] - Placeholder text displayed in the input field.
 * @param {string} [value] - Controlled input value (optional).
 * @param {boolean} [disabled] - Disable the autocomplete input.
 */

export function AutocompleteField<T extends AutocompleteItem>({
	label,
	value = "",
	placeholder = "",
	fetchSuggestions,
	onSelect,
	required = false,
}: Props<T>) {
	const wrapperRef = useRef<HTMLDivElement>(null);

	const {
		input,
		setInput,
		suggestions,
		isOpen,
		isLoading,
		error,
		highlightIndex,
		setHighlightIndex,
		search,
		reset,
	} = useAutocomplete(fetchSuggestions);

	useEffect(() => {
		setInput(value);
	}, [value]);

	useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(e.target as Node)
			) {
				reset();
			}
		}
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, []);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (!isOpen) return;

		if (e.key === "ArrowDown") {
			e.preventDefault();
			setHighlightIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
		}
		if (e.key === "ArrowUp") {
			e.preventDefault();
			setHighlightIndex((prev) => Math.max(prev - 1, 0));
		}
		if (e.key === "Enter" && highlightIndex >= 0) {
			e.preventDefault();
			const item = suggestions[highlightIndex];
			onSelect(item);
			setInput(item.name);
			reset();
		}
	};

	return (
		<div className="autocomplete-form-group">
			<label htmlFor="autocomplete" className="autocomplete-label">
				{label} {required && <span className="text-red-500">*</span>}
			</label>

			<div className="autocomplete-wrapper" ref={wrapperRef}>
				<input
					id="autocomplete"
					type="text"
					value={input}
					placeholder={placeholder}
					onKeyDown={handleKeyDown}
					onChange={(e) => search(e.target.value)}
					onFocus={() => suggestions.length > 0 && search(input)}
					className="autocomplete-input input-field input-field--md input-field--default"
				/>

				{isLoading && <div className="autocomplete-loading">Loading...</div>}
				{error && <div className="autocomplete-error">{error}</div>}

				{isOpen && suggestions.length > 0 && (
					<div className="autocomplete-dropdown">
						{suggestions.map((item) => (
							<p
								key={item.id}
								className={`autocomplete-item`}
								onClick={() => {
									onSelect(item);
									setInput(item.name);
									reset();
								}}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										onSelect(item);
										setInput(item.name);
										reset();
									}
								}}
							>
								{item.name}
							</p>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
