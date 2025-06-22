import { UserLogin } from "../components/UserLogin";
import { LoaderFunction, redirect } from "react-router";
import { authCookie } from "~/auth";
import { useActionData, useNavigation } from "react-router";
import { signInAction } from "~/common-actions/signin";
import { User } from "./provider/complete-profile";

export const loader: LoaderFunction = async ({ request }) => {
  const cookie =  await authCookie.parse(request.headers.get("Cookie"));
  if (cookie) {
    const user = JSON.parse(cookie) as User;
    const appPath = user.account_type === "patient" ? "/patient" : "/provider"
    return redirect(appPath)
  }
  return null;
}

export const action = signInAction();

export default function UserLoginPage() {
  const { error } = useActionData<{error: string}>() || {};
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <UserLogin signupUrl="/provider/signup"  error={error} isLoading={isSubmitting} />
    </div>
  );
}
