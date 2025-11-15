/** biome-ignore-all lint/a11y/useAriaPropsSupportedByRole: <explanation> */

import { clsx } from "clsx";
import type { ReactNode, SelectHTMLAttributes } from "react";
import { forwardRef } from "react";
import "./Select.css";

export interface SelectOption {
	value: string | number;

	label: string;

	disabled?: boolean;
}

interface SelectProps
	extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
	label?: string;

	isRequired?: boolean;

	error?: string;

	helperText?: string;

	size: "sm" | "md" | "lg";

	fullWidth?: boolean;

	options: SelectOption[];

	placeholder?: string;

	startAdornment?: ReactNode;

	wrapperClassName?: string;

	selectClassName?: string;
}

/**
 * Select component with label, validation, and accessibility features
 *
 * @example
 * ```tsx
 * <Select
 *   label="Role"
 *   placeholder="Select Role"
 *   options={[
 *     { value: "ops", label: "Ops" },
 *     { value: "admin", label: "Admin" },
 *     { value: "engineer", label: "Engineer" },
 *     { value: "finance", label: "Finance" },
 *   ]}
 *   isRequired
 * />
 * ```
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
	(
		{
			label,
			isRequired = false,
			error,
			helperText,
			size = "md",
			fullWidth = false,
			options,
			placeholder = "Select an option",
			startAdornment,
			wrapperClassName,
			selectClassName,
			id,
			disabled,
			className,
			...rest
		},
		ref,
	) => {
		const errorId = id ? `${id}-error` : undefined;
		const helperId = id ? `${id}-helper` : undefined;

		const hasError = Boolean(error);
		const hasHelper = Boolean(helperText);

		return (
			<div
				className={clsx(
					"select-wrapper",
					{
						"select-wrapper--full-width": fullWidth,
						"select-wrapper--disabled": disabled,
						"select-wrapper--error": hasError,
					},
					wrapperClassName,
				)}
			>
				{label && (
					<label
						htmlFor={id}
						className={clsx("select-label", {
							"select-label--required": isRequired,
							"select-label--disabled": disabled,
						})}
					>
						{label}
						{isRequired && (
							<span className="select-label__asterisk" aria-label="required">
								*
							</span>
						)}
					</label>
				)}

				<div className="select-input-wrapper">
					{startAdornment && (
						<div className="select-adornment select-adornment--start">
							{startAdornment}
						</div>
					)}

					<select
						ref={ref}
						id={id}
						disabled={disabled}
						aria-invalid={hasError}
						aria-required={isRequired}
						aria-describedby={clsx({
							[errorId!]: hasError && errorId,
							[helperId!]: hasHelper && !hasError && helperId,
						})}
						className={clsx(
							"select-field",
							`select-field--${size}`,
							{
								"select-field--error": hasError,
								"select-field--disabled": disabled,
								"select-field--with-start": startAdornment,
							},
							selectClassName,
							className,
						)}
						{...rest}
					>
						{placeholder && (
							<option value="" disabled>
								{placeholder}
							</option>
						)}
						{options.map((option) => (
							<option
								key={option.value}
								value={option.value}
								disabled={option.disabled}
							>
								{option.label}
							</option>
						))}
					</select>

					<div className="select-chevron" aria-hidden="true">
						&darr;
					</div>
				</div>

				{hasError && (
					<span
						id={errorId}
						className="select-message select-message--error"
						role="alert"
					>
						{error}
					</span>
				)}

				{hasHelper && !hasError && (
					<span id={helperId} className="select-message select-message--helper">
						{helperText}
					</span>
				)}
			</div>
		);
	},
);

Select.displayName = "Select";
