import { LoaderFunction, redirect, useLoaderData } from "react-router";
import { AccountType, UserSignUp } from "../components/UserSignUp";

import { API_BASE_URL } from "~/api";
import { authCookie } from "~/auth";
import Card from "~/components/common/Card";
import { usePageTitle } from "~/hooks";

export type ApiError = {
  error: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = await authCookie.parse(request.headers.get("Cookie"));
  if (cookie) {
    return redirect("/login?account_type=practitioner", {});
  }
  return {
    baseUrl: API_BASE_URL, allowedAccountTypes: [
      { value: "practitioner", label: "Practitioner" },
      { value: "patient", label: "Patient" },
      { value: "pharmacist", label: "Pharmacist" }
    ]
  };
}


export default function UserSignUpPage() {
  usePageTitle("Sign Up as Provider - MedTok");
  const { baseUrl, allowedAccountTypes } = useLoaderData<{ baseUrl?: string, allowedAccountTypes: AccountType[] }>() || {};


  return (
    <div className="min-h-screen flex flex-col items-center justify-center  p-8">
      <Card>
        <UserSignUp title="Become a new MedTok member" baseUrl={baseUrl} allowedAccountTypes={allowedAccountTypes} />
      </Card>
    </div>
  );
}
