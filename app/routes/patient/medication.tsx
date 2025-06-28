import { LoaderFunction, useLoaderData } from "react-router";

import { medicationLoader } from "~/common-actions/medication";
import ErrorPage from "~/components/common/ErrorPage";
import { usePageTitle } from "~/hooks";
import { MedicationTable } from "../../components/common/medication/MedicationTable";
import { Medication } from "../../components/common/medication/types";


export const loader: LoaderFunction = medicationLoader;

export default function PatientMedication() {
  usePageTitle("Medications - Patient - MedTok");
  const { medications, error } = useLoaderData<{ medications: Medication[], error: string }>();
  if (error) {
    return <ErrorPage error={error} />;
  }
  return (
    <MedicationTable medications={medications} />
  );
}




