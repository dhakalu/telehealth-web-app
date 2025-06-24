import { LoaderFunction, useLoaderData } from "react-router";

import { procedureLoader } from "~/common-actions/procedure";
import ErrorPage from "~/components/common/ErrorPage";
import { ProcedureTable } from "~/components/common/procedures/ProcedureTable";
import { Procedure } from "~/components/common/procedures/types";

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
