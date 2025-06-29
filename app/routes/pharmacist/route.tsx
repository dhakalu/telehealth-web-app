import { LoaderFunction, Outlet, redirect, useLoaderData } from "react-router";

// Update the import path below to the correct location of requireAuthCookie
import axios from "axios";
import { requireAuthCookie } from "~/auth"; // or "./auth" or the actual relative path
import { accountTypePathsMap } from "~/common-actions/signin";
import AppHeader from "~/components/common/AppHeader";
import { User } from "../provider/complete-profile";

export const loader: LoaderFunction = async ({ request }) => {
    const user = await requireAuthCookie(request);

    if (user.account_type !== "pharmacist") {
        return redirect(accountTypePathsMap[user.account_type || ""] || "/");
    }
    const pathname = new URL(request.url).pathname;
    const completeProfilePath = "/pharmacist/complete-profile";
    const accountStatusPath = "/pharmacist/account-status";
    const isUserInCompletePath = pathname === completeProfilePath;
    const isStatusPage = pathname === accountStatusPath;

    try {
        const response = axios.get(`${process.env.API_BASE_URL}/user/${user.sub}`);
        user.status = (await response).data.status;
        if (user.status === "email-verified" && !isUserInCompletePath) {
            return redirect(completeProfilePath);
        }

        if (user.status !== "complete" && !isStatusPage) {
            return redirect(accountStatusPath);
        }

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            if (error.response.status === 404 && !isUserInCompletePath) {
                return redirect(completeProfilePath);
            }
            return Response.json(
                { error: error.response.data.error || "Failed to fetch user data" },
                { status: error.response.status }
            );
        } else {
            console.error("Error fetching user data:", error);
            return Response.json(
                { error: "Internal server error" },
                { status: 500 }
            );
        }
    }
    return user;
}


export default function ProviderAppLayout() {
    const user = useLoaderData<User>();
    return (
        <div className="flex flex-col h-screen">
            <header className="h-50">
                <AppHeader user={user} />
            </header>
            <div className="flex-1 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
}