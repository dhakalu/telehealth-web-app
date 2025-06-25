import { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router';
import ErrorPage from '~/components/common/ErrorPage';
import EstablishmentList, { Establishment } from '~/components/provider/EstablishmentList';

export { loader } from './patients';

export default function PatientList() {
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
        <div>
            <div className="hidden lg:block p-10">Select a patient to view details</div>
            <div className="lg:hidden">
                <EstablishmentList selectedEstablishmentId={selectedEstablishmentId} onSelect={handleSelectEestablishment} establishments={establishments} />
            </div>
        </div>
    )
}