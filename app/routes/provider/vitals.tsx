import { LoaderFunction, useLoaderData } from "react-router";

import { useState } from "react";
import { requireAuthCookie } from "~/auth";
import Button from "~/components/common/Button";
import ErrorPage from "~/components/common/ErrorPage";
import { Modal } from "~/components/common/Modal";
import { Column, Table } from "~/components/common/Table";
import { usePageTitle } from "~/hooks";

// Define the Vitals type
export type Vitals = {
    id: string;
    patientId: string;
    temperature?: number;
    temperatureUnit?: "C" | "F";
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    heartRate?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    oxygenSaturationType?: "O2 Saturation" | "Oxygen Saturation";
    height?: number;
    heightUnit?: "cm" | "in" | "ft-in";
    weight?: number;
    weightUnit?: "kg" | "lb";
    bmi?: number;
    bmiUnit?: "kg/m^2";
    bodySurfaceArea?: number;
    bodySurfaceAreaUnit?: "m^2";
    recordedBy: string;
    recordedAt: string;
    createdAt: string;
    updatedAt: string;
};

// Loader function - for now returns empty data
export const loader: LoaderFunction = async ({ request, params }) => {
    const user = await requireAuthCookie(request);
    const { patientId } = params;

    // TODO: Implement actual API call to fetch vitals
    // For now, return empty data structure
    try {
        return {
            vitals: [],
            error: null,
            baseUrl: process.env.API_BASE_URL || "http://localhost:8080",
            user,
            patientId
        };
    } catch (error) {
        console.error("Error fetching vitals:", error);
        return {
            vitals: [],
            error: "Failed to fetch vitals",
            baseUrl: process.env.API_BASE_URL || "http://localhost:8080",
            user,
            patientId
        };
    }
};

export default function Vitals() {
    usePageTitle("Vitals - Provider - MedTok");

    const { vitals, error } = useLoaderData<{
        vitals: Vitals[];
        error: string | null;
        baseUrl: string;
        user: { sub: string };
        patientId: string;
    }>();

    const [addModalOpen, setAddModalOpen] = useState(false);

    // Define table columns
    const columns: Column<Vitals>[] = [
        {
            header: "Date/Time",
            accessor: (row) => new Date(row.recordedAt).toLocaleString(),
        },
        {
            header: "Temperature",
            accessor: (row) => row.temperature
                ? `${row.temperature}°${row.temperatureUnit || 'C'}`
                : "N/A",
        },
        {
            header: "Blood Pressure",
            accessor: (row) => (row.bloodPressureSystolic && row.bloodPressureDiastolic)
                ? `${row.bloodPressureSystolic}/${row.bloodPressureDiastolic} mmHg`
                : "N/A",
        },
        {
            header: "Heart Rate",
            accessor: (row) => row.heartRate ? `${row.heartRate} bpm` : "N/A",
        },
        {
            header: "Respiratory Rate",
            accessor: (row) => row.respiratoryRate ? `${row.respiratoryRate} /min` : "N/A",
        },
        {
            header: "O2 Saturation",
            accessor: (row) => row.oxygenSaturation ? `${row.oxygenSaturation}%` : "N/A",
        },
        {
            header: "Weight",
            accessor: (row) => row.weight
                ? `${row.weight} ${row.weightUnit || 'kg'}`
                : "N/A",
        },
        {
            header: "BMI",
            accessor: (row) => row.bmi ? row.bmi.toFixed(1) : "N/A",
        },
        {
            header: "Actions",
            accessor: (row) => (
                <div className="flex gap-2">
                    <Button
                        size="xs"
                        buttonType="info"
                        onClick={() => {
                            // TODO: Implement edit functionality
                            console.log("Edit vitals:", row.id);
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        size="xs"
                        buttonType="error"
                        onClick={() => {
                            // TODO: Implement delete functionality
                            console.log("Delete vitals:", row.id);
                        }}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    const handleAddSuccess = () => {
        setAddModalOpen(false);
        // TODO: Implement revalidation when data loading is implemented
        // revalidator.revalidate();
    };

    if (error) {
        return <ErrorPage error={error} />;
    }

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Vital Signs</h1>
                <Button onClick={() => setAddModalOpen(true)}>
                    Record Vitals
                </Button>
            </div>

            {/* TODO: Implement AddVitalsForm component */}
            <Modal
                title="Record Vital Signs"
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
            >
                <div className="p-4">
                    <p className="text-gray-600">
                        Vital signs recording form will be implemented here.
                    </p>
                    <div className="flex justify-end mt-4">
                        <Button onClick={handleAddSuccess}>
                            Close
                        </Button>
                    </div>
                </div>
            </Modal>

            <Table
                columns={columns}
                data={vitals}
                emptyMessage="No vital signs recorded. Click 'Record Vitals' to add the first entry."
            />
        </>
    );
}
