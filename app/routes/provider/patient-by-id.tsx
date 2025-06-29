import { LoaderFunction, Outlet } from "react-router";

import { usePageTitle } from "~/hooks";
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
    return {};
}

export default function EncountersPage() {

    usePageTitle("Patient Encounters - Provider - MedTok");

    // Define all tabs
    const tabs: Tab[] = [
        { to: "chat", label: "Chat" },
        { to: "prescription", label: "Prescriptions" },
        { to: "health-condition", label: "Health Conditions" },
        { to: "procedure", label: "Procedures" },
        { to: "medication", label: "Medications" },
        { to: "allergy", label: "Allergies" },
        { to: "immunization", label: "Immunizations" },
        { to: "family-health-condition", label: "Family Health" },
        { to: "vital", label: "Vitals" },
        { to: "result", label: "Results" },
    ];

    return (
        <div className="min-h-screen  flex flex-col">
            <div className="flex overflow-x-auto no-scrollbar">
                <TabNav tabs={tabs} />
            </div>
            <div className="bg-base-100 border-base-300">
                <Outlet />
            </div>
        </div>
    )
}