import { LoaderFunction } from "@remix-run/node";
import { Outlet, redirect, useLoaderData } from "@remix-run/react";
import { requireAuthCookie } from "~/auth";
import AppHeader from "~/components/common/AppHeader";
import { User } from "../provider.complete-profile/route";

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
         label: "Home",
         href: "/patient"
        },
        {
            label: "Find Doctors",
            href: "/patient/find-doctors"
        }
    ]}
    user={user}
    />
    <Outlet />
    </>
    );
}