import React from "react";
import Card from "~/components/common/Card";

/**
 * Shared props interface for patient resource list components
 */
export interface BasePatientResourceListProps {
    /** Patient ID to fetch resources for */
    patientId: string;
    /** Maximum number of resources to display initially */
    maxItems?: number;
    /** Show the header with title and statistics */
    showHeader?: boolean;
    /** Custom title for the resources section */
    title?: string;
    /** Additional CSS classes */
    className?: string;
    /** Whether to show detailed information for each resource */
    showDetails?: boolean;
    /** Callback when "View All" is clicked */
    onViewAll?: () => void;
}

/**
 * Shared loading state component
 */
export const LoadingState: React.FC<{ message?: string }> = ({
    message = "Loading..."
}) => (
    <Card>
        <div className="flex items-center justify-center py-8">
            <span className="loading loading-spinner loading-md"></span>
            <span className="ml-2">{message}</span>
        </div>
    </Card>
);

/**
 * Shared error state component
 */
export const ErrorState: React.FC<{
    error: string;
    onRetry?: () => void;
}> = ({ error, onRetry }) => (
    <Card>
        <div className="text-center py-8 text-error">
            <div className="text-error/60 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <p className="font-medium">{error}</p>
            {onRetry && (
                <button
                    className="btn btn-sm btn-outline mt-3"
                    onClick={onRetry}
                >
                    Try Again
                </button>
            )}
        </div>
    </Card>
);

/**
 * Shared empty state component
 */
export const EmptyState: React.FC<{
    title: string;
    description: string;
    icon?: React.ReactNode;
}> = ({ title, description, icon }) => (
    <Card>
        <div className="text-center py-12">
            <div className="text-base-content/30 mb-4">
                {icon || (
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                )}
            </div>
            <h3 className="text-lg font-medium text-base-content mb-2">
                {title}
            </h3>
            <p className="text-base-content/60">
                {description}
            </p>
        </div>
    </Card>
);

/**
 * Shared header with statistics component
 */
export const ResourceListHeader: React.FC<{
    title: string;
    totalCount: number;
    activeCount?: number;
    hasMore: boolean;
    onViewAll?: () => void;
}> = ({ title, totalCount, activeCount, hasMore, onViewAll }) => (
    <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-base-content">
                {title}
            </h2>
            {totalCount > 0 && (
                <div className="flex items-center gap-2">
                    <span className="badge badge-neutral">
                        {totalCount} total
                    </span>
                    {typeof activeCount === 'number' && activeCount > 0 && (
                        <span className="badge badge-success">
                            {activeCount} active
                        </span>
                    )}
                </div>
            )}
        </div>
        {hasMore && onViewAll && (
            <button
                className="btn btn-outline btn-sm"
                onClick={onViewAll}
            >
                View All
            </button>
        )}
    </div>
);

/**
 * Shared "show more" section component
 */
export const ShowMoreSection: React.FC<{
    currentCount: number;
    totalCount: number;
    onViewAll?: () => void;
}> = ({ currentCount, totalCount, onViewAll }) => (
    <Card>
        <div className="text-center py-4">
            <p className="text-sm text-base-content/70 mb-3">
                Showing {currentCount} of {totalCount} items
            </p>
            <button
                className="btn btn-outline btn-sm"
                onClick={onViewAll}
            >
                View All
            </button>
        </div>
    </Card>
);
