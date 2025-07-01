import axios from "axios";
import { LoaderFunctionArgs } from "react-router";
import { API_BASE_URL } from "~/api";
import { PrescriptionWithDetails } from "~/api/prescription";
import { requireAuthCookie } from "~/auth";

export const loadPrescriptions = () => async ({ request, params }: LoaderFunctionArgs) => {
    const user = await requireAuthCookie(request);
    const { patientId } = params;
    try {
        const url = `${API_BASE_URL}/prescriptions?patient_id=${patientId}`;
        const response = await axios.get(url);
        console.log("Prescriptions response:", response.data);
        const { prescriptions } = response.data as { prescriptions: PrescriptionWithDetails[] };
        return {
            user,
            baseUrl: API_BASE_URL,
            prescriptions: prescriptions || [],
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
