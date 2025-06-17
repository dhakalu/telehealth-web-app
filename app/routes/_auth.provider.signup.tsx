import { UserSignUp } from "../components/UserSignUp";
import { redirect, useActionData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { authCookie, getAppPath } from "~/auth";
import { signupAction } from "~/common-actions/signup";

export type ApiError = {
  error: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookie =  await authCookie.parse(request.headers.get("Cookie"));
  if (cookie) {
    const appPath = getAppPath(request);
    return redirect(appPath);
  }
  return null;
}

export const action = signupAction("practitioner");

export default function UserSignUpPage() {
  const { error } = useActionData<{error?: string}>() || {};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <UserSignUp type={"practitioner"} error={error!} />
    </div>
  );
}
