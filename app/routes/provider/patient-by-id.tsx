import { LoaderFunction, Outlet } from "react-router";

import { Tab, TabNav } from "../../components/common/TabNav";
import { User } from "./complete-profile";

export const API_BASE_URL = "http://localhost:8090";


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


export const loader: LoaderFunction = async () => {
    // const { encounterId } = params; 
    // try {
    //     const response = await axios.get(`${API_BASE_URL}/encounter/${encounterId}`);
    //     return response.data;
    // } catch (error) {
    //     if (axios.isAxiosError(error)) {
    //         if (error.response?.status === 404) {
    //             return []; // User not found, return the user data to complete profile
    //         } else {
    //             return Response.json({ error: "Failed to fetch practitioner data" }, { status: error.response?.status || 500 });
    //         }
    //     } else {
    //         return Response.json({ error: "An unexpected error occurred" }, { status: 500 });
    //     }
    // }
    return {};
}

export default function EncountersPage() {

    // Define all tabs
    const tabs: Tab[] = [
        { to: "chat", label: "Chat" },
        { to: "qa", label: "Q&A" },
        { to: "health-condition", label: "Health Conditions" },
        { to: "procedure", label: "Procedures" },
        { to: "medication", label: "Medications" },
        { to: "allergy", label: "Allergies" },
        { to: "immunization", label: "Immunizations" },
        { to: "family-health-condition", label: "Family Health" },
        { to: "personal-health-condition", label: "Personal Health" },
        { to: "vital", label: "Vitals" },
        { to: "result", label: "Results" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="flex border-b bg-white overflow-x-auto no-scrollbar">
                <TabNav tabs={tabs} />
            </div>
            <div className="w3-container city">
                <Outlet />
            </div>
        </div>
    )
}