import { LoaderFunction, redirect, useActionData } from "react-router";
import { UserSignUp } from "../components/UserSignUp";

import { authCookie } from "~/auth";
import { signupAction } from "~/common-actions/signup";

export type ApiError = {
  error: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = await authCookie.parse(request.headers.get("Cookie"));
  if (cookie) {
    return redirect("/login?account_type=practitioner", {});
  }
  return null;
}

export const action = signupAction();

export default function UserSignUpPage() {
  const { error } = useActionData<{ error?: string }>() || {};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <UserSignUp error={error!} />
    </div>
  );
}
