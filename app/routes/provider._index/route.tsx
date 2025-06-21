import { LoaderFunction } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import { requireAuthCookie } from "~/auth";
import axios from "axios";

export const loader: LoaderFunction = async ({request}) => {
     const user =  await requireAuthCookie(request);

     if (user.account_type === "patient") {
        return redirect("/patient/find-doctors");
     }

  try {
    const response = axios.get(`${process.env.API_BASE_URL}/practitioner/${user.sub}`);
    user.status = (await response).data.status;
    if (user.status === "incomplete") {
      return redirect("/provider/complete-profile");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {error: "Failed to fetch user data"};
  }
  return redirect("/provider/establishment")
}

export default function NotFound() {

    const {error} = useLoaderData<{error: string}>();

    if (error) {
        return (
            <div className="max-w-xl mx-auto p-8 bg-red-100 text-red-800 rounded shadow mt-10">
                <h2 className="text-2xl font-bold mb-4">Error</h2>
                <p>{error}</p>
            </div>
        );
    }
    return null;
}