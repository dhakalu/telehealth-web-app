import { LoaderFunction, useLoaderData, useParams, useRevalidator } from "react-router";

import { useState } from "react";
import { immunizationLoader } from "~/common-actions/immunization";
import Button from "~/components/common/Button";
import ErrorPage from "~/components/common/ErrorPage";
import { Modal } from "~/components/common/Modal";
import { usePageTitle } from "~/hooks";
import AddImmunizationForm from "../../components/common/immunization/AddImmunizationForm";
import { ImmunizationTable } from "../../components/common/immunization/ImmunizationTable";
import { Immunization } from "../../components/common/immunization/types";

export const loader: LoaderFunction = immunizationLoader;

export default function PatientImmunization() {
  usePageTitle("Patient Immunizations - Provider - MedTok");
  const { immunizations, error, baseUrl } = useLoaderData<{ immunizations: Immunization[]; error: string; baseUrl: string }>();
  const [addModalOpen, setModalOpen] = useState(false);
  const { patientId } = useParams<{ patientId: string }>();
  const revalidator = useRevalidator();


  const handleClose = () => setModalOpen(false)

  const handleAddSuccess = () => {
    setModalOpen(false);
    revalidator.revalidate();
  };

  if (error) {
    return <ErrorPage error={error} />;
  }
  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setModalOpen(true)}>
          Add Immunization
        </Button>
      </div>
      <Modal title="Add Immunization" isOpen={addModalOpen} onClose={handleClose}>
        <AddImmunizationForm patientId={patientId || ""} baseUrl={baseUrl} onAdd={handleAddSuccess} />
      </Modal>
      <ImmunizationTable immunizations={immunizations} />
    </>
  );
}
