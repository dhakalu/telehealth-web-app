import { ActionFunctionArgs, redirect } from "@remix-run/node";
import axios, { AxiosError } from "axios";
import { authCookie } from "~/auth";
import { ApiError } from "~/routes/_auth.provider.signup";

export const signInAction = () => async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  try {
    const response = await axios.post("http://localhost:8090/login", {
        email,
    });
    console.log("Login response:", response.data);
    const user = response.data;
    const status = response.status;
    if (!user || !user.sub) {
        return Response.json({error: "Invalid username or passwrod"}, {
            status,
        });
    }
    const appPath = user.account_type == "patient" ? "/patient" : "/provider"
    return redirect(appPath, {
        headers: {
            "Set-Cookie": await authCookie.serialize(JSON.stringify(user))
        }
    });
  } catch (error) {
    console.error("Login error:", error);
    return  Response.json({error: ((error as AxiosError).response?.data as ApiError)?.error || ""}, {
      status: (error  as AxiosError).response?.status || 500,
    });
  }
}