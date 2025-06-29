import { useState } from 'react';
import { useLoaderData, useNavigate, useRevalidator } from 'react-router';
import ErrorPage from '~/components/common/ErrorPage';
import EstablishmentList, { EncounterSummary } from '~/components/provider/EncountersList';
import { usePageTitle } from '~/hooks';

export { loader } from './patients';

export default function PatientList() {

    usePageTitle("Patients - Provider - MedTok");

    const { encounterSummaries, error, baseUrl } = useLoaderData<{ encounterSummaries: EncounterSummary[], error: string, baseUrl: string }>() || [];
    const navigate = useNavigate();
    const revalidator = useRevalidator();


    const [selectedEncounterId, setSelectedEncounterId] = useState<string | null>(encounterSummaries && encounterSummaries.length > 0 ? encounterSummaries[0].id : null);

    const handleSelectEncounter = (encounter: EncounterSummary) => {
        const encounterId = encounter.id;
        setSelectedEncounterId(encounterId);
        navigate(`${encounter.patientId}/chat`);
    }

    const handleComplete = (encounterId: string) => {
        // Refresh the loader data to get updated encounters list
        revalidator.revalidate();

        // If the completed encounter was selected, clear the selection
        if (selectedEncounterId === encounterId) {
            setSelectedEncounterId(null);
        }
    };

    if (error) {
        return (
            <ErrorPage error={error} />
        );
    }
    return (
        <div>
            <div className="hidden lg:block p-10">Select a patient to view details</div>
            <div className="lg:hidden">
                <EstablishmentList onSelect={handleSelectEncounter} onComplete={handleComplete} baseUrl={baseUrl} selectedEncounterId={selectedEncounterId} encounterSummaries={encounterSummaries} />
            </div>
        </div>
    )
}