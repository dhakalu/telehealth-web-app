import { LoaderFunction, redirect, useActionData, useNavigation } from "react-router";
import { UserSignUp } from "../components/UserSignUp";

import { authCookie } from "~/auth";
import { signupAction } from "~/common-actions/signup";
import Card from "~/components/common/Card";

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

  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen flex items-center justify-center  p-8">
      <Card>
        <UserSignUp error={error!} isSubmitting={isSubmitting} />
      </Card>
    </div>
  );
}
