/** biome-ignore-all assist/source/organizeImports: <explanation> */
import { useEffect, useRef, useCallback } from "react";
import { STORAGE_KEYS, VALIDATION_RULES } from "@/libs/constants";
import type { UserRole, WizardState } from "@/libs/types";

interface DraftData {
	basicInfo: WizardState["basicInfo"];
	details: WizardState["details"];
	currentStep: WizardState["currentStep"];
	timestamp: number;
}

const MAX_DRAFT_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export function useDraftPersistence(
	role: UserRole,
	state: WizardState,
	updateState: (updates: Partial<WizardState>) => void,
) {
	const timeoutRef = useRef<ReturnType<typeof setTimeout>>(0);
	const storageKey = `${STORAGE_KEYS.DRAFT_PREFIX}_${role}`;
	const isInitialMount = useRef(true);

	useEffect(() => {
		if (isInitialMount.current) {
			return;
		}

		if (timeoutRef.current !== undefined) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			try {
				const draftData: DraftData = {
					basicInfo: state.basicInfo,
					details: state.details,
					currentStep: state.currentStep,
					timestamp: Date.now(),
				};
				localStorage.setItem(storageKey, JSON.stringify(draftData));
			} catch (error) {
				console.error("Failed to save draft:", error);
			}
		}, VALIDATION_RULES.DEBOUNCE_DELAY_MS);

		return () => {
			if (timeoutRef.current !== undefined) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [state.basicInfo, state.details, state.currentStep, storageKey]);

	// Restore draft on mount
	useEffect(() => {
		if (!isInitialMount.current) return;

		try {
			const savedDraft = localStorage.getItem(storageKey);
			if (savedDraft) {
				const parsed = JSON.parse(savedDraft) as DraftData;

				const isStale = Date.now() - parsed.timestamp > MAX_DRAFT_AGE_MS;

				if (!isStale) {
					updateState({
						basicInfo: parsed.basicInfo || {},
						details: parsed.details || {},
						currentStep: parsed.currentStep,
					});
				} else {
					localStorage.removeItem(storageKey);
				}
			}
		} catch (error) {
			console.error("Failed to restore draft:", error);
		} finally {
			isInitialMount.current = false;
		}
	}, [storageKey, updateState]);

	const clearDraft = useCallback(() => {
		try {
			localStorage.removeItem(storageKey);
		} catch (error) {
			console.error("Failed to clear draft:", error);
		}
	}, [storageKey]);

	const hasDraft = useCallback((): boolean => {
		try {
			return localStorage.getItem(storageKey) !== null;
		} catch {
			return false;
		}
	}, [storageKey]);

	return { clearDraft, hasDraft };
}
