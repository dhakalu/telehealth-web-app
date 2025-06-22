import axios from "axios";
import { LoaderFunctionArgs } from "react-router";
import { API_BASE_URL } from "~/api";
import { requireAuthCookie } from "~/auth";
import { Allergy } from "~/components/common/allergy/types";

export const loadAllergies = () => async ({ request, params }: LoaderFunctionArgs) => {
  const user = await requireAuthCookie(request);
  const { patientId } = params;
  try {
    const url = `${API_BASE_URL}/patient/${patientId}/allergy`;
    const response = await axios.get(url);
    const allergies = response.data as Allergy[];
    return {
      user,
      baseUrl: API_BASE_URL,
      allergies,
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
};