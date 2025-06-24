import { createCookie, redirect } from "react-router";
import { User } from "./routes/provider/complete-profile";

const secret = process.env.COOKIE_SECRET || "default";
if (secret === "default") {
    console.warn(
        "COOKIE_SECRET is not set. Using a default secret for cookies, which is not secure for production."
    );
}


export const authCookie = createCookie("auth", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: ["secret"],
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60, // 1 hour
});

export const getAppPath = (request: Request) => {
    const url = new URL(request.url);  
    return url.pathname.split("/").filter(Boolean)[0];
}

export async function requireAuthCookie(request: Request) {
    const cookie = await authCookie.parse(request.headers.get("Cookie"));
    
    if (!cookie) {
        console.warn("No auth cookie found, redirecting to login.");
        throw redirect("/login", {
            headers: {
                "Set-Cookie": await authCookie.serialize("", {
                    maxAge: -1, // Expire the cookie
                }),
            },
        });
    }
    return JSON.parse(cookie) as User;
}