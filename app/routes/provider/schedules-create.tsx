import { LoaderFunction, useLoaderData } from "react-router";
import { API_BASE_URL } from "~/api";
import { requireAuthCookie } from "~/auth";
import OfficeScheduleModal from "~/components/provider/schedule/CreateUpdateForm";
import { User } from "./complete-profile";

// Loader function to get the user
export const loader: LoaderFunction = async ({ request }) => {
    const user = await requireAuthCookie(request);

    return Response.json({ user, baseUrl: API_BASE_URL });
};

export default function ScheduleManagement() {
    const { user, baseUrl } = useLoaderData<{ user: User, baseUrl: string }>();


    return (
        <OfficeScheduleModal
            baseUrl={baseUrl}
            practitionerId={user.sub}
        />
    );
}
