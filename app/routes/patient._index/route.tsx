import { useLoaderData } from "@remix-run/react";
import { User } from "../provider.complete-profile/route";
import { LoaderFunction, redirect } from "@remix-run/node";
import { requireAuthCookie } from "~/auth";
import axios from "axios";


export const loader: LoaderFunction = async ({ request }) => {
  const user =  await requireAuthCookie(request);

  try {
    const response = axios.get(`${process.env.API_BASE_URL}/patient/${user.sub}`);
    user.status = (await response).data.status;
    if (user.status === "incomplete") {
      return redirect("/patient/complete-profile");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {error: "Failed to fetch user data"};
  }
  return {user};
}


export default function PatientHome() {
  const {user, error} = useLoaderData<{user: User, error: string}>();

  if (error) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-red-100 text-red-800 rounded shadow mt-10">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p>{error}</p>
      </div>
    );
  }
  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user.given_name}!</h2>
      <div className="space-y-2 mb-6">
        <div><strong>User ID:</strong> {user.sub || 'none'}</div>
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>Full Name:</strong> {user.name}</div>
        <div><strong>First Name:</strong> {user.given_name}</div>
        <div><strong>Last Name:</strong> {user.family_name}</div>
        <div><strong>Gender:</strong> {user.gender}</div>
        <div><strong>Birthdate:</strong> {user.birthdate}</div>
        <div><strong>Phone Number:</strong> {user.phone_number}</div>
      </div>
      <div className="flex gap-4">
        <button
          className="btn btn-primary px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => window.location.href = "/patient/find-doctors"}
        >
          Find Doctors
        </button>
      </div>
    </div>
  );
}
