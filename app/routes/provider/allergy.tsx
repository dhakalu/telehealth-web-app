import { LoaderFunction, useLoaderData, useParams, useRevalidator } from "react-router";

import { useState } from "react";
import { loadAllergies } from "~/common-actions/allergy";
import Button from "~/components/common/Button";
import ErrorPage from "~/components/common/ErrorPage";
import { Modal } from "~/components/common/Modal";
import { usePageTitle } from "~/hooks";
import AddAllergyForm from "../../components/common/allergy/AddAllergyForm";
import { AllergyTable } from "../../components/common/allergy/AllergyTable";
import { Allergy } from "../../components/common/allergy/types";

export const loader: LoaderFunction = loadAllergies();


export default function PatientAllergy() {
  usePageTitle("Patient Allergies - Provider - MedTok");
  const { allergies, error, baseUrl } = useLoaderData<{ allergies: Allergy[]; error: string; baseUrl: string }>();
  const [addModalOpen, setModalOpen] = useState(false);
  const { patientId } = useParams<{ patientId: string }>();
  const revalidator = useRevalidator();

  const handleClose = () => {
    revalidator.revalidate();
    setModalOpen(false);
  }

  if (error) {
    return <ErrorPage error={error} />;
  }
  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setModalOpen(true)}>
          Add Allergy
        </Button>
      </div>
      <Modal title="Add Allergy" isOpen={addModalOpen} onClose={handleClose}>
        <AddAllergyForm patientId={patientId || ""} baseUrl={baseUrl} onSubmitSuccess={handleClose} />
      </Modal>
      <AllergyTable allergies={allergies} />
    </>
  );
}
