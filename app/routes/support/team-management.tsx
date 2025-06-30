import { useEffect, useState } from "react";
import { LoaderFunction, useLoaderData } from "react-router";
import { API_BASE_URL } from "~/api";
import { userApi } from "~/api/users";
import { requireAuthCookie } from "~/auth";
import Button from "~/components/common/Button";
import { Modal } from "~/components/common/Modal";
import StatisticsCard from "~/components/support/StatisticsCard";
import SupportPageLayout from "~/components/support/SupportPageLayout";
import { UsersTable } from "~/components/support/UsersTable";
import type { User } from "~/components/user/types";
import { UserSignUp } from "~/components/UserSignUp";
import { usePageTitle } from "~/hooks";

export const loader: LoaderFunction = async ({ request }) => {
    const user = await requireAuthCookie(request);
    return { user, baseUrl: API_BASE_URL };
}

export default function TeamManagement() {
    usePageTitle("Team Management - MedTok Support");
    const { baseUrl } = useLoaderData<{ user: User, baseUrl: string }>();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);
                const users = await userApi.listUsers();
                setUsers(users || []);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError('Failed to load team members. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleRefresh = () => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);
                const users = await userApi.listUsers();
                setUsers(users || []);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError('Failed to load team members. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    };

    const handleModalClose = () => {
        setIsAddUserModalOpen(false);
    };

    const handleSignupSuccess = () => {
        handleModalClose();
        // Refresh the users list
        handleRefresh();
    };

    const headerActions = (
        <>
            <Button
                onClick={() => setIsAddUserModalOpen(true)}
                buttonType="secondary"
            >
                <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add User
            </Button>
            <Button
                onClick={handleRefresh}
                disabled={loading}
                isLoading={loading}
            >
                <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
            </Button>
        </>
    );

    return (
        <>
            <SupportPageLayout
                title="Team Management"
                subtitle="Manage team members, roles, and permissions"
                headerActions={headerActions}
                error={error}
                onErrorDismiss={() => setError(null)}
                loading={loading}
                loadingMessage="Loading team members..."
            >
                {/* Statistics Cards */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        <StatisticsCard
                            title="Total Users"
                            value={users.length}
                            colorClass="blue"
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            }
                        />
                        <StatisticsCard
                            title="Practitioners"
                            value={users.filter(u => u.account_type === 'practitioner').length}
                            colorClass="green"
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                        <StatisticsCard
                            title="Support Staff"
                            value={users.filter(u => u.account_type === 'support').length}
                            colorClass="orange"
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                </svg>
                            }
                        />
                        <StatisticsCard
                            title="Patients"
                            value={users.filter(u => u.account_type === 'patient').length}
                            colorClass="purple"
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            }
                        />
                    </div>
                )}

                <UsersTable users={users} loading={loading} />
            </SupportPageLayout>

            <Modal
                isOpen={isAddUserModalOpen}
                onClose={handleModalClose}
                title="Add New User"
            >
                <UserSignUp
                    baseUrl={baseUrl}
                    buttonLabel="Add User"
                    onSuccess={handleSignupSuccess}
                    allowedAccountTypes={[
                        { value: "support", label: "Support Staff" }
                    ]}
                    showLoginLink={false} // Hide login link in this modal
                />
            </Modal>
        </>
    );
}
