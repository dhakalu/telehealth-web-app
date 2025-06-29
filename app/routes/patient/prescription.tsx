import { LoaderFunction, useLoaderData } from "react-router";

import { loadPrescriptions } from "~/common-actions/prescription";
import ErrorPage from "~/components/common/ErrorPage";
import { PrescriptionTable } from "~/components/prescription";
import { PrescriptionWithDetails } from "~/components/prescription/types";
import { usePageTitle } from "~/hooks";

export const loader: LoaderFunction = loadPrescriptions();

export default function PatientPrescriptions() {
    usePageTitle("Prescriptions");

    const { prescriptions, error } = useLoaderData<{ prescriptions: PrescriptionWithDetails[]; error: string; baseUrl: string }>();

    if (error) {
        return <ErrorPage error={error} />;
    }

    return (
        <>
            <PrescriptionTable prescriptions={prescriptions} />
        </>
    );
}