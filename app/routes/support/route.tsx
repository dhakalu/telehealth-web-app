import axios from "axios";
import { LoaderFunction, Outlet, useLoaderData } from "react-router";
import { API_BASE_URL } from "~/api";
import { requireAuthCookie } from "~/auth";
import AppHeader from "~/components/common/AppHeader";
import ErrorPage from "~/components/common/ErrorPage";
import { User } from "./complete-profile";

export const loader: LoaderFunction = async ({ request }) => {
    const loggedInUser = await requireAuthCookie(request);
    try {
        const response = await axios.get<User>(`${API_BASE_URL}/user/${loggedInUser.sub}`);
        const user = response.data;
        // const url = new URL(request.url);
        // if (user?.status !== "complete" && url.pathname !== "/support/complete-profile") {
        //     return redirect("/support/complete-profile");
        // }
        return { user };
    } catch (error) {
        console.error("Error fetching user data:", error);
        return { error: "Failed to load user data" };
    }
}

export default function SupportAppLayout() {
    const { user, error } = useLoaderData<{ user: User, error?: string }>();
    if (error) {
        return <ErrorPage error={error} />;
    }
    return (
        <div className="flex flex-col h-screen">
            <AppHeader user={user} links={[{
                label: "Dashboard",
                href: "/support"
            }, {
                label: "Users",
                href: "/support/team-management"
            }, {
                label: "Organizations",
                href: "/support/manage-organizations"
            }]} />
            <div className="flex-1 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
}
