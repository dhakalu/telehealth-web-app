import { LoaderFunction } from "@remix-run/node";
import { Outlet,  useLoaderData, useNavigate } from "@remix-run/react"
import axios from "axios";
import { requireAuthCookie } from "~/auth";
import { useState } from "react";
import { User } from "../provider.complete-profile/route";

export const API_BASE_URL = "http://localhost:8090";


type EncounterType = "in-person" | "telehealth"

type Encounter = {
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


export const  loader: LoaderFunction = async ({request}) => {
    const user =  await requireAuthCookie(request);
    try {
        const response = await axios.get(`${API_BASE_URL}/establishment/by-practitioner/${user.sub}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                return []; // User not found, return the user data to complete profile
            } else {
                return Response.json({ error: "Failed to fetch practitioner data" }, { status: error.response?.status || 500 });
            }
        } else {
            return Response.json({ error: "An unexpected error occurred" }, { status: 500 });
        }
    }
}

export default function EncountersPage() {

    const encounters = useLoaderData<Encounter[]>() || [];
    const navigate = useNavigate();


    const [selectedEncounterId, setSelectedEncounterId] = useState<string | null>(encounters && encounters.length > 0 ? encounters[0].chatId : null);

    const handleSelectEncounter = (encounter: Encounter) => {
        const encounterId = encounter.id;
        setSelectedEncounterId(encounterId);
        navigate(`${encounterId}/chat/${encounter.patientId}`);
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="flex-1 flex items-stretch justify-stretch">
                <div className="bg-white p-6 rounded-none shadow-md w-full max-w-5xl flex h-full m-auto">
                    {/* Left column: Chat list */}
                    <div className="w-1/3 border-r pr-4 overflow-y-auto">
                        <h2 className="text-lg font-bold mb-4">Active Patients</h2>
                        {encounters && encounters.length > 0 ? (
                            <ul>
                                {encounters.map((encounter) => (
                                    <li
                                        key={encounter.id}
                                        className={`mb-2 p-2 rounded cursor-pointer ${selectedEncounterId === encounter.id ? "bg-blue-100" : "hover:bg-gray-100"}`}
                                        onClick={() => handleSelectEncounter(encounter)}
                                    >
                                        <div className="font-medium">Patient: {encounter.patient?.name}</div>
                                        <div className="text-xs text-gray-500">Patient Id: {encounter.patientId}</div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-gray-500 mt-8 text-center">No active encounters</div>
                        )}
                    </div>
                    {/* Right column: Selected chat */}
                    <div className="w-2/3 pl-4 flex flex-col h-full">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}