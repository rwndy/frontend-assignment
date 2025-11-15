import { clsx } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import "./Button.css";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";

	size?: "sm" | "md" | "lg" | "xl";

	rounded?: "sm" | "md" | "lg" | "full";

	block?: boolean;

	loading?: boolean;

	leftIcon?: ReactNode;

	rightIcon?: ReactNode;

	children: ReactNode;

	className?: string;
}

/**
 * Button component with multiple variants, sizes, and loading states
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md">
 *   Click me
 * </Button>
 *
 * <Button variant="outline" leftIcon={<Icon />}>
 *   With Icon
 * </Button>
 *
 * <Button loading>
 *   Loading...
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			variant = "primary",
			size = "md",
			rounded = "md",
			block = false,
			loading = false,
			disabled,
			leftIcon,
			rightIcon,
			children,
			className,
			type = "button",
			...rest
		},
		ref,
	) => {
		const isDisabled = disabled || loading;

		return (
			<button
				ref={ref}
				type={type}
				disabled={isDisabled}
				aria-disabled={isDisabled}
				aria-busy={loading}
				className={clsx(
					"btn",
					`btn--${variant}`,
					`btn--${size}`,
					`btn--rounded-${rounded}`,
					{
						"btn--block": block,
						"btn--loading": loading,
						"btn--disabled": isDisabled,
					},
					className,
				)}
				{...rest}
			>
				{loading && (
					<span className="btn__spinner" role="alert" aria-label="Loading">
						<span className="btn__spinner-inner" />
					</span>
				)}

				{!loading && leftIcon && (
					<span className="btn__icon btn__icon--left" aria-hidden="true">
						{leftIcon}
					</span>
				)}

				<span className="btn__content">{children}</span>

				{!loading && rightIcon && (
					<span className="btn__icon btn__icon--right" aria-hidden="true">
						{rightIcon}
					</span>
				)}
			</button>
		);
	},
);

Button.displayName = "Button";
