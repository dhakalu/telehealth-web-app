import { useLoaderData } from "react-router";
import { healthConditionLoader } from "~/common-actions/health-condition";
import ErrorPage from "~/components/common/ErrorPage";
import { usePageTitle } from "~/hooks";
import { HealthConditionTable } from "../../components/common/health-condition/HealthConditionTable";
import { HealthCondition } from "../../components/common/health-condition/types";
import { User } from "../provider/complete-profile";

export const loader = healthConditionLoader;

export default function PatientHealthCondition() {
  usePageTitle("Health Conditions - Patient - MedTok");
  const { healthConditions, error } = useLoaderData<{ user: User, healthConditions: HealthCondition[]; error: string; baseUrl: string }>();
  if (error) {
    return <ErrorPage error={error} />;
  }
  return (
    <>
      <HealthConditionTable healthConditions={healthConditions} />
    </>
  );
}
