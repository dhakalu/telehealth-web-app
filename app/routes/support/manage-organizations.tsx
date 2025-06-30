import axios from "axios";
import { useEffect, useState } from "react";
import { LoaderFunction, useLoaderData, useNavigate } from "react-router";
import { API_BASE_URL } from "~/api";
import { requireAuthCookie } from "~/auth";
import Button from "~/components/common/Button";
import DeleteConfirmationModal from "~/components/common/DeleteConfirmationModal";
import { Column, Table } from "~/components/common/Table";
import { Organization } from "~/components/organization/types";
import StatisticsCard from "~/components/support/StatisticsCard";
import SupportPageLayout from "~/components/support/SupportPageLayout";
import { usePageTitle } from "~/hooks";

export const loader: LoaderFunction = async ({ request }) => {
    const user = await requireAuthCookie(request);
    return { user, baseUrl: API_BASE_URL };
}

export default function ManageOrganizations() {
    usePageTitle("Manage Organizations - MedTok Support");
    const { baseUrl } = useLoaderData<{ baseUrl: string }>();
    const navigate = useNavigate();

    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch organizations
    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`${baseUrl}/organizations`);
                setOrganizations(response.data || []);
            } catch (err) {
                console.error('Error fetching organizations:', err);
                setError('Failed to load organizations. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrganizations();
    }, [baseUrl]);

    // Handle delete organization
    const handleDelete = async () => {
        if (!selectedOrganization) return;

        setIsDeleting(true);
        try {
            await axios.delete(`${baseUrl}/organizations/${selectedOrganization.id}`);
            setOrganizations(prev => prev.filter(org => org.id !== selectedOrganization.id));
            setIsDeleteModalOpen(false);
            setSelectedOrganization(null);
        } catch (err) {
            console.error('Error deleting organization:', err);
            setError('Failed to delete organization. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    // Handle refresh
    const handleRefresh = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${baseUrl}/organizations`);
            setOrganizations(response.data || []);
        } catch (err) {
            console.error('Error fetching organizations:', err);
            setError('Failed to refresh organizations. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Define table columns
    const columns: Column<Organization>[] = [
        {
            header: "Name",
            accessor: (org) => (
                <div>
                    <div className="font-medium opacity-90">{org.name}</div>
                    <div className="text-sm opacity-50">{org.organization_type}</div>
                </div>
            ),
        },
        {
            header: "Status",
            accessor: (org) => (
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${org.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : org.status === 'inactive'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                    {org.status}
                </span>
            ),
        },
        {
            header: "Website",
            accessor: (org) => org.website ? (
                <a
                    href={org.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                >
                    {org.website}
                </a>
            ) : (
                <span className="text-gray-400">-</span>
            ),
        },
        {
            header: "Tax ID",
            accessor: (org) => org.tax_id || <span className="text-gray-400">-</span>,
        },
        {
            header: "Created",
            accessor: (org) => new Date(org.created_at).toLocaleDateString(),
        },
        {
            header: "Actions",
            accessor: (org) => (
                <div className="flex space-x-2">

                    <Button
                        size="xs"
                        buttonType="warning"
                        onClick={() => {
                            navigate(`/support/manage-organizations/${org.id}`);
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        size="xs"
                        buttonType="error"
                        onClick={() => {
                            setSelectedOrganization(org);
                            setIsDeleteModalOpen(true);
                        }}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    const headerActions = (
        <div className="flex space-x-3">
            <Button
                onClick={() => navigate('/support/manage-organizations/create')}
                buttonType="primary"
            >
                <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Organization
            </Button>
            <Button
                onClick={handleRefresh}
                disabled={loading}
                isLoading={loading}
                buttonType="secondary"
            >
                <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
            </Button>
        </div>
    );

    return (
        <>
            <SupportPageLayout
                title="Manage Organizations"
                subtitle="Create, view, and manage healthcare organizations in the system"
                headerActions={headerActions}
                error={error}
                onErrorDismiss={() => setError(null)}
                loading={loading}
                loadingMessage="Loading organizations..."
            >
                {/* Statistics */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                    <StatisticsCard
                        title="Total Organizations"
                        value={organizations.length}
                        colorClass="blue"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        }
                    />
                    <StatisticsCard
                        title="Active"
                        value={organizations.filter(org => org.status === 'active').length}
                        colorClass="green"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                    <StatisticsCard
                        title="Inactive"
                        value={organizations.filter(org => org.status === 'inactive').length}
                        colorClass="red"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                    <StatisticsCard
                        title="With Website"
                        value={organizations.filter(org => org.website).length}
                        colorClass="purple"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                            </svg>
                        }
                    />
                </div>

                {/* Organizations Table */}
                <div className="overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium opacity-90 mb-4">Organizations</h3>
                        <Table
                            columns={columns}
                            data={organizations}
                            emptyMessage="No organizations found. Click 'Add Organization' to create your first organization."
                        />
                    </div>
                </div>
            </SupportPageLayout>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedOrganization(null);
                }}
                onConfirm={handleDelete}
                title="Delete Organization"
                itemName={selectedOrganization?.name}
                isDeleting={isDeleting}
                deleteButtonText="Delete Organization"
            />
        </>
    );
}
