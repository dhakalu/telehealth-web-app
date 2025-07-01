import { LoaderFunctionArgs, useLoaderData, useNavigate } from "react-router";
import { pharmacistApi } from "~/api/pharmacist";
import prescriptionApi, { Prescription } from "~/api/prescription";
import { requireAuthCookie } from "~/auth";
import { ErrorPage } from "~/components/common";
import { Pharmacist } from "~/components/pharmacist/types";
import { FulfillPrescriptionForm } from "~/components/prescription";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const loggedInUser = await requireAuthCookie(request);
    try {
        if (!params.prescriptionId) {
            return Response.json({
                error: "Prescription ID is required",
                status: 400
            });
        }

        const pharmacist = await pharmacistApi.getPharmacistById(loggedInUser.sub);
        const prescription = await prescriptionApi.getPrescriptionByNumber(params.prescriptionId);

        // Verify this prescription can be fulfilled
        if (prescription.status === 'filled') {
            return Response.json({
                error: "This prescription has already been filled",
                status: 400
            });
        }

        if (prescription.status === 'cancelled' || prescription.status === 'rejected') {
            return Response.json({
                error: "This prescription cannot be fulfilled due to its status",
                status: 400
            });
        }

        if (prescription.status === 'expired') {
            return Response.json({
                error: "This prescription has expired and cannot be fulfilled",
                status: 400
            });
        }

        return { prescription, pharmacist };
    } catch (error) {
        console.error("Error loading prescription for fulfillment:", error);
        return Response.json({
            error: "Failed to load prescription",
            status: 500
        });
    }
};

export default function FulfillPrescriptionPage() {
    const { prescription, error, pharmacist } = useLoaderData<{
        error?: string;
        prescription?: Prescription;
        pharmacist: Pharmacist;
    }>();

    const navigate = useNavigate();

    if (error) {
        return <ErrorPage error={error} />;
    }

    if (!prescription) {
        return <ErrorPage error="Prescription not found" />;
    }

    const handleFulfillmentCreated = () => {
        // Navigate back to prescription detail page after successful fulfillment
        navigate(`/pharmacist/prescriptions/${prescription.prescription_number}`, {
            replace: true,
        });
    };

    const handleCancel = () => {
        // Navigate back to prescription detail page if user cancels
        navigate(`/pharmacist/prescriptions/${prescription.prescription_number}`, {
            replace: true,
        });
    };


    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Fulfill Prescription</h1>
                <p className="text-base-content/70 mt-2">
                    Complete the fulfillment details for prescription #{prescription.prescription_number}
                </p>
            </div>

            <FulfillPrescriptionForm
                prescription={prescription}
                pharmacyId={prescription.pharmacy_id || ""}
                pharmacistId={pharmacist?.user_id}
                pharmacistLicenseNumber={pharmacist?.license_number}
                onFulfillmentCreated={handleFulfillmentCreated}
                onCancel={handleCancel}
            />
        </div>
    );
}
