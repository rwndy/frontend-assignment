import type { FC } from "react";
import "./ErrorMessage.css";

interface ErrorMessageProps {
	message: string;
	title?: string;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ message, title = "Error" }) => {
	return (
		<div className={"container"}>
			<div className={"icon"}>⚠️</div>
			<div className={"content"}>
				<h3 className={"title"}>{title}</h3>
				<p className={"message"}>{message}</p>
			</div>
		</div>
	);
};

export default ErrorMessage;
