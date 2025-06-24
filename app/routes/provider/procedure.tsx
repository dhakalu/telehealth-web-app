import { LoaderFunction, useLoaderData, useParams } from "react-router";

import { useState } from "react";
import { procedureLoader } from "~/common-actions/procedure";
import ErrorPage from "~/components/common/ErrorPage";
import AddProcedureModal from "~/components/common/procedures/AddProcedureModal";
import { ProcedureTable } from "~/components/common/procedures/ProcedureTable";
import { Procedure } from "~/components/common/procedures/types";

export const loader: LoaderFunction = procedureLoader;

export default function PatientProcedures() {
  const { procedures, error, baseUrl } = useLoaderData<{ procedures: Procedure[]; error: string; baseUrl: string }>();
  const [addModalOpen, setModalOpen] = useState(false);
  const { patientId } = useParams<{ patientId: string }>();
  if (error) {
    return <ErrorPage error={error} />;
  }
  return (
    <>
      <div className="flex justify-end mb-4">
        <button onClick={() => setModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded">
          Add Procedure
        </button>
      </div>
      <AddProcedureModal patientId={patientId || ""} baseUrl={baseUrl} open={addModalOpen} onClose={() => setModalOpen(false)} />
      <ProcedureTable procedures={procedures} />
    </>
  );
}
