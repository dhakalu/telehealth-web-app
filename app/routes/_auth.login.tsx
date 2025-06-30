import { LoaderFunction, redirect } from "react-router";
import { authCookie } from "~/auth";
import { UserLogin } from "../components/UserLogin";

import { accountTypePathsMap, signInAction } from "~/common-actions/signin";
import Card from "~/components/common/Card";
import { User } from "./provider/complete-profile";

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = await authCookie.parse(request.headers.get("Cookie"));
  if (cookie) {
    const user = JSON.parse(cookie) as User;
    const appPath = accountTypePathsMap[user?.account_type || ""] || "/404";
    return redirect(appPath)
  }
  return null;
}

export const action = signInAction();

export default function UserLoginPage() {

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <Card>
        <header className="flex flex-col items-center gap-9">
          <img
            src="/logo.png"
            alt="MedTok Logo"
            className="h-24 w-24 rounded-full shadow-lg"
          />
          <h1 className="leading text-2xl font-bold">
            Login to MedTok
          </h1>
        </header>
        <UserLogin />
      </Card>
    </div>
  );
}
