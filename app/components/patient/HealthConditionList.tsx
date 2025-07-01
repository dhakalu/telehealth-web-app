import React, { useEffect, useState } from "react";
import type { HealthCondition } from "~/api/patient";
import { patientApi, patientUtils } from "~/api/patient";
import Card from "~/components/common/Card";
import { HealthConditionItem } from "./HealthConditionItem";
import {
    EmptyState,
    ErrorState,
    LoadingState,
    ResourceListHeader,
    ShowMoreSection,
    type BasePatientResourceListProps
} from "./shared/PatientResourceList";

export interface HealthConditionListProps extends BasePatientResourceListProps {
    /** Callback when a health condition is clicked */
    onConditionClick?: (condition: HealthCondition) => void;
}

export const HealthConditionList: React.FC<HealthConditionListProps> = ({
    patientId,
    maxItems = 10,
    showHeader = true,
    title = "Health Conditions",
    className = "",
    showDetails = true,
    onViewAll,
    onConditionClick
}) => {
    const [conditions, setConditions] = useState<HealthCondition[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch health conditions for the patient
    useEffect(() => {
        const fetchConditions = async () => {
            if (!patientId) return;

            try {
                setLoading(true);
                const healthConditions = await patientApi.getHealthConditions(patientId);

                // Filter active conditions and sort by diagnosis date
                const activeConditions = patientUtils.filterActive(healthConditions);
                const sortedConditions = patientUtils.sortConditionsByDate(activeConditions);

                setConditions(sortedConditions);
                setError(null);
            } catch (err) {
                console.error('Error fetching health conditions:', err);
                setError('Failed to load health conditions');
            } finally {
                setLoading(false);
            }
        };

        fetchConditions();
    }, [patientId]);

    // Group conditions by status for better organization
    const groupedConditions = patientUtils.groupHealthConditionsByStatus(conditions);
    const displayedConditions = conditions.slice(0, maxItems);
    const hasMoreConditions = conditions.length > maxItems;

    // Statistics
    const totalConditions = conditions.length;
    const activeConditions = groupedConditions.active?.length || 0;

    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <div className={`mt-6 ${className}`}>
            {/* Header with title and statistics */}
            {showHeader && (
                <ResourceListHeader
                    title={title}
                    totalCount={totalConditions}
                    activeCount={activeConditions}
                    hasMore={hasMoreConditions}
                    onViewAll={onViewAll}
                />
            )}

            {/* Loading state */}
            {loading && <LoadingState message="Loading health conditions..." />}

            {/* Error state */}
            {error && <ErrorState error={error} onRetry={handleRetry} />}

            {/* Empty state */}
            {!loading && !error && conditions.length === 0 && (
                <EmptyState
                    title="No Health Conditions Found"
                    description="No health conditions have been recorded for this patient yet."
                    icon={
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    }
                />
            )}

            {/* Health Conditions grid */}
            {!loading && !error && conditions.length > 0 && (
                <div className="space-y-4">
                    {/* Responsive grid layout with uniform heights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                        {displayedConditions.map((condition) => (
                            <HealthConditionItem
                                key={condition.id}
                                condition={condition}
                                showDetails={showDetails}
                                onClick={onConditionClick}
                                className="h-full"
                            />
                        ))}
                    </div>

                    {/* Show more button */}
                    {hasMoreConditions && onViewAll && (
                        <ShowMoreSection
                            currentCount={maxItems}
                            totalCount={conditions.length}
                            onViewAll={onViewAll}
                        />
                    )}

                    {/* Status breakdown */}
                    {showHeader && Object.keys(groupedConditions).length > 1 && (
                        <Card additionalClassName="mt-6">
                            <div className="p-4">
                                <h3 className="text-sm font-medium text-base-content/70 mb-3">
                                    Health Condition Status Breakdown
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(groupedConditions).map(([status, conditionList]) => (
                                        <div
                                            key={status}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <div className={`w-3 h-3 rounded-full ${patientUtils.getConditionStatusColor(status).replace('text-', 'bg-')}`}></div>
                                            <span className="capitalize">{status}: {conditionList.length}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
};

export default HealthConditionList;
