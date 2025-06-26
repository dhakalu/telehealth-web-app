import { LoaderFunction, Outlet, redirect, useLoaderData } from "react-router";

import axios from "axios";
import { requireAuthCookie } from "~/auth";
import { PatientAppHeader } from "~/components/patient/PatientAppHeader";
import { User } from "../provider/complete-profile";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireAuthCookie(request);
  if (user.account_type !== "patient") {
    return redirect("/provider");
  }
  try {
    const response = axios.get(`${process.env.API_BASE_URL}/patient/${user.sub}`);
    user.status = (await response).data.status;
    if (user.status === "email-verified") {
      return redirect("/patient/complete-profile");
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        return redirect("/patient/complete-profile");
      }
      return { error: error.response.data.error || "Failed to fetch user data" };
    }
    console.error("Error fetching user data:", error);
    return { error: "Failed to fetch user data" };
  }
  return user;
}

export default function NotFound() {
  const user = useLoaderData<User>();
  return (
    <div className="flex flex-col h-screen">
      <div className="h-50">
        <PatientAppHeader user={user} />
      </div>
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}