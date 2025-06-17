import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";
import { DoctorDetail } from "../../components/DoctorDetail";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { doctorId } = params;
  if (!doctorId) throw new Response("Doctor ID required", { status: 400 });
  let res;
  try {
    res = await axios.get(`${process.env.API_URL || "http://localhost:8090"}/practitioner/${doctorId}`);
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
    return Response.json({ error:  message}, { status });
  }
};

export default function DoctorDetailRoute() {
  const {data, error } = useLoaderData<typeof loader>();
  if (error) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <div style={{ color: "red", fontSize: "1.2rem" }}>{error}</div>
      </div>
    );
  }
  return <DoctorDetail doctor={data} />;
}
