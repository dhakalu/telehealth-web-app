import React from 'react';
import { Column, Table } from '~/components/common/Table';

export interface User {
    sub: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    middle_name?: string;
    email?: string;
    account_type?: string;
    status?: string;
    verification_token?: string;
}

// Extend User to include id for Table component compatibility
interface UserWithId extends User {
    id: string;
}

interface UsersTableProps {
    users: User[];
    loading?: boolean;
}

const getStatusBadge = (status: string, user?: User) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

    switch (status?.toLowerCase()) {
        case 'complete':
            return (
                <span className={`${baseClasses} bg-green-100 text-green-800`}>
                    Complete
                </span>
            );
        case 'email-verified':
        case 'pending-approval': {
            const getCompleteProfilePath = (accountType?: string) => {
                switch (accountType?.toLowerCase()) {
                    case 'practitioner':
                        return `/support/approval/practitioner/${user?.sub}`;
                    case 'support':
                        return `/support/complete-profile/${user?.sub}`;
                    default:
                        return '#';
                }
            };

            const statusText = status?.toLowerCase() === 'pending-approval' ? 'Pending Approval' : 'Email Verified';
            const bgColor = status?.toLowerCase() === 'pending-approval' ? 'bg-amber-100' : 'bg-yellow-100';
            const textColor = status?.toLowerCase() === 'pending-approval' ? 'text-amber-800' : 'text-yellow-800';
            const hoverColor = status?.toLowerCase() === 'pending-approval' ? 'hover:bg-amber-200' : 'hover:bg-yellow-200';

            return (
                <a
                    href={getCompleteProfilePath(user?.account_type)}
                    className={`${baseClasses} ${bgColor} ${textColor} ${hoverColor} cursor-pointer transition-colors duration-200`}
                    title="Click to review/approve"
                >
                    {statusText}
                </a>
            );
        }
        case 'created':
            return (
                <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
                    Created
                </span>
            );
        case 'rejected':
            return (
                <span className={`${baseClasses} bg-red-100 text-red-800`}>
                    Rejected
                </span>
            );
        default:
            return (
                <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
                    {status || 'Unknown'}
                </span>
            );
    }
};

const getAccountTypeBadge = (accountType: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

    switch (accountType?.toLowerCase()) {
        case 'patient':
            return (
                <span className={`${baseClasses} bg-purple-100 text-purple-800`}>
                    Patient
                </span>
            );
        case 'practitioner':
            return (
                <span className={`${baseClasses} bg-indigo-100 text-indigo-800`}>
                    Practitioner
                </span>
            );
        case 'support':
            return (
                <span className={`${baseClasses} bg-orange-100 text-orange-800`}>
                    Support
                </span>
            );
        case 'pharmacist':
            return (
                <span className={`${baseClasses} bg-teal-100 text-teal-800`}>
                    Pharmacist
                </span>
            );
        case 'facility-admin':
            return (
                <span className={`${baseClasses} bg-red-100 text-red-800`}>
                    Admin
                </span>
            );
        default:
            return (
                <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
                    {accountType || 'Unknown'}
                </span>
            );
    }
};

export const UsersTable: React.FC<UsersTableProps> = ({ users, loading = false }) => {
    // Define columns for the Table component
    const columns: Column<UserWithId>[] = [
        {
            header: 'Name',
            accessor: (user) => {
                const displayName = user.name ||
                    `${user.given_name || ''} ${user.family_name || ''}`.trim() ||
                    user.email?.split('@')[0] ||
                    'Unknown User';

                return (
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                    {displayName.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                                {displayName}
                            </div>
                            {user.middle_name && (
                                <div className="text-sm text-gray-500">
                                    Middle: {user.middle_name}
                                </div>
                            )}
                        </div>
                    </div>
                );
            }
        },
        {
            header: 'Email',
            accessor: (user) => (
                <div className="text-sm text-gray-900">{user.email || 'N/A'}</div>
            )
        },
        {
            header: 'Account Type',
            accessor: (user) => getAccountTypeBadge(user.account_type || '')
        },
        {
            header: 'Status',
            accessor: (user) => getStatusBadge(user.status || '', user)
        },
        {
            header: 'User ID',
            accessor: (user) => (
                <div className="text-sm text-gray-500 font-mono">
                    {user.sub || 'N/A'}
                </div>
            )
        }
    ];

    // Transform users to include id property for Table component
    const usersWithId: UserWithId[] = users.map(user => ({
        ...user,
        id: user.sub
    }));

    if (loading) {
        return (
            <div className="bg-white shadow rounded-lg">
                <div className="p-6">
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-4 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!users || users.length === 0) {
        return (
            <div className="bg-white shadow rounded-lg">
                <div className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 text-gray-400">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                    <p className="text-gray-500">There are no users to display at this time.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Team Members</h3>

                <Table
                    columns={columns}
                    data={usersWithId}
                    emptyMessage="No team members found."
                />

                <div className="mt-4 text-sm text-gray-500">
                    Showing {users.length} user{users.length !== 1 ? 's' : ''}
                </div>
            </div>
        </div>
    );
};
