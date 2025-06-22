import { LoaderFunction } from "react-router";
import { useLoaderData, useParams } from "react-router";
import ErrorPage from "~/components/common/ErrorPage";
import { useState } from "react";
import { MedicationTable } from "../../components/common/medication/MedicationTable";
import { Medication } from "../../components/common/medication/types";
import AddMedicationModal from "../../components/common/medication/AddMedicationModal";
import { medicationLoader } from "~/common-actions/medication";


export const loader: LoaderFunction = medicationLoader;

export default function PatientMedication(){
  const { medications, error, baseUrl } = useLoaderData<{medications: Medication[], error: string, baseUrl: string}>();
  const [addModalOpen, setModalOpen] = useState(false);
  const { patientId } = useParams<{ patientId: string }>();
  if (error) {
    return <ErrorPage error={error} />;
  }
  return (
    <>
      <div className="flex justify-end mb-4">
      <button onClick={() => setModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded">
        Add Medication
      </button>
      </div>
      <AddMedicationModal patientId={patientId || ""} baseUrl={baseUrl} open={addModalOpen} onClose={() => setModalOpen(false)} />
      <MedicationTable medications={medications} />
    </>
  );
}




