import { LoaderFunction } from "@remix-run/node";
import { Outlet, redirect, useLoaderData } from "@remix-run/react";
import { requireAuthCookie } from "~/auth";
import AppHeader from "~/components/common/AppHeader";
import { User } from "../provider.complete-profile/route";

export const loader: LoaderFunction = async ({request}) => {
    const user = await requireAuthCookie(request);
    return user;
}

export default function NotFound() {
  const user = useLoaderData<User>();
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex-[1_0_10%]">
        <AppHeader 
          links={[
            {
              label: "Home",
              href: "/provider"
            },
            {
                label: "View Patients",
                href: "/provider/establishment"
            }
          ]} 
          user={user}
        />
      </header>
      <div className="flex-auto  overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}