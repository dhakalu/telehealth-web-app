import { LoaderFunction } from "react-router";
import { useLoaderData } from "react-router";
import ErrorPage from "~/components/common/ErrorPage";
import { Procedure } from "~/components/common/procedures/types";
import { ProcedureTable } from "~/components/common/procedures/ProcedureTable";
import { procedureLoader } from "~/common-actions/procedure";

export const loader: LoaderFunction = procedureLoader;

export default function PatientProcedures() {
  const { procedures, error } = useLoaderData<{ procedures: Procedure[]; error: string; baseUrl: string }>();
  if (error) {
    return <ErrorPage error={error} />;
  }
  return (
      <ProcedureTable procedures={procedures} />
  );
}
