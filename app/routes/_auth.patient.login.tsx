import React, { useState } from "react";
import { UserLogin } from "../components/UserLogin";
import { LoaderFunction, redirect } from "@remix-run/node";
import { authCookie, getAppPath } from "~/auth";
import { useActionData } from "@remix-run/react";
import { signInAction } from "~/common-actions/signin";

export const loader: LoaderFunction = async ({ request }) => {
  const cookie =  await authCookie.parse(request.headers.get("Cookie"));
  if (cookie) {
    const appPath = getAppPath(request);
    return redirect(`/${appPath}`);
  }
  return null;
}

export const action = signInAction("patient");

export default function UserLoginPage() {
  const { error } = useActionData<{error: string}>() || {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <UserLogin signupUrl="/patient/signup"  error={error} />
    </div>
  );
}
