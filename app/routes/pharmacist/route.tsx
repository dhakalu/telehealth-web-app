import { LoaderFunction, Outlet, redirect, useLoaderData } from "react-router";

// Update the import path below to the correct location of requireAuthCookie
import { userApi } from "~/api/users";
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
        const userData = await userApi.getUserById(user.sub);
        user.status = userData.status;
        if (user.status === "email-verified" && !isUserInCompletePath) {
            return redirect(completeProfilePath);
        }

        if (user.status !== "complete" && !isUserInCompletePath && !isStatusPage) {
            return redirect(accountStatusPath);
        }

    } catch (error) {
        console.error("Error fetching user data:", error);
        if (!isUserInCompletePath) {
            return redirect(completeProfilePath);
        }
        return Response.json(
            { error: "Failed to fetch user data" },
            { status: 500 }
        );
    }
    return user;
}


export default function PharmacistAppLayout() {
    const user = useLoaderData<User>();
    return (
        <div className="flex flex-col h-screen">
            <header className="h-50">
                <AppHeader user={user} links={[{
                    label: "Dashboard",
                    href: "/pharmacist"
                }, {
                    label: "Profile",
                    href: "/pharmacist/complete-profile"
                }]} />
            </header>
            <div className="flex-1 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
}