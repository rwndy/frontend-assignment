import { useRef, useState } from "react";
import type { AutocompleteItem } from "@/libs";

export function useAutocomplete<T extends AutocompleteItem>(
	fetchSuggestions: (query: string) => Promise<T[]>,
) {
	const [input, setInput] = useState("");
	const [suggestions, setSuggestions] = useState<T[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [highlightIndex, setHighlightIndex] = useState(-1);

	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const search = (value: string) => {
		if (debounceRef.current) clearTimeout(debounceRef.current);

		setInput(value);

		if (!value.trim()) {
			setSuggestions([]);
			setIsOpen(false);
			return;
		}

		setIsLoading(true);

		debounceRef.current = setTimeout(async () => {
			try {
				const results = await fetchSuggestions(value);
				setSuggestions(results);
				setIsOpen(true);
				setError(null);
			} catch (err) {
				console.error(err);
				setError("Failed to load suggestions");
			} finally {
				setIsLoading(false);
			}
		}, 300);
	};

	const reset = () => {
		setSuggestions([]);
		setIsOpen(false);
		setHighlightIndex(-1);
	};

	return {
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
	};
}
