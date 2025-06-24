import { LoaderFunctionArgs } from "react-router";
import { requireAuthCookie } from "~/auth";
import axios from "axios";
import { API_BASE_URL } from "~/api";
import { HealthCondition } from "~/components/common/health-condition/types";

export async function healthConditionLoader({ request, params }: LoaderFunctionArgs) {
  const user = await requireAuthCookie(request);
  const { patientId } = params;
  try {
    const url = `${API_BASE_URL}/patient/${patientId}/health-condition`;
    const response = await axios.get(url);
    const healthConditions = response.data as HealthCondition[];
    return {
      user,
      baseUrl: API_BASE_URL,
      healthConditions,
    };
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error) && error.response) {
      return Response.json(
        error.response.data,
        { status: error.response.status }
      );
    } else {
      return Response.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}
