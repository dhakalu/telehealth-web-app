import { LoaderFunction } from "@remix-run/node";
import { requireAuthCookie } from "~/auth";
import { useLoaderData, useParams } from "@remix-run/react";
import axios from "axios";
import { API_BASE_URL } from "~/api";
import ErrorPage from "~/components/common/ErrorPage";
import React, { useState } from "react";
import { ImmunizationTable } from "./ImmunizationTable";
import { Immunization } from "./types";
import AddImmunizationModal from "./AddImmunizationModal";

export const loader: LoaderFunction = async ({ request, params }) => {
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

export default function PatientImmunization() {
  const { immunizations, error, baseUrl } = useLoaderData<{ immunizations: Immunization[]; error: string; baseUrl: string }>();
  const [addModalOpen, setModalOpen] = useState(false);
  const { patientId } = useParams<{ patientId: string }>();
  if (error) {
    return <ErrorPage error={error} />;
  }
  return (
    <>
      <div className="flex justify-end mb-4">
        <button onClick={() => setModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded">
          Add Immunization
        </button>
      </div>
      <AddImmunizationModal patientId={patientId || ""} baseUrl={baseUrl} open={addModalOpen} onClose={() => setModalOpen(false)} />
      <ImmunizationTable immunizations={immunizations} />
    </>
  );
}
