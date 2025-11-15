import type { FC } from "react";
import "./LoadingSpinner.css";

interface LoadingSpinnerProps {
	size?: "small" | "medium" | "large";
	message?: string;
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({
	size = "medium",
	message = "Loading employees...",
}) => {
	return (
		<div className={"container"}>
			<div className={`'spinner' ${size}`}>
				<span className={"srOnly"}>Loading...</span>
			</div>
			{message && <p className={"message"}>{message}</p>}
		</div>
	);
};

export default LoadingSpinner;
