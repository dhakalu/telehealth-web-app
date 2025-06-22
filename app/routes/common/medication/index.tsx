import {Chat } from "../../../components/ChatComponent";
import { LoaderFunction } from "react-router";
import { requireAuthCookie } from "~/auth";
import { useLoaderData, useParams } from "react-router";
import axios from "axios";
import { API_BASE_URL } from "~/api";
import ErrorPage from "~/components/common/ErrorPage";
import React, { useState } from "react";
import { MedicationTable } from "./MedicationTable";
import { Medication } from "./types";
import AddMedicationModal from "./AddMedicationModal";


export const loader: LoaderFunction = async ({ request, params }) => {
  const user =  await requireAuthCookie(request);
  const { patientId } = params    
  try {
      const medicationUrl = `${API_BASE_URL}/patient/${patientId}/medication`
      const medicationResponse = await axios.get(medicationUrl);
      const medications = medicationResponse.data as Medication[];
      return {
        user,
        baseUrl: API_BASE_URL,
        medications,
      }
  } catch (error) {
      console.error(error)
      if (axios.isAxiosError(error) && error.response) {
        return Response.json(
        error.response.data,
        { status: error.response.status }
        );
        } else {
        console.error("Error fetching chat:", error);
        return Response.json(
            { error: "Internal server error" },
            { status: 500 }
        );
      }
  }
}

export default function PatientMedication(){
  const { medications, error, baseUrl } = useLoaderData<{medications: Medication[], error: string, baseUrl: string}>();
  const [addModalOpen, setModalOpen] = useState(false);
  const { patientId } = useParams<{ patientId: string }>();
  if (error) {
    return <ErrorPage error={error} />;
  }
  return (
    <>
      <div className="flex justify-end mb-4">
      <button onClick={() => setModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded">
        Add Medication
      </button>
      </div>
      <AddMedicationModal patientId={patientId || ""} baseUrl={baseUrl} open={addModalOpen} onClose={() => setModalOpen(false)} />
      <MedicationTable medications={medications} />
    </>
  );
}




