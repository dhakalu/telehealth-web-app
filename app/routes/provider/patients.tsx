import { LoaderFunction, Outlet, useLoaderData, useNavigate } from "react-router";

import axios from "axios";
import { useState } from "react";
import { API_BASE_URL } from "~/api";
import { requireAuthCookie } from "~/auth";
import ErrorPage from "~/components/common/ErrorPage";
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

type Establishment = {
    id: string;
    providerId: string;
    patientId: string;
    patient: User,
    provider: User,
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
                <div className="p-6 rounded-none shadow-md w-full flex h-full">
                    {/* Left column: Chat list */}
                    <div className="w-1/4 border-r pr-4 overflow-y-auto">
                        <h2 className="text-lg font-bold mb-4">Current Patients</h2>
                        {establishments && establishments.length > 0 ? (
                            <ul className="list bg-base-100 rounded-box shadow-md">
                                {establishments.map((establishment) => (
                                    <li
                                        key={establishment.id}
                                        className={`mb-2 p-2 rounded cursor-pointer ${selectedEstablishmentId === establishment.id ? "bg-base-100" : "hover:bg-base-100"}`}
                                        onClick={() => handleSelectEestablishment(establishment)}
                                    >
                                        <div className="font-medium">Patient: {establishment.patient?.given_name} {establishment.patient?.family_name}</div>
                                        <div className="text-xs">Patient Id: {establishment.patientId}</div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-gray-500 mt-8 text-center">No active patients</div>
                        )}
                    </div>
                    {/* Right column: Selected chat */}
                    <div className="w-3/4 pl-4 flex flex-col h-full">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}