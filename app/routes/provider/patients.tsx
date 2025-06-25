import { LoaderFunction, Outlet, useLoaderData, useNavigate } from "react-router";

import axios from "axios";
import { useState } from "react";
import { API_BASE_URL } from "~/api";
import { requireAuthCookie } from "~/auth";
import ErrorPage from "~/components/common/ErrorPage";
import EstablishmentList, { Establishment } from "~/components/provider/EstablishmentList";
import { User } from "./complete-profile";

type EncounterType = "in-person" | "telehealth"

export type Encounter = {
    id: string;
    providerId: string;
    patientId: string;
    reason: string;
    start: string;
    end?: string | null;
    type?: EncounterType;
    status: string;
    notes?: string | null;
    createdAt: string;
    patient: User
    provider: User
}




export const loader: LoaderFunction = async ({ request }) => {
    const user = await requireAuthCookie(request);
    try {
        const response = await axios.get(`${API_BASE_URL}/establishment/by-practitioner/${user.sub}`);
        return { establishments: response.data };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                return []; // User not found, return the user data to complete profile
            } else {
                console.error("Error fetching practitioner data:", error);
                return Response.json({ error: "Failed to fetch practitioner data" }, { status: error.response?.status || 500 });
            }
        } else {
            return Response.json({ error: "An unexpected error occurred" }, { status: 500 });
        }
    }
}



export default function EstablishmentsPage() {

    const { establishments, error } = useLoaderData<{ establishments: Establishment[], error: string }>() || [];
    const navigate = useNavigate();


    const [selectedEstablishmentId, setSelectedEstablishmentId] = useState<string | null>(establishments && establishments.length > 0 ? establishments[0].id : null);

    const handleSelectEestablishment = (establishment: Establishment) => {
        const establishmentId = establishment.id;
        setSelectedEstablishmentId(establishmentId);
        navigate(`${establishment.patientId}/chat`);
    }

    if (error) {
        return (
            <ErrorPage error={error} />
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-1 flex items-stretch justify-stretch">
                <div className="w-full flex">
                    {/* Left column: Chat list */}
                    <div className="w-1/4 overflow-y-auto shadow-lg hidden lg:block">
                        <EstablishmentList establishments={establishments} onSelect={handleSelectEestablishment} selectedEstablishmentId={selectedEstablishmentId} />
                    </div>
                    {/* Right column: Selected chat */}
                    <div className="lg:w-3/4 w-full pl-1 pt-1 flex-col">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}