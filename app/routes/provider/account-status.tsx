import { LoaderFunction, redirect, useLoaderData } from "react-router";
import { requireAuthCookie } from "~/auth";
import Button from "~/components/common/Button";
import { usePageTitle } from "~/hooks";

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

export const loader: LoaderFunction = async ({ request }) => {
    const loggedInUser = await requireAuthCookie(request);
    try {
        const response = await fetch(`${process.env.API_BASE_URL}/user/${loggedInUser.sub}`);
        if (!response.ok) {
            if (response.status === 404) {
                return redirect("/provider/complete-profile");
            }
            throw new Error("Failed to fetch user data");
        }
        const userData = await response.json();
        loggedInUser.status = userData.status;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return {
            error: "Cannot fetch user data."
        }
    }
    return { user: loggedInUser };
}

export default function AccountStatus() {
    usePageTitle("Account Status - MedTok Provider");
    const { user } = useLoaderData<{ user: User }>();

    const displayName = user.name ||
        `${user.given_name || ''} ${user.family_name || ''}`.trim() ||
        user.email?.split('@')[0] ||
        'Provider';

    const getStatusInfo = () => {
        switch (user.status?.toLowerCase()) {
            case 'pending-approval':
                return {
                    title: "Account Under Review",
                    message: "Your practitioner account is currently being reviewed by our support team.Check th",
                    icon: (
                        <svg className="w-16 h-16 text-blue-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <svg className="w-16 h-16 text-yellow-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    ),
                    showContactSupport: false
                };
            case 'rejected':
                return {
                    title: "Account Application Rejected",
                    message: "Unfortunately, your practitioner account application has been rejected. Please contact our support team for more information.",
                    icon: (
                        <svg className="w-16 h-16 text-red-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    showContactSupport: true
                };
            case 'incomplete':
                return {
                    title: "Complete Your Profile",
                    message: "Your account is almost ready! Please complete your practitioner profile to continue.",
                    icon: (
                        <svg className="w-16 h-16 text-orange-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    ),
                    showContactSupport: false
                };
            default:
                return {
                    title: "Account Status Unknown",
                    message: "We're unable to determine your account status at this time. Please contact support for assistance.",
                    icon: (
                        <svg className="w-16 h-16 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    showContactSupport: true
                };
        }
    };

    const statusInfo = getStatusInfo();

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
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Welcome, {displayName}!
                        </h1>
                        <p className="text-sm text-gray-600">
                            Account: {user.email}
                        </p>
                    </div>

                    {/* Status Information */}
                    <div className="mb-8">
                        <p className="text-gray-700 leading-relaxed">
                            {statusInfo.message}
                        </p>
                    </div>

                    {/* Email Notification Info */}
                    {statusInfo.showContactSupport && (
                        <div className="mb-8 p-4 border border-blue-200 rounded-lg">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <h3 className="text-sm font-medium text-blue-900">
                                        Email Notification
                                    </h3>
                                    <p className="text-sm text-blue-700 mt-1">
                                        You will receive an email notification at <strong>{user.email}</strong> once your account has been reviewed and approved.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-4">

                        {statusInfo.showContactSupport && (
                            <Button
                                onClick={() => window.location.href = '/help'}
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
                            onClick={() => window.location.href = '/logout'}
                            buttonType="neutral"
                            wide
                        >
                            Sign Out
                        </Button>
                    </div>

                    {/* Review Timeline */}
                    {user.status === 'pending-approval' && (
                        <div className="mt-8 p-4 border border-gray-200 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">Review Process</h3>
                            <div className="space-y-2 text-left">
                                <div className="flex items-center text-sm">
                                    <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                                    <span className="text-gray-700">Email verified ✓</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-3 animate-pulse"></div>
                                    <span className="text-gray-700">Under review (current step)</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <div className="w-2 h-2 rounded-full border-2 border-gray-300 mr-3"></div>
                                    <span className="text-gray-500">Account approval</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <div className="w-2 h-2 rounded-full border-2 border-gray-300 mr-3"></div>
                                    <span className="text-gray-500">Access granted</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
