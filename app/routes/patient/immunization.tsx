import { LoaderFunction } from "react-router";
import { useLoaderData, useParams } from "react-router";
import ErrorPage from "~/components/common/ErrorPage";
import { ImmunizationTable } from "../../components/common/immunization/ImmunizationTable";
import { Immunization } from "../../components/common/immunization/types";
import { immunizationLoader } from "~/common-actions/immunization";

export const loader: LoaderFunction = immunizationLoader;

export default function PatientImmunization() {
  const { immunizations, error, baseUrl } = useLoaderData<{ immunizations: Immunization[]; error: string; baseUrl: string }>();
  if (error) {
    return <ErrorPage error={error} />;
  }
  return (
      <ImmunizationTable immunizations={immunizations} />
  );
}
