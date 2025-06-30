import { ReactNode } from "react";

interface LoadingSpinnerProps {
    message?: string;
    size?: "sm" | "md" | "lg" | "xl";
    fullScreen?: boolean;
    className?: string;
    children?: ReactNode;
}

const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-16 w-16",
    lg: "h-32 w-32",
    xl: "h-48 w-48"
};

export default function LoadingSpinner({
    message = "Loading...",
    size = "lg",
    fullScreen = false,
    className = "",
    children
}: LoadingSpinnerProps) {
    const content = (
        <div className={`text-center ${className}`}>
            <div className={`animate-spin rounded-full border-b-2 border-primary mx-auto ${sizeClasses[size]}`}></div>
            {message && (
                <p className="mt-4 text-base-content/60">{message}</p>
            )}
            {children && (
                <div className="mt-4">
                    {children}
                </div>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-100">
                {content}
            </div>
        );
    }

    return content;
}
