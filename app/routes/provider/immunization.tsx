import { LoaderFunction, useLoaderData, useParams } from "react-router";

import { useState } from "react";
import { immunizationLoader } from "~/common-actions/immunization";
import Button from "~/components/common/Button";
import ErrorPage from "~/components/common/ErrorPage";
import { Modal } from "~/components/common/Modal";
import { usePageTitle } from "~/hooks";
import AddImmunizationModal from "../../components/common/immunization/AddImmunizationForm";
import { ImmunizationTable } from "../../components/common/immunization/ImmunizationTable";
import { Immunization } from "../../components/common/immunization/types";

export const loader: LoaderFunction = immunizationLoader;

export default function PatientImmunization() {
  usePageTitle("Patient Immunizations - Provider - MedTok");
  const { immunizations, error, baseUrl } = useLoaderData<{ immunizations: Immunization[]; error: string; baseUrl: string }>();
  const [addModalOpen, setModalOpen] = useState(false);
  const { patientId } = useParams<{ patientId: string }>();


  const handleClose = () => setModalOpen(false)

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
        <AddImmunizationModal patientId={patientId || ""} baseUrl={baseUrl} onClose={handleClose} />
      </Modal>
      <ImmunizationTable immunizations={immunizations} />
    </>
  );
}
