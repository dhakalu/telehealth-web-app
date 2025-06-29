import { LoaderFunction, useLoaderData, useParams, useRevalidator } from "react-router";

import { useState } from "react";
import { procedureLoader } from "~/common-actions/procedure";
import Button from "~/components/common/Button";
import ErrorPage from "~/components/common/ErrorPage";
import { Modal } from "~/components/common/Modal";
import AddProcedureForm from "~/components/common/procedures/AddProcedureForm";
import { ProcedureTable } from "~/components/common/procedures/ProcedureTable";
import { Procedure } from "~/components/common/procedures/types";
import { usePageTitle } from "~/hooks";

export const loader: LoaderFunction = procedureLoader;

export default function PatientProcedures() {
  usePageTitle("Patient Procedures - Provider - MedTok");

  const { procedures, error, baseUrl } = useLoaderData<{ procedures: Procedure[]; error: string; baseUrl: string }>();
  const [addModalOpen, setModalOpen] = useState(false);
  const { patientId } = useParams<{ patientId: string }>();
  const revalidator = useRevalidator();


  if (error) {
    return <ErrorPage error={error} />;
  }

  const handleModalClose = () => setModalOpen(false);

  const handleAddSuccess = () => {
    setModalOpen(false);
    revalidator.revalidate();
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setModalOpen(true)}>
          Add Procedure
        </Button>
      </div>
      <Modal title="Add procedure" isOpen={addModalOpen} onClose={handleModalClose}>
        <AddProcedureForm patientId={patientId || ""} baseUrl={baseUrl} onAdd={handleAddSuccess} />
      </Modal>
      <ProcedureTable procedures={procedures} />
    </>
  );
}
