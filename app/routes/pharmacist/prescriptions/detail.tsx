import { LoaderFunctionArgs, useLoaderData } from "react-router";
import prescriptionApi, { Prescription } from "~/api/prescription";
import { ErrorPage } from "~/components/common";
import { PrescriptionDetail } from "~/components/prescription";


export const loader = async ({ params }: LoaderFunctionArgs) => {
    try {
        const prescription = await prescriptionApi.getPrescriptionByNumber(params.prescriptionId || "");
        return { prescription };
    } catch (error) {
        console.error("Error loading prescription detail:", error);
        return Response.json({ error: "Failed to load prescription detail", status: 500 });
    }
}


export default function PrescriptionDetailPage() {

    const { prescription, error } = useLoaderData<{ error: string; prescription: Prescription }>();

    if (error) {
        return <ErrorPage error={error} />;
    }
    return (<PrescriptionDetail canEdit canCancel prescription={prescription} />)
}