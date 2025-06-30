import { LoaderFunction, useLoaderData } from "react-router";
import { userApi } from "~/api/users";
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
        const userData = await userApi.getUserById(loggedInUser.sub);
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
