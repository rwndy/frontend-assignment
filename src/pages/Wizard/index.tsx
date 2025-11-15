import type { FC } from "react";
import { useCallback, useState } from "react";
import {
	BasicInfoStep,
	DetailStep,
	SubmissionProgressStep,
} from "@/components/featuers";
import Layout from "@/components/Layout";
import { Button, Indicator } from "@/components/ui";
import type { UserRole } from "@/libs/types";
import {
	useDraftPersistence,
	useWizardData,
	useWizardForm,
} from "@/utils/hooks";
import "./Wizard.css";

export const Wizard: FC = () => {
	const [role, setRole] = useState<UserRole>("admin");

	const {
		departments,
		locations,
		isLoading,
		error: dataError,
	} = useWizardData();

	const handleNavigate = useCallback((path: string) => {
		window.location.href = path;
	}, []);

	const { state, validationErrors, isStepValid, actions } = useWizardForm({
		role,
		departments,
		onSuccess: () => {
			console.log("Form submitted successfully!");
		},
		onNavigate: handleNavigate,
	});

	const { clearDraft } = useDraftPersistence(role, state, actions.restoreState);

	const handleRoleChange = (role: UserRole) => {
		setRole(role);
		const params = new URLSearchParams(window.location.search);
		params.set("role", role);
		window.history.replaceState(
			{},
			"",
			`${window.location.pathname}?${params}`,
		);
	};

	const handleNext = useCallback(() => {
		if (state.currentStep === 1 && role === "admin") {
			actions.goToNextStep();
		} else {
			actions.submitForm();
		}
	}, [state.currentStep, role, actions]);

	const handleClearDraft = useCallback(() => {
		const confirmed = window.confirm(
			"Are you sure you want to clear the draft?",
		);
		if (confirmed) {
			clearDraft();
			actions.resetForm();
		}
	}, [clearDraft, actions]);

	if (dataError) {
		return (
			<Layout>
				<div className="wizard-error">
					<h2>Failed to load wizard data</h2>
					<p>{dataError}</p>
					<Button onClick={() => window.location.reload()}>Retry</Button>
				</div>
			</Layout>
		);
	}

	if (isLoading) {
		return (
			<Layout>
				<div className="wizard-loading">Loading...</div>
			</Layout>
		);
	}

	const showStep1 = role === "admin" && state.currentStep === 1;
	const showStep2 = role === "admin" && state.currentStep === 2;
	const isSubmitStep = state.currentStep === 2;

	return (
		<Layout>
			<div className="wizard">
				<div className="wizard__container">
					<div className="wizard__header">
						<h2 className="wizard__title">Employee Onboarding</h2>

						<div className="wizard__btn-roles">
							<Button
								onClick={() => handleRoleChange("admin")}
								variant={role === "admin" ? "primary" : "outline"}
								disabled={state.isSubmitting}
							>
								Admin
							</Button>
							<Button
								onClick={() => handleRoleChange("ops")}
								variant={role === "ops" ? "primary" : "outline"}
								disabled={state.isSubmitting}
							>
								Ops
							</Button>
						</div>
					</div>

					<Indicator role={role} currentStep={state.currentStep} />

					{showStep1 && (
						<BasicInfoStep
							data={state.basicInfo}
							errors={validationErrors}
							onChange={actions.updateBasicInfo}
						/>
					)}

					{showStep2 && (
						<DetailStep
							data={state.details}
							locations={locations}
							errors={validationErrors}
							role={role}
							onChange={actions.updateDetails}
						/>
					)}

					{role === "ops" && (
						<DetailStep
							data={state.details}
							locations={locations}
							errors={validationErrors}
							role={role}
							onChange={actions.updateDetails}
						/>
					)}

					<SubmissionProgressStep
						progress={state.submitProgress}
						error={state.error}
					/>

					<div className="wizard__actions">
						{state.currentStep === 2 && role === "admin" && (
							<Button
								variant="outline"
								onClick={actions.goToPreviousStep}
								disabled={state.isSubmitting}
							>
								Back
							</Button>
						)}
						<Button
							variant="outline"
							onClick={handleClearDraft}
							disabled={state.isSubmitting}
						>
							Clear Draft
						</Button>
						<Button
							onClick={handleNext}
							disabled={!isStepValid || state.isSubmitting}
						>
							{state.isSubmitting
								? "Submitting..."
								: isSubmitStep
									? "Submit"
									: "Next"}
						</Button>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default Wizard;
