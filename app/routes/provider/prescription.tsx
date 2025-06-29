import { LoaderFunction, useLoaderData, useParams, useRevalidator } from "react-router";

import axios from "axios";
import { useState } from "react";
import { loadPrescriptions } from "~/common-actions/prescription";
import Button from "~/components/common/Button";
import ErrorPage from "~/components/common/ErrorPage";
import { Modal } from "~/components/common/Modal";
import { PrescriptionForm, PrescriptionTable } from "~/components/prescription";
import { Prescription, PrescriptionWithDetails } from "~/components/prescription/types";
import { usePageTitle, useToast } from "~/hooks";
import { User } from "./complete-profile";

export const loader: LoaderFunction = loadPrescriptions();

export default function ProviderPrescription() {
    usePageTitle("Patient Prescriptions - Provider - MedTok");
    const { prescriptions, error, baseUrl, user } = useLoaderData<{
        prescriptions: PrescriptionWithDetails[];
        error: string;
        baseUrl: string;
        user: User;
    }>();
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
    const { patientId } = useParams<{ patientId: string }>();
    const revalidator = useRevalidator();
    const toast = useToast();

    const handleClose = () => {
        revalidator.revalidate();
        setAddModalOpen(false);
        setEditModalOpen(false);
        setSelectedPrescription(null);
    };

    const handleEdit = (prescription: Prescription) => {
        setSelectedPrescription(prescription);
        setEditModalOpen(true);
    };

    const handleDelete = async (prescriptionId: string) => {
        try {
            await axios.delete(`${baseUrl}/prescriptions/${prescriptionId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "X-Practitioner-ID": user?.sub || "",
                },
            });
            revalidator.revalidate();
        } catch {
            toast.error("Failed to cancel prescription");
        }
    };

    if (error) {
        return <ErrorPage error={error} />;
    }

    return (
        <>
            <div className="flex justify-end mb-4">
                <Button onClick={() => setAddModalOpen(true)}>
                    Add Prescription
                </Button>
            </div>

            <Modal title="Add Prescription" isOpen={addModalOpen} onClose={handleClose}>
                <PrescriptionForm
                    baseUrl={baseUrl}
                    patientId={patientId || ""}
                    practitionerId={user?.sub || ""}
                    onPrescriptionCreated={handleClose}
                    onCancel={handleClose}
                />
            </Modal>

            <Modal title="Edit Prescription" isOpen={editModalOpen} onClose={handleClose}>
                {selectedPrescription && (
                    <PrescriptionForm
                        baseUrl={baseUrl}
                        patientId={patientId || ""}
                        practitionerId={user?.sub || ""}
                        prescriptionId={selectedPrescription.id}
                        onPrescriptionUpdated={handleClose}
                        onCancel={handleClose}
                    />
                )}
            </Modal>

            <PrescriptionTable
                prescriptions={prescriptions}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </>
    );
}