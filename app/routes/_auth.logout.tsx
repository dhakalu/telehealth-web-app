import { LoaderFunction } from "react-router";
import { redirect } from "react-router";
import { authCookie } from "~/auth";


export const loader: LoaderFunction = async () => {
    throw redirect("/login", {
        headers: {
            "Set-Cookie": await authCookie.serialize("", {
                maxAge: -1, // Expire the cookie
            }),
        },
    });
}

export default function LogoutPage() {
    // This page is just a redirect, no UI needed
    return null;
}

