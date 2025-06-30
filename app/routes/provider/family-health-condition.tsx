import { LoaderFunction, useLoaderData } from "react-router";

import { useState } from "react";
import { requireAuthCookie } from "~/auth";
import Button from "~/components/common/Button";
import ErrorPage from "~/components/common/ErrorPage";
import { Modal } from "~/components/common/Modal";
import { Column, Table } from "~/components/common/Table";
import { usePageTitle } from "~/hooks";

// Define the FamilyHealthCondition type
export type FamilyHealthCondition = {
    id: string;
    patientId: string;
    familyMember: string;
    relationship: string;
    condition: string;
    diagnosedAge?: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
};

// Loader function - for now returns empty data
export const loader: LoaderFunction = async ({ request, params }) => {
    const user = await requireAuthCookie(request);
    const { patientId } = params;

    // TODO: Implement actual API call to fetch family health conditions
    // For now, return empty data structure
    try {
        return {
            familyHealthConditions: [],
            error: null,
            baseUrl: process.env.API_BASE_URL || "http://localhost:8080",
            user,
            patientId
        };
    } catch (error) {
        console.error("Error fetching family health conditions:", error);
        return {
            familyHealthConditions: [],
            error: "Failed to fetch family health conditions",
            baseUrl: process.env.API_BASE_URL || "http://localhost:8080",
            user,
            patientId
        };
    }
};

export default function FamilyHealthCondition() {
    usePageTitle("Family Health Conditions - Provider - MedTok");

    const { familyHealthConditions, error } = useLoaderData<{
        familyHealthConditions: FamilyHealthCondition[];
        error: string | null;
        baseUrl: string;
        user: { sub: string };
        patientId: string;
    }>();

    const [addModalOpen, setAddModalOpen] = useState(false);

    // Define table columns
    const columns: Column<FamilyHealthCondition>[] = [
        {
            header: "Family Member",
            accessor: (row) => row.familyMember,
        },
        {
            header: "Relationship",
            accessor: (row) => row.relationship,
        },
        {
            header: "Condition",
            accessor: (row) => row.condition,
        },
        {
            header: "Diagnosed Age",
            accessor: (row) => row.diagnosedAge ? `${row.diagnosedAge} years` : "N/A",
        },
        {
            header: "Notes",
            accessor: (row) => row.notes || "N/A",
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
                            console.log("Edit family health condition:", row.id);
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        size="xs"
                        buttonType="error"
                        onClick={() => {
                            // TODO: Implement delete functionality
                            console.log("Delete family health condition:", row.id);
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
            <div className="flex justify-end items-center mb-4">
                <Button onClick={() => setAddModalOpen(true)}>
                    Add Family Health Condition
                </Button>
            </div>

            {/* TODO: Implement AddFamilyHealthConditionForm component */}
            <Modal
                title="Add Family Health Condition"
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
            >
                <div className="p-4">
                    <p className="opacity-60">
                        Add Family Health Condition form will be implemented here.
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
                data={familyHealthConditions}
                emptyMessage="No family health conditions found. Click 'Add Family Health Condition' to get started."
            />
        </>
    );
}
