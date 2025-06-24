import { LoaderFunction, Outlet, redirect, useLoaderData } from "react-router";
import { User } from "../provider/complete-profile";

import { requireAuthCookie } from "~/auth";
import ErrorPage from "~/components/common/ErrorPage";
import { Tab, TabNav } from "~/components/common/TabNav";
export { ErrorBoundary } from "~/root";



export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireAuthCookie(request);

  if (user.account_type !== "patient") {
    return redirect("/provider/patients");
  }
  return { user };
}


export default function PatientHome() {
  const { error } = useLoaderData<{ user: User, error: string }>();

  if (error) {
    return (
      <ErrorPage error={error} />
    );
  }
  const tabs: Tab[] = [
    { to: "health-condition", label: "Health Conditions" },
    { to: "procedure", label: "Procedures" },
    { to: "medication", label: "Medications" },
    { to: "allergy", label: "Allergies" },
    { to: "immunization", label: "Immunizations" },
    { to: "family-health-condition", label: "Family Health" },
    { to: "personal-health-condition", label: "Personal Health" },
    { to: "vital", label: "Vitals" },
    { to: "result", label: "Results" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex border-b bg-white overflow-x-auto no-scrollbar">
        <TabNav tabs={tabs} />
      </div>
      <div className="w3-container city">
        <Outlet />
      </div>
    </div>
  )
}
