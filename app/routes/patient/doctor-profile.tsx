import { LoaderFunctionArgs, useLoaderData } from "react-router";

import axios from "axios";
import { API_BASE_URL } from "~/api";
import ErrorPage from "~/components/common/ErrorPage";
import { usePageTitle } from "~/hooks";
import { DoctorDetail, FHIRPractitioner } from "../../components/DoctorDetail";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { doctorId } = params;
  if (!doctorId) throw new Response("Doctor ID required", { status: 400 });
  let res;
  try {
    res = await axios.get(`${API_BASE_URL}/practitioner/${doctorId}`);
    return {
      data: res.data
    };
  } catch (error) {
    let status = 500;
    let message = "Failed to fetch doctor details"
    if (axios.isAxiosError(error) && error.response) {
      status = error.response.status;
      if (error.response.data && error.response.data.message) {
        message = error.response.data.message;
      }
    }
    return Response.json({ error: message }, { status });
  }
};

export default function DoctorDetailRoute() {
  usePageTitle("Doctor Profile - Patient - MedTok");

  const { data, error } = useLoaderData<{ data: FHIRPractitioner, error: string }>();
  if (error) {
    return (
      <ErrorPage error={error} />
    );
  }
  return <DoctorDetail doctor={data} />;
}
