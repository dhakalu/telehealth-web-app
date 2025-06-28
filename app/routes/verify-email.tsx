import axios from "axios";
import { LoaderFunctionArgs, data, useLoaderData } from "react-router";
import { API_BASE_URL } from "~/api";
import { ButtonType } from "~/components/common/Button";
import VerificationResult from "~/components/common/VerificationResult";
import { usePageTitle } from "~/hooks";

// Type definitions for loader responses
type SuccessResponse = {
    success: true;
    message: string;
};

type ErrorResponse = {
    success: false;
    error: string;
};

type LoaderResponse = SuccessResponse | ErrorResponse;

// Loader function for handling email verification
export async function loader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const accessToken = url.searchParams.get("token");

    if (!accessToken) {
        return data({ success: false, error: "Access token is required" } as LoaderResponse);
    }

    try {
        // Make API call to verify email
        await axios.get(`${API_BASE_URL}/verify-email?token=${accessToken}`);
        return data({ success: true, message: "Email verified successfully!" } as LoaderResponse);

    } catch (error) {
        console.error("Email verification error:", error);

        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || "Email verification failed. This may be due to an invalid or expired token. Use the resend verification link option if available.";
            return data({ success: false, error: errorMessage } as LoaderResponse);
        }

        return data({ success: false, error: "An unexpected error occurred. This is unlikely an issue in your end. Please use the contact support button for assistance." } as LoaderResponse);
    }
}

export default function VerifyEmail() {
    usePageTitle("Email Verification - MedTok");
    const loaderData = useLoaderData<LoaderResponse>();

    // Configure actions based on success/error state
    const getActions = () => {
        if (loaderData.success) {
            return [
                { label: "Continue to Login", href: "/login", buttonType: "primary" as ButtonType },
            ];
        } else {
            return [
                { label: "Contact Support", href: "/contact", buttonType: "default" as ButtonType },
                // { label: "Resend Verification Email", onClick: () => resendVerificationEmail() },
                { label: "Back to Login", href: "/login", buttonType: "primary" as ButtonType, ghost: true }
            ];
        }
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-base-content">
                            Email Verification
                        </h1>
                        <p className="text-base-content/70 mt-2">
                            Verifying your email address
                        </p>
                    </div>

                    <VerificationResult
                        status={loaderData.success ? "success" : "error"}
                        title={loaderData.success ? "Email Verified Successfully!" : "Email Verification Failed"}
                        message={loaderData.success ? (loaderData as SuccessResponse).message : (loaderData as ErrorResponse).error}
                        actions={getActions()}
                    />
                </div>
            </div>
        </div>
    );
}
