import { clsx } from "clsx";
import type { InputHTMLAttributes, ReactNode } from "react";
import { forwardRef, useId } from "react";
import "./Input.css";

export interface InputProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
	label?: string;

	isRequired?: boolean;

	error?: string;

	helperText?: string;

	size?: "sm" | "md" | "lg";

	variant?: "default" | "filled" | "outlined";

	startAdornment?: ReactNode;

	endAdornment?: ReactNode;

	fullWidth?: boolean;

	wrapperClassName?: string;

	labelClassName?: string;

	inputClassName?: string;
}

/**
 * Input component with label, validation, and accessibility features
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   type="email"
 *   isRequired
 *   error="Invalid email"
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			label,
			isRequired = false,
			error,
			helperText,
			size = "md",
			variant = "default",
			startAdornment,
			endAdornment,
			fullWidth = false,
			wrapperClassName,
			labelClassName,
			inputClassName,
			id: providedId,
			disabled,
			className,
			...rest
		},
		ref,
	) => {
		const autoId = useId();
		const id = providedId || autoId;
		const errorId = `${id}-error`;
		const helperId = `${id}-helper`;

		const hasError = Boolean(error);
		const hasHelper = Boolean(helperText);

		return (
			<div
				className={clsx(
					"input-wrapper",
					{
						"input-wrapper--full-width": fullWidth,
						"input-wrapper--disabled": disabled,
						"input-wrapper--error": hasError,
					},
					wrapperClassName,
				)}
			>
				{label && (
					<label
						htmlFor={id}
						className={clsx(
							"input-label",
							{
								"input-label--required": isRequired,
								"input-label--disabled": disabled,
							},
							labelClassName,
						)}
					>
						{label}
						{isRequired && <span className="input-label__asterisk">*</span>}
					</label>
				)}

				<div
					className={clsx("input-container", {
						"input-container--with-start": startAdornment,
						"input-container--with-end": endAdornment,
					})}
				>
					{startAdornment && (
						<div className="input-adornment input-adornment--start">
							{startAdornment}
						</div>
					)}

					<input
						ref={ref}
						id={id}
						disabled={disabled}
						aria-invalid={hasError}
						aria-required={isRequired}
						aria-describedby={clsx({
							[errorId]: hasError,
							[helperId]: hasHelper && !hasError,
						})}
						className={clsx(
							"input-field",
							`input-field--${size}`,
							`input-field--${variant}`,
							{
								"input-field--error": hasError,
								"input-field--disabled": disabled,
								"input-field--with-start": startAdornment,
								"input-field--with-end": endAdornment,
							},
							inputClassName,
							className,
						)}
						{...rest}
					/>

					{endAdornment && (
						<div className="input-adornment input-adornment--end">
							{endAdornment}
						</div>
					)}
				</div>

				{hasError && (
					<span
						id={errorId}
						className="input-message input-message--error"
						role="alert"
					>
						{error}
					</span>
				)}

				{hasHelper && !hasError && (
					<span id={helperId} className="input-message input-message--helper">
						{helperText}
					</span>
				)}
			</div>
		);
	},
);

Input.displayName = "Input";
