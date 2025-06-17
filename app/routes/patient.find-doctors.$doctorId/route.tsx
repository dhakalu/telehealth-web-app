import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";
import { DoctorDetail } from "../../components/DoctorDetail";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { doctorId } = params;
  if (!doctorId) throw new Response("Doctor ID required", { status: 400 });
  const res = await axios.get(`${process.env.API_URL || "http://localhost:8090"}/practitioner/${doctorId}`);
  return res.data;
};

export default function DoctorDetailRoute() {
  const doctor = useLoaderData<typeof loader>();
  return <DoctorDetail doctor={doctor} />;
}
