import { LoaderFunction, useLoaderData, useParams } from "react-router";

import { useState } from "react";
import { healthConditionLoader } from "~/common-actions/health-condition";
import ErrorPage from "~/components/common/ErrorPage";
import AddHealthConditionModal from "../../components/common/health-condition/AddHealthConditionModal";
import { HealthConditionTable } from "../../components/common/health-condition/HealthConditionTable";
import { HealthCondition } from "../../components/common/health-condition/types";
import { User } from "../provider/complete-profile";

export const loader: LoaderFunction = healthConditionLoader;

export default function PatientHealthCondition() {
  const { healthConditions, error, baseUrl, user } = useLoaderData<{ user: User, healthConditions: HealthCondition[]; error: string; baseUrl: string }>();
  const [addModalOpen, setModalOpen] = useState(false);
  const { patientId } = useParams<{ patientId: string }>();
  if (error) {
    return <ErrorPage error={error} />;
  }
  return (
    <>
      <div className="flex justify-end mb-4">
        <button onClick={() => setModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded">
          Add Health Condition
        </button>
      </div>
      <AddHealthConditionModal patientId={patientId || ""} baseUrl={baseUrl} open={addModalOpen} onClose={() => setModalOpen(false)} practionerId={user.sub} />
      <HealthConditionTable healthConditions={healthConditions} />
    </>
  );
}
