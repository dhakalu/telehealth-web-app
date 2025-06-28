import Button, { ButtonType } from "~/components/common/Button";

export type VerificationStatus = "success" | "error";

export interface VerificationResultProps {
    status: VerificationStatus;
    title: string;
    message: string;
    actions?: {
        label: string;
        href?: string;
        onClick?: () => void;
        buttonType?: ButtonType;
        disabled?: boolean;
    }[];
}

export default function VerificationResult({ status, title, message, actions = [] }: VerificationResultProps) {
    const isSuccess = status === "success";

    const iconBgClass = isSuccess ? "bg-success" : "bg-error";
    const iconColorClass = isSuccess ? "text-success-content" : "text-error-content";
    const titleColorClass = isSuccess ? "text-success" : "text-error";

    const icon = isSuccess ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    );

    return (
        <div className="text-center">
            <div className={`w-16 h-16 mx-auto mb-4 ${iconBgClass} rounded-full flex items-center justify-center`}>
                <svg className={`w-8 h-8 ${iconColorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {icon}
                </svg>
            </div>
            <h2 className={`text-2xl font-semibold ${titleColorClass} mb-2`}>
                {title}
            </h2>
            <p className="text-base-content/70 mb-6">
                {message}
            </p>
            {actions.length > 0 && (
                <div className="space-y-2">
                    {actions.map((action, index) => (
                        action.href ? (
                            <Button
                                key={index}
                                buttonType={action.buttonType || "primary"}
                                wide
                                disabled={action.disabled}
                                onClick={() => window.location.href = action.href!}
                            >
                                {action.label}
                            </Button>
                        ) : (
                            <Button
                                key={index}
                                buttonType={action.buttonType || "primary"}
                                wide
                                disabled={action.disabled}
                                onClick={action.onClick}
                            >
                                {action.label}
                            </Button>
                        )
                    ))}
                </div>
            )}
        </div>
    );
}
