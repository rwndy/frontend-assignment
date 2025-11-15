import type { FC } from "react";
import "./Indicator.css";

interface IndicatorProps {
	role: "admin" | "ops";
	currentStep: number;
}

const Indicator: FC<IndicatorProps> = ({ role = "admin", currentStep = 1 }) => {
	return (
		<div className="wizard-header">
			<div className="wizard-progress">
				{role === "admin" && (
					<>
						<div
							className={`${"wizard-step"} ${currentStep >= 1 ? "active" : ""} ${
								currentStep > 1 ? "completed" : ""
							}`}
						>
							<div className="wizard-step-indicator">1</div>
							<div className="wizard-step-label">Basic Info</div>
						</div>
						<div
							className={`${"wizard-step"} ${currentStep === 2 ? "active" : ""} ${
								currentStep > 2 ? "completed" : ""
							}`}
						>
							<div className="wizard-step-indicator">2</div>
							<div className="wizard-step-label">Details</div>
						</div>
					</>
				)}
				{role === "ops" && (
					<div className={`${"wizard-step"} 'active'}`}>
						<div className="wizard-step-indicator">1</div>
						<div className="wizard-step-label">Details</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Indicator;
