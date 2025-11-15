import type { FC } from "react";
import type { SubmissionProgress, SubmissionStatus } from "@/libs/types";
import "./SubmissionProgress.css";

interface SubmissionProgressProps {
	progress: SubmissionProgress[];
	error: string | null;
}

const STATUS_ICONS: Record<SubmissionStatus, string> = {
	idle: "⚪",
	pending: "⏳",
	success: "✅",
	error: "❌",
};

const STATUS_LABELS: Record<SubmissionProgress["step"], string> = {
	basicInfo: "Submitting basic info...",
	details: "Submitting details...",
};

const SubmissionProgressStep: FC<SubmissionProgressProps> = ({
	progress,
	error,
}) => {
	if (progress.length === 0 && !error) return null;

	return (
		<div className="submission-progress">
			{progress.length > 0 && (
				<div className="submission-progress__container">
					<h4 className="submission-progress__title">Submitting...</h4>
					<ul className="submission-progress__list">
						{progress.map((item) => (
							<li
								key={item.step}
								className={`submission-progress__item submission-progress__item--${item.status}`}
							>
								<span className="submission-progress__icon">
									{STATUS_ICONS[item.status]}
								</span>
								<span className="submission-progress__label">
									{STATUS_LABELS[item.step]}
								</span>
							</li>
						))}
					</ul>
				</div>
			)}

			{error && (
				<div className="submission-progress__error" role="alert">
					<strong>Error:</strong> {error}
				</div>
			)}
		</div>
	);
};

export default SubmissionProgressStep;
