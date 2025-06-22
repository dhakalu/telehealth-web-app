import { LoaderFunction } from "react-router";
import { requireAuthCookie } from "~/auth";
import axios from "axios";
import { API_BASE_URL } from "~/api";
import { Immunization } from "../components/common/immunization/types";

export const immunizationLoader: LoaderFunction = async ({ request, params }) => {
  const user = await requireAuthCookie(request);
  const { patientId } = params;
  try {
    const url = `${API_BASE_URL}/patient/${patientId}/immunization`;
    const response = await axios.get(url);
    const immunizations = response.data as Immunization[];
    return {
      user,
      baseUrl: API_BASE_URL,
      immunizations,
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
