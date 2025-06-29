import { LoaderFunction, useLoaderData, useParams, useRevalidator } from "react-router";

import { useState } from "react";
import { healthConditionLoader } from "~/common-actions/health-condition";
import Button from "~/components/common/Button";
import ErrorPage from "~/components/common/ErrorPage";
import { Modal } from "~/components/common/Modal";
import AddHealthConditionForm from "~/components/common/health-condition/AddHealthConditionForm";
import { usePageTitle } from "~/hooks";
import { HealthConditionTable } from "../../components/common/health-condition/HealthConditionTable";
import { HealthCondition } from "../../components/common/health-condition/types";
import { User } from "../provider/complete-profile";

export const loader: LoaderFunction = healthConditionLoader;

export default function PatientHealthCondition() {
  usePageTitle("Health Conditions - Patient - MedTok");

  const { healthConditions, error, baseUrl, user } = useLoaderData<{ user: User, healthConditions: HealthCondition[]; error: string; baseUrl: string }>();
  const [addModalOpen, setModalOpen] = useState(false);
  const { patientId } = useParams<{ patientId: string }>();
  const revalidator = useRevalidator();

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
          Add Health Condition
        </Button>
      </div>
      <Modal title="Add Health Condition" isOpen={addModalOpen} onClose={() => setModalOpen(false)}>
        <AddHealthConditionForm patientId={patientId || ""} baseUrl={baseUrl} practionerId={user.sub} onAdd={handleAddSuccess} />
      </Modal>
      <HealthConditionTable healthConditions={healthConditions} />
    </>
  );
}
