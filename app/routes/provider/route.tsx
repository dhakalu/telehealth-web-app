import { LoaderFunction, Outlet, redirect, useLoaderData } from "react-router";

// Update the import path below to the correct location of requireAuthCookie
import { userApi } from "~/api/users";
import { requireAuthCookie } from "~/auth"; // or "./auth" or the actual relative path
import { accountTypePathsMap } from "~/common-actions/signin";
import { ProviderHeader } from "~/components/provider/ProviderAppHeader";
import { User } from "./complete-profile";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireAuthCookie(request);

  if (user.account_type !== "practitioner") {
    return redirect(accountTypePathsMap[user.account_type || ""] || "/");
  }
  const pathname = new URL(request.url).pathname;
  const completeProfilePath = "/provider/complete-profile";
  const accountStatusPath = "/provider/account-status";
  const isUserInCompletePath = pathname === completeProfilePath;
  const isStatusPage = pathname === accountStatusPath;

  try {
    const userData = await userApi.getUserById(user.sub);
    user.status = userData.status;
    if (user.status === "email-verified" && !isUserInCompletePath) {
      return redirect(completeProfilePath);
    }

    if (user.status !== "complete" && !isUserInCompletePath && !isStatusPage) {
      return redirect(accountStatusPath);
    }

  } catch (error) {
    console.error("Error fetching user data:", error);
    if (!isUserInCompletePath) {
      return redirect(completeProfilePath);
    }
    return Response.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
  return user;
}


export default function ProviderAppLayout() {
  const user = useLoaderData<User>();
  return (
    <div className="flex flex-col h-screen">
      <header className="h-50">
        <ProviderHeader user={user} />
      </header>
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}