import { LoaderFunction, useLoaderData } from "react-router";

import { useState } from "react";
import { requireAuthCookie } from "~/auth";
import Button from "~/components/common/Button";
import ErrorPage from "~/components/common/ErrorPage";
import { Modal } from "~/components/common/Modal";
import { Column, Table } from "~/components/common/Table";
import { usePageTitle } from "~/hooks";

// Define the TestResult type
export type TestResult = {
    id: string;
    patientId: string;
    testName: string;
    testType: string;
    testCategory: "Lab" | "Imaging" | "Pathology" | "Other";
    result: string;
    referenceRange?: string;
    units?: string;
    status: "Normal" | "Abnormal" | "Critical" | "Pending";
    interpretation?: string;
    orderedBy: string;
    performedBy?: string;
    orderedAt: string;
    performedAt?: string;
    resultDate: string;
    attachments?: string[];
    notes?: string;
    createdAt: string;
    updatedAt: string;
};

const sampleTestResults: TestResult[] = [
    {
        id: "1",
        patientId: "123",
        testName: "Complete Blood Count",
        testType: "Lab",
        testCategory: "Lab",
        result: "Normal",
        referenceRange: "4.5-11.0 x10^9/L",
        units: "x10^9/L",
        status: "Normal",
        orderedBy: "Dr. Smith",
        orderedAt: new Date().toISOString(),
        resultDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    // Add more sample data as needed
];

// Loader function - for now returns empty data
export const loader: LoaderFunction = async ({ request, params }) => {
    const user = await requireAuthCookie(request);
    const { patientId } = params;

    // TODO: Implement actual API call to fetch test results
    // For now, return empty data structure
    try {
        return {
            testResults: sampleTestResults, // Replace with actual API call
            error: null,
            baseUrl: process.env.API_BASE_URL || "http://localhost:8080",
            user,
            patientId
        };
    } catch (error) {
        console.error("Error fetching test results:", error);
        return {
            testResults: [],
            error: "Failed to fetch test results",
            baseUrl: process.env.API_BASE_URL || "http://localhost:8080",
            user,
            patientId
        };
    }
};

export default function Results() {
    usePageTitle("Test Results - Provider - MedTok");

    const { testResults, error } = useLoaderData<{
        testResults: TestResult[];
        error: string | null;
        baseUrl: string;
        user: { sub: string };
        patientId: string;
    }>();

    const [addModalOpen, setAddModalOpen] = useState(false);

    // Helper function to get status badge color
    const getStatusBadge = (status: string) => {
        const badgeClasses = {
            "Normal": "badge badge-success",
            "Abnormal": "badge badge-warning",
            "Critical": "badge badge-error",
            "Pending": "badge badge-info"
        };
        return badgeClasses[status as keyof typeof badgeClasses] || "badge";
    };

    // Define table columns
    const columns: Column<TestResult>[] = [
        {
            header: "Test Date",
            accessor: (row) => new Date(row.resultDate).toLocaleDateString(),
        },
        {
            header: "Test Name",
            accessor: (row) => row.testName,
        },
        {
            header: "Category",
            accessor: (row) => (
                <span className="badge badge-outline">
                    {row.testCategory}
                </span>
            ),
        },
        {
            header: "Result",
            accessor: (row) => (
                <div>
                    <div className="font-medium">{row.result}</div>
                    {row.units && <div className="text-sm text-gray-500">{row.units}</div>}
                </div>
            ),
        },
        {
            header: "Reference Range",
            accessor: (row) => row.referenceRange || "N/A",
        },
        {
            header: "Status",
            accessor: (row) => (
                <span className={getStatusBadge(row.status)}>
                    {row.status}
                </span>
            ),
        },
        {
            header: "Ordered By",
            accessor: (row) => row.orderedBy,
        },
        {
            header: "Actions",
            accessor: (row) => (
                <div className="flex gap-2">
                    <Button
                        size="xs"
                        buttonType="info"
                        onClick={() => {
                            // TODO: Implement view/edit functionality
                            console.log("View test result:", row.id);
                        }}
                    >
                        View
                    </Button>
                    {row.attachments && row.attachments.length > 0 && (
                        <Button
                            size="xs"
                            buttonType="secondary"
                            onClick={() => {
                                // TODO: Implement download functionality
                                console.log("Download attachments:", row.id);
                            }}
                        >
                            Download
                        </Button>
                    )}
                    <Button
                        size="xs"
                        buttonType="error"
                        onClick={() => {
                            // TODO: Implement delete functionality
                            console.log("Delete test result:", row.id);
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
            <div className="flex justify-end mb-4 mt-4">
                <Button onClick={() => setAddModalOpen(true)}>
                    Add Test Result
                </Button>
            </div>

            {/* TODO: Implement AddTestResultForm component */}
            <Modal
                title="Add Test Result"
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
            >
                <div className="p-4">
                    <p className="text-gray-600">
                        Test result entry form will be implemented here.
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
                data={testResults}
                emptyMessage="No test results found. Click 'Add Test Result' to add the first entry."
            />
        </>
    );
}
