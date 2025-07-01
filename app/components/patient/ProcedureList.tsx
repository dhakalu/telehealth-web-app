import React, { useEffect, useState } from "react";
import type { Procedure } from "~/api/patient";
import { patientApi, patientUtils } from "~/api/patient";
import Card from "~/components/common/Card";
import { ProcedureItem } from "./ProcedureItem";
import {
    EmptyState,
    ErrorState,
    LoadingState,
    ResourceListHeader,
    ShowMoreSection,
    type BasePatientResourceListProps
} from "./shared/PatientResourceList";

export interface ProcedureListProps extends BasePatientResourceListProps {
    /** Callback when a procedure is clicked */
    onProcedureClick?: (procedure: Procedure) => void;
}

export const ProcedureList: React.FC<ProcedureListProps> = ({
    patientId,
    maxItems = 10,
    showHeader = true,
    title = "Procedures",
    className = "",
    showDetails = true,
    onViewAll,
    onProcedureClick
}) => {
    const [procedures, setProcedures] = useState<Procedure[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch procedures for the patient
    useEffect(() => {
        const fetchProcedures = async () => {
            if (!patientId) return;

            try {
                setLoading(true);
                const patientProcedures = await patientApi.getProcedures(patientId);

                // Filter active procedures and sort by performed date
                const activeProcedures = patientUtils.filterActive(patientProcedures);
                const sortedProcedures = patientUtils.sortProceduresByDate(activeProcedures);

                setProcedures(sortedProcedures);
                setError(null);
            } catch (err) {
                console.error('Error fetching procedures:', err);
                setError('Failed to load procedures');
            } finally {
                setLoading(false);
            }
        };

        fetchProcedures();
    }, [patientId]);

    // Group procedures by outcome for better organization
    const groupedProcedures = patientUtils.groupProceduresByOutcome(procedures);
    const displayedProcedures = procedures.slice(0, maxItems);
    const hasMoreProcedures = procedures.length > maxItems;

    // Statistics
    const totalProcedures = procedures.length;
    const successfulProcedures = groupedProcedures.successful?.length ||
        groupedProcedures.complete?.length ||
        groupedProcedures.completed?.length || 0;

    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <div className={`mt-6 ${className}`}>
            {/* Header with title and statistics */}
            {showHeader && (
                <ResourceListHeader
                    title={title}
                    totalCount={totalProcedures}
                    activeCount={successfulProcedures > 0 ? successfulProcedures : undefined}
                    hasMore={hasMoreProcedures}
                    onViewAll={onViewAll}
                />
            )}

            {/* Loading state */}
            {loading && <LoadingState message="Loading procedures..." />}

            {/* Error state */}
            {error && <ErrorState error={error} onRetry={handleRetry} />}

            {/* Empty state */}
            {!loading && !error && procedures.length === 0 && (
                <EmptyState
                    title="No Procedures Found"
                    description="No procedures have been recorded for this patient yet."
                    icon={
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                    }
                />
            )}

            {/* Procedures grid */}
            {!loading && !error && procedures.length > 0 && (
                <div className="space-y-4">
                    {/* Responsive grid layout with uniform heights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                        {displayedProcedures.map((procedure) => (
                            <ProcedureItem
                                key={procedure.id}
                                procedure={procedure}
                                showDetails={showDetails}
                                onClick={onProcedureClick}
                                className="h-full"
                            />
                        ))}
                    </div>

                    {/* Show more button */}
                    {hasMoreProcedures && onViewAll && (
                        <ShowMoreSection
                            currentCount={maxItems}
                            totalCount={procedures.length}
                            onViewAll={onViewAll}
                        />
                    )}

                    {/* Outcome breakdown */}
                    {showHeader && Object.keys(groupedProcedures).length > 1 && (
                        <Card additionalClassName="mt-6">
                            <div className="p-4">
                                <h3 className="text-sm font-medium text-base-content/70 mb-3">
                                    Procedure Outcome Breakdown
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(groupedProcedures).map(([outcome, procedureList]) => (
                                        <div
                                            key={outcome}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <div className={`w-3 h-3 rounded-full ${patientUtils.getProcedureOutcomeColor(outcome).replace('text-', 'bg-')}`}></div>
                                            <span className="capitalize">{outcome}: {procedureList.length}</span>
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

export default ProcedureList;
