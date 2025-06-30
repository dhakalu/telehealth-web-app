interface StatusBadgeProps {
    status?: string;
    userType: "provider" | "pharmacist";
    size?: "sm" | "md" | "lg";
    showIcon?: boolean;
    className?: string;
}

export default function StatusBadge({
    status,
    userType,
    size = "sm",
    showIcon = false,
    className = "",
}: StatusBadgeProps) {
    const getStatusConfig = () => {
        switch (status?.toLowerCase()) {
            case 'active':
            case 'approved':
                return {
                    label: 'Active',
                    bgColor: 'bg-success',
                    textColor: 'text-success-content',
                    icon: (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    )
                };
            case 'pending-approval':
                return {
                    label: 'Pending Review',
                    bgColor: 'bg-info',
                    textColor: 'text-info-content',
                    icon: (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                    )
                };
            case 'created':
                return {
                    label: 'Email Verification',
                    bgColor: 'bg-warning',
                    textColor: 'text-warning-content',
                    icon: (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                    )
                };
            case 'rejected':
                return {
                    label: 'Rejected',
                    bgColor: 'bg-error',
                    textColor: 'text-error',
                    icon: (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    )
                };
            case 'incomplete':
                return {
                    label: 'Incomplete',
                    bgColor: 'bg-warning',
                    textColor: 'text-warning',
                    icon: (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    )
                };
            case 'suspended':
                return {
                    label: 'Suspended',
                    bgColor: 'bg-error',
                    textColor: 'text-error',
                    icon: (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                        </svg>
                    )
                };
            case 'inactive':
                return {
                    label: 'Inactive',
                    bgColor: 'bg-base-300',
                    textColor: 'text-base-content',
                    icon: (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                    )
                };
            default:
                return {
                    label: 'Unknown',
                    bgColor: 'bg-base-300',
                    textColor: 'text-base-content',
                    icon: (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                    )
                };
        }
    };

    const statusConfig = getStatusConfig();

    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-2 text-base'
    };

    return (
        <span
            className={`inline-flex items-center font-medium rounded-full ${statusConfig.bgColor} ${statusConfig.textColor} ${sizeClasses[size]} ${className}`}
            title={`${userType === "pharmacist" ? "Pharmacist" : "Provider"} Status: ${statusConfig.label}`}
        >
            {showIcon && (
                <span className="mr-1">
                    {statusConfig.icon}
                </span>
            )}
            {statusConfig.label}
        </span>
    );
}
