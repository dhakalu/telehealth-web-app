import { LoaderFunction } from "@remix-run/node";
import { requireAuthCookie } from "~/auth";
import { useLoaderData, useParams } from "@remix-run/react";
import axios from "axios";
import { API_BASE_URL } from "~/api";
import ErrorPage from "~/components/common/ErrorPage";
import React, { useState } from "react";
import { HealthConditionTable } from "./HealthConditionTable";
import { HealthCondition } from "./types";
import AddHealthConditionModal from "./AddHealthConditionModal";

export const loader: LoaderFunction = async ({ request, params }) => {
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
};

export default function PatientHealthCondition() {
  const { healthConditions, error, baseUrl } = useLoaderData<{ healthConditions: HealthCondition[]; error: string; baseUrl: string }>();
  const [addModalOpen, setModalOpen] = useState(false);
  const { patientId } = useParams<{ patientId: string }>();
  if (error) {
    return <ErrorPage error={error} />;
  }
  return (
    <>
      <div className="flex justify-end mb-4">
        <button onClick={() => setModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded">
          Add Health Condition
        </button>
      </div>
      <AddHealthConditionModal patientId={patientId || ""} baseUrl={baseUrl} open={addModalOpen} onClose={() => setModalOpen(false)} />
      <HealthConditionTable healthConditions={healthConditions} />
    </>
  );
}
