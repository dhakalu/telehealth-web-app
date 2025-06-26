import { LoaderFunction, Outlet, useLoaderData } from "react-router";

// Update the import path below to the correct location of requireAuthCookie
import { requireAuthCookie } from "~/auth"; // or "./auth" or the actual relative path
import { ProviderHeader } from "~/components/provider/ProviderAppHeader";
import { User } from "./complete-profile";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireAuthCookie(request);
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