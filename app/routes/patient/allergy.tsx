import { LoaderFunction, useLoaderData } from "react-router";

import { loadAllergies } from "~/common-actions/allergy";
import ErrorPage from "~/components/common/ErrorPage";
import { AllergyTable } from "../../components/common/allergy/AllergyTable";
import { Allergy } from "../../components/common/allergy/types";

export const loader: LoaderFunction = loadAllergies();

export default function PatientAllergy() {
  const { allergies, error } = useLoaderData<{ allergies: Allergy[]; error: string; baseUrl: string }>();
  if (error) {
    return <ErrorPage error={error} />;
  }
  return (
    <>
      <AllergyTable allergies={allergies} />
    </>
  );
}
