import clsx from 'clsx';
import { ReactNode, Ref } from "react";

export type ButtonType = "default" | "accent" | "neutral" | "primary" | "secondary" | "info" | "success" | "warning" | "error";

export type Size = "xs" | "sm" | "md" | "lg" | "xl"
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    buttonType?: ButtonType;
    soft?: boolean;
    ghost?: boolean;
    link?: boolean;
    wide?: boolean;
    size?: Size;
    isLoading?: boolean;
    leftAlign?: boolean;
    ref?: Ref<HTMLButtonElement>
}

export default function Button({ children, ghost, wide, soft, link, leftAlign, isLoading, buttonType = "primary", size = "md", ...props }: ButtonProps) {

    const isDiabled = props.disabled || isLoading;
    const buttonClass = clsx({
        "btn": "true",
        "btn-primary": buttonType === "primary",
        "btn-secondary": buttonType === "secondary",
        "btn-accent": buttonType === "accent",
        "btn-neutral": buttonType === "neutral",
        "btn-info": buttonType === "info",
        "btn-success": buttonType === "success",
        "btn-warning": buttonType === "warning",
        "btn-error": buttonType === "error",
        "btn-ghost": ghost,
        "btn-link": link,
        "btn-disabled": isDiabled,
        "btn-xs": size === "xs",
        "btn-sm": size === "sm",
        "btn-md": size === "md",
        "btn-lg": size === "lg",
        "btn-xl": size === "xl",
        "btn-wide": wide,
        "btn-soft": soft,
        "justify-left": leftAlign
    });

    return (
        <button className={buttonClass} {...props} disabled={isDiabled} >
            {isLoading && <span className="loading loading-dots"></span>}
            {children}
        </button>
    )
}