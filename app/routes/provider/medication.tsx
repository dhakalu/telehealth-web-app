import { LoaderFunction, useLoaderData, useParams } from "react-router";

import { useState } from "react";
import { medicationLoader } from "~/common-actions/medication";
import Button from "~/components/common/Button";
import ErrorPage from "~/components/common/ErrorPage";
import { Modal } from "~/components/common/Modal";
import { usePageTitle } from "~/hooks";
import AddMedicationForm from "../../components/common/medication/AddMedicationForm";
import { MedicationTable } from "../../components/common/medication/MedicationTable";
import { Medication } from "../../components/common/medication/types";


export const loader: LoaderFunction = medicationLoader;

export default function PatientMedication() {
  usePageTitle("Patient Medications - Provider - MedTok");
  const { medications, error, baseUrl } = useLoaderData<{ medications: Medication[], error: string, baseUrl: string }>();
  const [addModalOpen, setModalOpen] = useState(false);
  const { patientId } = useParams<{ patientId: string }>();

  const handleClose = () => setModalOpen(false)

  if (error) {
    return <ErrorPage error={error} />;
  }


  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setModalOpen(true)} >
          Add Medication
        </Button>
      </div>
      <Modal title="Add Medication" isOpen={addModalOpen} onClose={handleClose}>
        <AddMedicationForm patientId={patientId || ""} baseUrl={baseUrl} onClose={handleClose} />
      </Modal>
      <MedicationTable medications={medications} />
    </>
  );
}




