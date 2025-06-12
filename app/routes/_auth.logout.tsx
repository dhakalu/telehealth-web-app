import { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import { authCookie } from "~/auth";


export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const appPath = url.searchParams.get("appPath") || "";
    throw redirect(`/${appPath}/login`, {
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

