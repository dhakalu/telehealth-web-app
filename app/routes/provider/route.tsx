import { LoaderFunction, Outlet, useLoaderData } from "react-router";

// Update the import path below to the correct location of requireAuthCookie
import { requireAuthCookie } from "~/auth"; // or "./auth" or the actual relative path
import AppHeader from "~/components/common/AppHeader";
import { User } from "./complete-profile";

export const loader: LoaderFunction = async ({ request }) => {
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
              label: "Help & Support",
              href: "/help"
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