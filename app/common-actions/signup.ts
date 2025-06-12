import { ActionFunctionArgs, redirect } from "@remix-run/node";
import axios, { AxiosError } from "axios";
import { getAppPath } from "~/auth";
import { ApiError } from "~/routes/_auth.provider.signup";

export const signupAction = (accountType: "patient" | "provider") => {
    return async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  data["account_type"] = accountType;
  data["status"] = "incomplete";
  
  try {
    const response = await axios.post("http://localhost:8090/user", data);
    const user = response.data;
    const status = response.status;

    if (status !== 201 || !user || !user.sub) {
        return Response.json(
            { error: "Invalid username or password" },
            {
                status,
            }
        );
    }
    const appPath = getAppPath(request);
    return redirect(`${appPath}/login`);
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({error: (((error as AxiosError).response?.data) as ApiError)?.error || ""}, {
      status: (error  as AxiosError).response?.status || 500,
    });
  }    
}
}