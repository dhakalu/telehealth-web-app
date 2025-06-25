import { LoaderFunction, Outlet, redirect, useLoaderData } from "react-router";
import { User } from "../provider/complete-profile";

import { requireAuthCookie } from "~/auth";
import ErrorPage from "~/components/common/ErrorPage";
import PageHeader from "~/components/common/PageHeader";
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
    <div className="min-h-screen flex flex-col px-10">
      <PageHeader
        title="My Health"
        description="Below is your comprehensive medical history"
      />
      <div className="flex border-b  overflow-x-auto no-scrollbar">
        <TabNav tabs={tabs} />
      </div>
      <div className="bg-base-100">
        <Outlet />
      </div>
    </div>
  )
}
