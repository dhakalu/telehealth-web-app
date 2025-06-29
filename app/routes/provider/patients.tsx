import { LoaderFunction, Outlet, useLoaderData, useNavigate, useRevalidator } from "react-router";

import axios from "axios";
import { useState } from "react";
import { API_BASE_URL } from "~/api";
import { requireAuthCookie } from "~/auth";
import ErrorPage from "~/components/common/ErrorPage";
import EstablishmentList, { EncounterSummary } from "~/components/provider/EncountersList";
import { usePageTitle } from "~/hooks";

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
    patientFirstName: string
    patientLastName: string
    patientMiddleName?: string | null;
}




export const loader: LoaderFunction = async ({ request }) => {
    const user = await requireAuthCookie(request);
    try {
        const response = await axios.get(`${API_BASE_URL}/encounter/search`, {
            params: {
                providerId: user.sub,
                status: "open" // Assuming you want to fetch only active encounters
            }
        });
        return { encounterSummaries: response.data, baseUrl: API_BASE_URL, error: null };
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
    usePageTitle("Patients - Provider - MedTok");

    const { encounterSummaries, error, baseUrl } = useLoaderData<{ encounterSummaries: EncounterSummary[], error: string, baseUrl: string }>() || [];
    const navigate = useNavigate();
    const revalidator = useRevalidator();


    const [selectedEncounterId, setSelectedEstablishmentId] = useState<string | null>(encounterSummaries && encounterSummaries.length > 0 ? encounterSummaries[0].id : null);

    const handleSelectEestablishment = (establishment: EncounterSummary) => {
        const establishmentId = establishment.id;
        setSelectedEstablishmentId(establishmentId);
        navigate(`${establishment.patientId}/chat`);
    }

    const handleComplete = (establishmentId: string) => {
        // Refresh the loader data to get updated establishments list
        revalidator.revalidate();

        // If the completed establishment was selected, clear the selection
        if (selectedEncounterId === establishmentId) {
            setSelectedEstablishmentId(null);
        }
    };

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
                        <EstablishmentList
                            encounterSummaries={encounterSummaries}
                            onSelect={handleSelectEestablishment}
                            selectedEncounterId={selectedEncounterId}
                            baseUrl={baseUrl}
                            onComplete={handleComplete}
                        />
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