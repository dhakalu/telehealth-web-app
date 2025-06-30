import Button from "./Button";

interface StatusInfo {
    title: string;
    message: string;
    icon: React.ReactNode;
    showContactSupport: boolean;
    showCompleteProfile?: boolean;
}

interface User {
    sub: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    middle_name?: string;
    email?: string;
    account_type?: string;
    status?: string;
}

interface AccountStatusProps {
    user: User;
    userType: "provider" | "pharmacist";
    onContactSupport?: () => void;
    onCompleteProfile?: () => void;
    onSignOut?: () => void;
}

export default function AccountStatus({
    user,
    userType,
    onContactSupport,
    onCompleteProfile,
    onSignOut,
}: AccountStatusProps) {
    const displayName = user?.name ||
        `${user.given_name || ''} ${user.family_name || ''}`.trim() ||
        user.email?.split('@')[0] ||
        (userType === "pharmacist" ? "Pharmacist" : "Provider");

    const getStatusInfo = (): StatusInfo => {
        const userTypeLabel = userType === "pharmacist" ? "pharmacist" : "practitioner";

        switch (user.status?.toLowerCase()) {
            case 'pending-approval':
                return {
                    title: "Account Under Review",
                    message: `Your ${userTypeLabel} account is currently being reviewed by our support team. You will be notified once the review is complete.`,
                    icon: (
                        <svg className="w-16 h-16 text-info mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    showContactSupport: true
                };
            case 'created':
                return {
                    title: "Please Verify Your Email",
                    message: "We've sent a verification email to your registered email address. Please check your inbox and click the verification link to proceed.",
                    icon: (
                        <svg className="w-16 h-16 text-warning mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    ),
                    showContactSupport: false
                };
            case 'rejected':
                return {
                    title: "Account Application Rejected",
                    message: `Unfortunately, your ${userTypeLabel} account application has been rejected. Please contact our support team for more information.`,
                    icon: (
                        <svg className="w-16 h-16 text-error mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    showContactSupport: true
                };
            case 'incomplete':
                return {
                    title: "Complete Your Profile",
                    message: `Your account is almost ready! Please complete your ${userTypeLabel} profile to continue.`,
                    icon: (
                        <svg className="w-16 h-16 text-warning mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    ),
                    showContactSupport: false,
                    showCompleteProfile: true
                };
            case 'active':
            case 'approved':
                return {
                    title: "Account Active",
                    message: `Your ${userTypeLabel} account is active and ready to use. You can now access all platform features.`,
                    icon: (
                        <svg className="w-16 h-16 text-success mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    showContactSupport: false
                };
            case 'suspended':
                return {
                    title: "Account Suspended",
                    message: `Your ${userTypeLabel} account has been suspended. Please contact support for more information.`,
                    icon: (
                        <svg className="w-16 h-16 text-error mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                        </svg>
                    ),
                    showContactSupport: true
                };
            case 'inactive':
                return {
                    title: "Account Inactive",
                    message: `Your ${userTypeLabel} account is currently inactive. Please contact support to reactivate your account.`,
                    icon: (
                        <svg className="w-16 h-16 opacity-60 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a8.996 8.996 0 008.354-5.646z" />
                        </svg>
                    ),
                    showContactSupport: true
                };
            default:
                return {
                    title: "Account Status Unknown",
                    message: "We're unable to determine your account status at this time. Please contact support for assistance.",
                    icon: (
                        <svg className="w-16 h-16 opacity-60 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    showContactSupport: true
                };
        }
    };

    const statusInfo = getStatusInfo();

    const handleContactSupport = () => {
        if (onContactSupport) {
            onContactSupport();
        } else {
            window.location.href = '/help';
        }
    };

    const handleCompleteProfile = () => {
        if (onCompleteProfile) {
            onCompleteProfile();
        } else {
            const profilePath = userType === "pharmacist" ? "/pharmacist/complete-profile" : "/provider/complete-profile";
            window.location.href = profilePath;
        }
    };

    const handleSignOut = () => {
        if (onSignOut) {
            onSignOut();
        } else {
            window.location.href = '/logout';
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-4">
                <div className="text-center">
                    {/* Status Icon */}
                    <div className="mb-6">
                        {statusInfo.icon}
                    </div>

                    {/* Welcome Message */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold mb-2">
                            Welcome, {displayName}!
                        </h1>
                        <p className="text-sm opacity-60">
                            Account: {user.email}
                        </p>
                        <p className="text-xs opacity-60 mt-1">
                            {userType === "pharmacist" ? "Pharmacist Account" : "Provider Account"}
                        </p>
                    </div>

                    {/* Status Information */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-2">
                            {statusInfo.title}
                        </h2>
                        <p className="opacity-80 leading-relaxed">
                            {statusInfo.message}
                        </p>
                    </div>

                    {/* Email Notification Info */}
                    {statusInfo.showContactSupport && (
                        <div className="mb-8 p-4 border border-info bg-info rounded-lg">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <svg className="w-5 h-5 text-info mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <h3 className="text-sm font-medium text-info-content">
                                        Email Notification
                                    </h3>
                                    <p className="text-sm text-info-content mt-1">
                                        You will receive an email notification at <strong>{user.email}</strong> once your account has been reviewed and approved.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        {statusInfo.showCompleteProfile && (
                            <Button
                                onClick={handleCompleteProfile}
                                buttonType="primary"
                                wide
                            >
                                <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Complete Profile
                            </Button>
                        )}

                        {statusInfo.showContactSupport && (
                            <Button
                                onClick={handleContactSupport}
                                buttonType="secondary"
                                wide
                            >
                                <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Contact Support
                            </Button>
                        )}

                        <Button
                            onClick={handleSignOut}
                            buttonType="neutral"
                            wide
                        >
                            Sign Out
                        </Button>
                    </div>

                    {/* Review Timeline */}
                    {user.status === 'pending-approval' && (
                        <div className="mt-8 p-4 border rounded-lg">
                            <h3 className="text-sm font-medium mb-3">Review Process</h3>
                            <div className="space-y-2 text-left">
                                <div className="flex items-center text-sm">
                                    <div className="w-2 h-2 rounded-full bg-success mr-3"></div>
                                    <span className="opacity-80">Email verified ✓</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <div className="w-2 h-2 rounded-full bg-info mr-3 animate-pulse"></div>
                                    <span className="opacity-80">Under review (current step)</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <div className="w-2 h-2 rounded-full border-2 border-base-300 mr-3"></div>
                                    <span className="opacity-60">Account approval</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <div className="w-2 h-2 rounded-full border-2 border-base-300 mr-3"></div>
                                    <span className="opacity-60">Access granted</span>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
