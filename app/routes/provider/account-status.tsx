import { LoaderFunction, useLoaderData } from "react-router";
import { userApi } from "~/api/users";
import { requireAuthCookie } from "~/auth";
import AccountStatus from "~/components/common/AccountStatus";
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

export default function ProviderAccountStatus() {
    usePageTitle("Account Status - MedTok Provider");
    const { user } = useLoaderData<{ user: User }>();

    const handleContactSupport = () => {
        window.location.href = '/help';
    };

    const handleCompleteProfile = () => {
        window.location.href = '/provider/complete-profile';
    };

    const handleSignOut = () => {
        window.location.href = '/logout';
    };

    return (
        <AccountStatus
            user={user}
            userType="provider"
            onContactSupport={handleContactSupport}
            onCompleteProfile={handleCompleteProfile}
            onSignOut={handleSignOut}
        />
    );
}
