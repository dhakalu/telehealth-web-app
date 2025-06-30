import { LoaderFunction, redirect, useLoaderData } from "react-router";
import { API_BASE_URL } from "~/api";
import { requireAuthCookie } from "~/auth";
import AccountStatus from "~/components/common/AccountStatus";
import ErrorPage from "~/components/common/ErrorPage";
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
        const response = await fetch(`${API_BASE_URL}/user/${loggedInUser.sub}`);
        if (!response.ok) {
            if (response.status === 404) {
                return redirect("/pharmacist/complete-profile");
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

export default function PharmacistAccountStatus() {
    usePageTitle("Account Status - MedTok Pharmacist");
    const { user, error } = useLoaderData<{ user: User, error: string }>();

    const handleContactSupport = () => {
        window.location.href = '/help';
    };

    const handleCompleteProfile = () => {
        window.location.href = '/pharmacist/complete-profile';
    };

    const handleSignOut = () => {
        window.location.href = '/logout';
    };

    if (error) {
        return (<ErrorPage error={error} />);
    }

    return (
        <AccountStatus
            user={user}
            userType="pharmacist"
            onContactSupport={handleContactSupport}
            onCompleteProfile={handleCompleteProfile}
            onSignOut={handleSignOut}
        />
    );
}
