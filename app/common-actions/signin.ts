import axios, { AxiosError } from "axios";
import { ActionFunctionArgs, redirect } from "react-router";
import { API_BASE_URL } from "~/api";
import { authCookie } from "~/auth";
import { ApiError } from "~/routes/_auth.provider.signup";

export const accountTypePathsMap: Record<string, string> = {
  patient: "/patient",
  practitioner: "/provider",
  support: "/support",
  pharmacist: "/pharmacist",
  "facility-admin": "/admin",
}

export const signInAction = () => async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
    });
    console.log("Login response:", response.data);
    const user = response.data;
    const status = response.status;
    if (!user || !user.sub) {
      return Response.json({ error: "Invalid username or passwrod" }, {
        status,
      });
    }
    if (user.status === "created") {
      return Response.json({ error: "Account not activated" }, {
        status: 401,
      });
    }
    const redirectPath = accountTypePathsMap[user.account_type] || "/404";
    // localStorage.setItem("API_BASE_URL", API_BASE_URL || "");
    return redirect(redirectPath, {
      headers: {
        "Set-Cookie": await authCookie.serialize(JSON.stringify(user))
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ error: ((error as AxiosError).response?.data as ApiError)?.error || "Unexpected error occurred. Please try again later." }, {
      status: (error as AxiosError).response?.status || 500,
    });
  }
}