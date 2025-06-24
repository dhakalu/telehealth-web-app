import { LoaderFunction, useLoaderData, useParams } from "react-router";

import { useState } from "react";
import { immunizationLoader } from "~/common-actions/immunization";
import ErrorPage from "~/components/common/ErrorPage";
import AddImmunizationModal from "../../components/common/immunization/AddImmunizationModal";
import { ImmunizationTable } from "../../components/common/immunization/ImmunizationTable";
import { Immunization } from "../../components/common/immunization/types";

export const loader: LoaderFunction = immunizationLoader;

export default function PatientImmunization() {
  const { immunizations, error, baseUrl } = useLoaderData<{ immunizations: Immunization[]; error: string; baseUrl: string }>();
  const [addModalOpen, setModalOpen] = useState(false);
  const { patientId } = useParams<{ patientId: string }>();
  if (error) {
    return <ErrorPage error={error} />;
  }
  return (
    <>
      <div className="flex justify-end mb-4">
        <button onClick={() => setModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded">
          Add Immunization
        </button>
      </div>
      <AddImmunizationModal patientId={patientId || ""} baseUrl={baseUrl} open={addModalOpen} onClose={() => setModalOpen(false)} />
      <ImmunizationTable immunizations={immunizations} />
    </>
  );
}
