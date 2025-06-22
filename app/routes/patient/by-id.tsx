import { Outlet, useLoaderData } from "react-router";
import { User } from "../provider/complete-profile";
import { LoaderFunction, redirect } from "react-router";
import { requireAuthCookie } from "~/auth";
import axios from "axios";
import ErrorPage from "~/components/common/ErrorPage";
import { Tab, TabNav } from "~/components/common/TabNav";


export const loader: LoaderFunction = async ({ request }) => {
  const user =  await requireAuthCookie(request);

  if (user.account_type !== "patient") {
    return redirect("/provider/patients");
  }

  try {
    const response = axios.get(`${process.env.API_BASE_URL}/patient/${user.sub}`);
    user.status = (await response).data.status;
    if (user.status === "incomplete") {
      return redirect("/patient/complete-profile");
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        return redirect("/patient/complete-profile");
      }
      return {error: error.response.data.error || "Failed to fetch user data"};
    }
    console.error("Error fetching user data:", error);
    return {error: "Failed to fetch user data"};
  }
  return {user};
}


export default function PatientHome() {
  const {user, error} = useLoaderData<{user: User, error: string}>();

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
