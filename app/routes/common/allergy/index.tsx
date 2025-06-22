import { LoaderFunction } from "react-router";
import { requireAuthCookie } from "~/auth";
import { useLoaderData, useParams } from "react-router";
import axios from "axios";
import { API_BASE_URL } from "~/api";
import ErrorPage from "~/components/common/ErrorPage";
import { useState } from "react";
import { AllergyTable } from "./AllergyTable";
import { Allergy } from "./types";
import AddAllergyModal from "./AddAllergyModal";

export const loader: LoaderFunction = async ({ request, params }) => {
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

export default function PatientAllergy() {
  const { allergies, error, baseUrl } = useLoaderData<{ allergies: Allergy[]; error: string; baseUrl: string }>();
  const [addModalOpen, setModalOpen] = useState(false);
  const { patientId } = useParams<{ patientId: string }>();
  if (error) {
    return <ErrorPage error={error} />;
  }
  return (
    <>
      <div className="flex justify-end mb-4">
        <button onClick={() => setModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded">
          Add Allergy
        </button>
      </div>
      <AddAllergyModal patientId={patientId || ""} baseUrl={baseUrl} open={addModalOpen} onClose={() => setModalOpen(false)} />
      <AllergyTable allergies={allergies} />
    </>
  );
}
