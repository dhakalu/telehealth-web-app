import axios from "axios";
import { LoaderFunction, redirect, useLoaderData, useNavigate } from "react-router";
import { API_BASE_URL } from "~/api";
import { requireAuthCookie } from "~/auth";
import { PharmacistForm } from "~/components/pharmacist";
import { usePageTitle } from "~/hooks";
import { User } from "../provider/complete-profile";


export const loader: LoaderFunction = async ({ request }) => {
    const loggedInUser = await requireAuthCookie(request);
    const response = await axios.get<User>(`${API_BASE_URL}/user/${loggedInUser.sub}`);
    console.log("User data:", response.data);
    const user = response.data;
    // If already complete, redirect to pharmacist dashboard
    if (user?.status !== "email-verified") {
        return redirect("/pharmacist");
    }

    return { user, baseUrl: API_BASE_URL, loggedInUser };
}


export default function PharmacistProfile() {
    usePageTitle("Complete Your Profile - MedTok Pharmacist");
    const { baseUrl, loggedInUser } = useLoaderData<{ loggedInUser: User, user: User, baseUrl: string }>();
    const navigate = useNavigate();
    const handleCreateSuccess = async () => {
        navigate('/pharmacist');
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="shadow rounded-lg p-8">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold opacity-90">Complete Your Pharmacist Profile</h1>
                        <p className="mt-2 opacity-60">
                            Please provide your employment details to complete your pharmacist profile.
                        </p>
                    </div>

                    <PharmacistForm onPharmacistCreated={handleCreateSuccess} userId={loggedInUser.sub} baseUrl={baseUrl} />
                </div>
            </div>
        </div>
    );
}
