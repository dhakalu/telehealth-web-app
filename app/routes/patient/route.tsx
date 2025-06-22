import { LoaderFunction } from "react-router";
import { Outlet, redirect, useLoaderData } from "react-router";
import { requireAuthCookie } from "~/auth";
import AppHeader from "~/components/common/AppHeader";
import { User } from "../provider/complete-profile";

export const loader: LoaderFunction = async ({ request }) => {
  const user =  await requireAuthCookie(request);
  if (user.account_type !== "patient") {
    return redirect("/provider");
  }
 return user;
}

export default function NotFound() {
  const user = useLoaderData<User>();
  return (
    <>
    <AppHeader links={[
        {
          label: "Find Doctors",
          href: "/patient/find-doctors"
        },
        {
         label: "Help & Support",
         href: "/help"
        }
    ]}
    user={user}
    />
    <Outlet />
    </>
    );
}