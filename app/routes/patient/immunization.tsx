import { LoaderFunction, useLoaderData } from "react-router";

import { immunizationLoader } from "~/common-actions/immunization";
import ErrorPage from "~/components/common/ErrorPage";
import { usePageTitle } from "~/hooks";
import { ImmunizationTable } from "../../components/common/immunization/ImmunizationTable";
import { Immunization } from "../../components/common/immunization/types";

export const loader: LoaderFunction = immunizationLoader;

export default function PatientImmunization() {
  usePageTitle("Immunizations - Patient - MedTok");
  const { immunizations, error } = useLoaderData<{ immunizations: Immunization[]; error: string; baseUrl: string }>();
  if (error) {
    return <ErrorPage error={error} />;
  }
  return (
    <ImmunizationTable immunizations={immunizations} />
  );
}
