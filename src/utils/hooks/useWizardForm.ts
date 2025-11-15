import { useCallback, useEffect, useMemo, useReducer } from "react";
import { ROLE_CONFIG } from "@/libs/constants";
import type {
	BasicInfo,
	Department,
	Details,
	SubmissionProgress,
	UserRole,
	WizardState,
} from "@/libs/types";
import { wizardService } from "@/services/wizard.service";
import {
	generateEmployeeId,
	hasErrors,
	validateBasicInfo,
	validateDetails,
} from "@/utils";

type Action =
	| { type: "SET_STEP"; payload: WizardState["currentStep"] }
	| { type: "UPDATE_BASIC_INFO"; payload: Partial<BasicInfo> }
	| { type: "UPDATE_DETAILS"; payload: Partial<Details> }
	| { type: "SET_EMPLOYEE_ID"; payload: string }
	| { type: "START_SUBMISSION" }
	| { type: "UPDATE_PROGRESS"; payload: SubmissionProgress[] }
	| { type: "SUBMISSION_SUCCESS" }
	| { type: "SUBMISSION_ERROR"; payload: string }
	| { type: "RESET_FORM"; payload: { step: WizardState["currentStep"] } }
	| { type: "RESTORE_STATE"; payload: Partial<WizardState> };

function wizardReducer(state: WizardState, action: Action): WizardState {
	switch (action.type) {
		case "SET_STEP":
			return { ...state, currentStep: action.payload };

		case "UPDATE_BASIC_INFO":
			return {
				...state,
				basicInfo: { ...state.basicInfo, ...action.payload },
			};

		case "UPDATE_DETAILS":
			return {
				...state,
				details: { ...state.details, ...action.payload },
			};

		case "SET_EMPLOYEE_ID":
			return {
				...state,
				basicInfo: { ...state.basicInfo, employeeId: action.payload },
			};

		case "START_SUBMISSION":
			return {
				...state,
				isSubmitting: true,
				submitProgress: [
					{ step: "basicInfo", status: "pending" },
					{ step: "details", status: "pending" },
				],
				error: null,
			};

		case "UPDATE_PROGRESS":
			return {
				...state,
				submitProgress: action.payload,
			};

		case "SUBMISSION_SUCCESS":
			return {
				...state,
				isSubmitting: false,
			};

		case "SUBMISSION_ERROR":
			return {
				...state,
				isSubmitting: false,
				error: action.payload,
				submitProgress: state.submitProgress.map((item) =>
					item.status === "pending"
						? { ...item, status: "error" as const }
						: item,
				),
			};

		case "RESET_FORM":
			return {
				currentStep: action.payload.step,
				basicInfo: {},
				details: {},
				isSubmitting: false,
				submitProgress: [],
				error: null,
			};

		case "RESTORE_STATE":
			return { ...state, ...action.payload };

		default:
			return state;
	}
}

interface UseWizardFormOptions {
	role: UserRole;
	departments: Department[];
	onSuccess?: () => void;
	onNavigate?: (path: string) => void;
}

export function useWizardForm({
	role,
	departments,
	onSuccess,
	onNavigate,
}: UseWizardFormOptions) {
	const initialStep = ROLE_CONFIG[role].startStep as WizardState["currentStep"];

	const [state, dispatch] = useReducer(wizardReducer, {
		currentStep: initialStep,
		basicInfo: {},
		details: {},
		isSubmitting: false,
		submitProgress: [],
		error: null,
	});

	useEffect(() => {
		if (state.basicInfo.department && role === "admin") {
			const dept = departments.find(
				(d) => d.name === state.basicInfo.department,
			);
			if (dept) {
				const employeeId = generateEmployeeId(dept.name, 0);
				dispatch({ type: "SET_EMPLOYEE_ID", payload: employeeId });
			}
		}
	}, [state.basicInfo.department, departments, role]);

	const validationErrors = useMemo(() => {
		if (state.currentStep === 1) {
			return validateBasicInfo(state.basicInfo);
		}
		return validateDetails(state.details, role);
	}, [state.currentStep, state.basicInfo, state.details, role]);

	const isStepValid = useMemo(
		() => !hasErrors(validationErrors),
		[validationErrors],
	);

	const updateBasicInfo = useCallback(
		(field: keyof BasicInfo, value: string) => {
			dispatch({ type: "UPDATE_BASIC_INFO", payload: { [field]: value } });
		},
		[],
	);

	const updateDetails = useCallback((field: keyof Details, value: string) => {
		dispatch({ type: "UPDATE_DETAILS", payload: { [field]: value } });
	}, []);

	const goToNextStep = useCallback(() => {
		if (state.currentStep === 1) {
			dispatch({ type: "SET_STEP", payload: 2 });
		}
	}, [state.currentStep]);

	const goToPreviousStep = useCallback(() => {
		if (state.currentStep === 2 && role === "admin") {
			dispatch({ type: "SET_STEP", payload: 1 });
		}
	}, [state.currentStep, role]);

	const resetForm = useCallback(() => {
		dispatch({ type: "RESET_FORM", payload: { step: initialStep } });
	}, [initialStep]);

	const restoreState = useCallback((partialState: Partial<WizardState>) => {
		dispatch({ type: "RESTORE_STATE", payload: partialState });
	}, []);

	const submitForm = useCallback(async () => {
		dispatch({ type: "START_SUBMISSION" });

		try {
			dispatch({
				type: "UPDATE_PROGRESS",
				payload: [
					{ step: "basicInfo", status: "pending" },
					{ step: "details", status: "idle" },
				],
			});

			const basicInfoResponse = await wizardService.submitBasicInfo(
				state.basicInfo as BasicInfo,
			);

			dispatch({
				type: "UPDATE_PROGRESS",
				payload: [
					{ step: "basicInfo", status: "success" },
					{ step: "details", status: "pending" },
				],
			});

			await wizardService.submitDetails({
				...(state.details as Details),
				basicInfoId: basicInfoResponse.id,
			});

			dispatch({
				type: "UPDATE_PROGRESS",
				payload: [
					{ step: "basicInfo", status: "success" },
					{ step: "details", status: "success" },
				],
			});

			dispatch({ type: "SUBMISSION_SUCCESS" });

			onSuccess?.();

			setTimeout(() => {
				onNavigate?.("/employees");
			}, 1000);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Submission failed";
			dispatch({ type: "SUBMISSION_ERROR", payload: errorMessage });
		}
	}, [state.basicInfo, state.details, onSuccess, onNavigate]);

	return {
		state,
		validationErrors,
		isStepValid,
		actions: {
			updateBasicInfo,
			updateDetails,
			goToNextStep,
			goToPreviousStep,
			submitForm,
			resetForm,
			restoreState,
		},
	};
}
