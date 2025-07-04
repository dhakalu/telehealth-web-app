import React from 'react';
import type { NotificationTemplate, NotificationType } from '~/api/notification';
import { Column, Table } from '~/components/common/Table';
import { EmptyState } from '~/components/patient';

// Extend NotificationTemplate to ensure id compatibility with Table component
interface NotificationTemplateWithId extends NotificationTemplate {
    id: string;
}

interface NotificationTemplateTableProps {
    templates: NotificationTemplate[];
    loading?: boolean;
    onEdit?: (template: NotificationTemplate) => void;
    onDelete?: (template: NotificationTemplate) => void;
}

const getTypeBadge = (type: NotificationType) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

    switch (type) {
        case 'prescription':
            return (
                <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
                    Prescription
                </span>
            );
        case 'appointment':
            return (
                <span className={`${baseClasses} bg-green-100 text-green-800`}>
                    Appointment
                </span>
            );
        case 'medical':
            return (
                <span className={`${baseClasses} bg-red-100 text-red-800`}>
                    Medical
                </span>
            );
        case 'system':
            return (
                <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
                    System
                </span>
            );
        case 'communication':
            return (
                <span className={`${baseClasses} bg-purple-100 text-purple-800`}>
                    Communication
                </span>
            );
        case 'billing':
            return (
                <span className={`${baseClasses} bg-orange-100 text-orange-800`}>
                    Billing
                </span>
            );
        default:
            return (
                <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
                    {type}
                </span>
            );
    }
};

const getStatusBadge = (isActive: boolean) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

    return isActive ? (
        <span className={`${baseClasses} bg-green-100 text-green-800`}>
            Active
        </span>
    ) : (
        <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
            Inactive
        </span>
    );
};

export const NotificationTemplateTable: React.FC<NotificationTemplateTableProps> = ({
    templates,
    loading,
    onEdit,
    onDelete
}) => {
    const columns: Column<NotificationTemplateWithId>[] = [
        {
            header: 'Name',
            accessor: (template) => (
                <div className="flex flex-col">
                    <div className="font-medium text-sm">{template.name}</div>
                    <div className="text-xs opacity-50 mt-1">
                        ID: {template.id.substring(0, 8)}...
                    </div>
                </div>
            )
        },
        {
            header: 'Type',
            accessor: (template) => getTypeBadge(template.type)
        },
        {
            header: 'Subject',
            accessor: (template) => (
                <div className="text-sm max-w-xs truncate" title={template.title}>
                    {template.title}
                </div>
            )
        },
        {
            header: 'Status',
            accessor: (template) => getStatusBadge(template.is_active)
        },
        {
            header: 'Updated',
            accessor: (template) => (
                <div className="text-xs opacity-50">
                    {new Date(template.updated_at).toLocaleDateString()}
                </div>
            )
        },
        {
            header: 'Actions',
            accessor: (template) => (
                <div className="flex space-x-2">
                    {onEdit && (
                        <button
                            onClick={() => onEdit(template)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                            title="Edit template"
                        >
                            Edit
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(template)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-200"
                            title="Delete template"
                        >
                            Delete
                        </button>
                    )}
                </div>
            )
        }
    ];

    // Transform templates to ensure id property compatibility
    const templatesWithId: NotificationTemplateWithId[] = templates.map(template => ({
        ...template,
        id: template.id
    }));

    if (loading) {
        return (
            <div className="shadow rounded-lg">
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

    if (!templates || templates.length === 0) {
        return (
            <EmptyState
                title="No Templates Found"
                description="There are no notification templates to display at this time."
                icon={
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                }
            />
        );
    }

    return (
        <div className="shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium opacity-90">Notification Templates</h3>
                    <div className="text-sm opacity-50">
                        {templates.length} template{templates.length !== 1 ? 's' : ''}
                    </div>
                </div>

                <Table
                    columns={columns}
                    data={templatesWithId}
                    emptyMessage="No notification templates found."
                />

                <div className="mt-4 text-sm opacity-50">
                    Showing {templates.length} template{templates.length !== 1 ? 's' : ''}
                </div>
            </div>
        </div>
    );
};
