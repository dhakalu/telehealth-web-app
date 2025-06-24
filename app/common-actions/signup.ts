import { ActionFunctionArgs, redirect } from "react-router";
import axios, { AxiosError } from "axios";
import { ApiError } from "~/routes/_auth.provider.signup";
import { API_BASE_URL } from "~/api";

export const signupAction = () => {
    return async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  data["status"] = "incomplete";
  
  try {
    const response = await axios.post(`${API_BASE_URL}/user`, data);
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
    return redirect("/login");
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({error: (((error as AxiosError).response?.data) as ApiError)?.error || ""}, {
      status: (error  as AxiosError).response?.status || 500,
    });
  }    
}
}