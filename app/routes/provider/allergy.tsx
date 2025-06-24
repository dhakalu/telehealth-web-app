import { LoaderFunction, useLoaderData, useParams } from "react-router";

import { useState } from "react";
import { loadAllergies } from "~/common-actions/allergy";
import ErrorPage from "~/components/common/ErrorPage";
import AddAllergyModal from "../../components/common/allergy/AddAllergyModal";
import { AllergyTable } from "../../components/common/allergy/AllergyTable";
import { Allergy } from "../../components/common/allergy/types";

export const loader: LoaderFunction = loadAllergies();


export default function PatientAllergy() {
  const { allergies, error, baseUrl } = useLoaderData<{ allergies: Allergy[]; error: string; baseUrl: string }>();
  const [addModalOpen, setModalOpen] = useState(false);
  const { patientId } = useParams<{ patientId: string }>();
  if (error) {
    return <ErrorPage error={error} />;
  }
  return (
    <>
      <div className="flex justify-end mb-4">
        <button onClick={() => setModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded">
          Add Allergy
        </button>
      </div>
      <AddAllergyModal patientId={patientId || ""} baseUrl={baseUrl} open={addModalOpen} onClose={() => setModalOpen(false)} />
      <AllergyTable allergies={allergies} />
    </>
  );
}
