import { LoaderFunction } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import { requireAuthCookie } from "~/auth";
import { User } from "../provider.complete-profile/route";

export const loader: LoaderFunction = async ({request}) => {
    const user = await requireAuthCookie(request);
    if (user.status === "incomplete") {
        return redirect("/provider/complete-profile");
    }
    return user;
}

export default function NotFound() {

    const user = useLoaderData<User>();
  return (
    <>{user?.sub}</>
    );
}