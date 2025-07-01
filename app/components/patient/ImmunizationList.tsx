import React, { useEffect, useState } from "react";
import type { Immunization } from "~/api/patient";
import { patientApi, patientUtils } from "~/api/patient";
import Card from "~/components/common/Card";
import { ImmunizationItem } from "./ImmunizationItem";
import {
    EmptyState,
    ErrorState,
    LoadingState,
    ResourceListHeader,
    ShowMoreSection,
    type BasePatientResourceListProps
} from "./shared/PatientResourceList";

export interface ImmunizationListProps extends BasePatientResourceListProps {
    /** Callback when an immunization is clicked */
    onImmunizationClick?: (immunization: Immunization) => void;
}

export const ImmunizationList: React.FC<ImmunizationListProps> = ({
    patientId,
    maxItems = 10,
    showHeader = true,
    title = "Immunizations",
    className = "",
    showDetails = true,
    onViewAll,
    onImmunizationClick
}) => {
    const [immunizations, setImmunizations] = useState<Immunization[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch immunizations for the patient
    useEffect(() => {
        const fetchImmunizations = async () => {
            if (!patientId) return;

            try {
                setLoading(true);
                const patientImmunizations = await patientApi.getImmunizations(patientId);

                // Filter active immunizations and sort by administration date
                const activeImmunizations = patientUtils.filterActive(patientImmunizations);
                const sortedImmunizations = patientUtils.sortImmunizationsByDate(activeImmunizations);

                setImmunizations(sortedImmunizations);
                setError(null);
            } catch (err) {
                console.error('Error fetching immunizations:', err);
                setError('Failed to load immunizations');
            } finally {
                setLoading(false);
            }
        };

        fetchImmunizations();
    }, [patientId]);

    // Group immunizations by year for better organization
    const groupedImmunizations = patientUtils.groupImmunizationsByYear(immunizations);
    const displayedImmunizations = immunizations.slice(0, maxItems);
    const hasMoreImmunizations = immunizations.length > maxItems;

    // Statistics
    const totalImmunizations = immunizations.length;
    const currentYearImmunizations = groupedImmunizations[new Date().getFullYear().toString()]?.length || 0;

    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <div className={`mt-6 ${className}`}>
            {/* Header with title and statistics */}
            {showHeader && (
                <ResourceListHeader
                    title={title}
                    totalCount={totalImmunizations}
                    activeCount={currentYearImmunizations > 0 ? currentYearImmunizations : undefined}
                    hasMore={hasMoreImmunizations}
                    onViewAll={onViewAll}
                />
            )}

            {/* Loading state */}
            {loading && <LoadingState message="Loading immunizations..." />}

            {/* Error state */}
            {error && <ErrorState error={error} onRetry={handleRetry} />}

            {/* Empty state */}
            {!loading && !error && immunizations.length === 0 && (
                <EmptyState
                    title="No Immunizations Found"
                    description="No immunizations have been recorded for this patient yet."
                    icon={
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                    }
                />
            )}

            {/* Immunizations grid */}
            {!loading && !error && immunizations.length > 0 && (
                <div className="space-y-4">
                    {/* Responsive grid layout with uniform heights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                        {displayedImmunizations.map((immunization) => (
                            <ImmunizationItem
                                key={immunization.id}
                                immunization={immunization}
                                showDetails={showDetails}
                                onClick={onImmunizationClick}
                                className="h-full"
                            />
                        ))}
                    </div>

                    {/* Show more button */}
                    {hasMoreImmunizations && onViewAll && (
                        <ShowMoreSection
                            currentCount={maxItems}
                            totalCount={immunizations.length}
                            onViewAll={onViewAll}
                        />
                    )}

                    {/* Year breakdown */}
                    {showHeader && Object.keys(groupedImmunizations).length > 1 && (
                        <Card additionalClassName="mt-6">
                            <div className="p-4">
                                <h3 className="text-sm font-medium text-base-content/70 mb-3">
                                    Immunization Year Breakdown
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(groupedImmunizations)
                                        .sort(([a], [b]) => b.localeCompare(a)) // Sort years descending
                                        .map(([year, immunizationList]) => (
                                            <div
                                                key={year}
                                                className="flex items-center gap-2 text-sm"
                                            >
                                                <div className="w-3 h-3 rounded-full bg-teal-600"></div>
                                                <span>{year}: {immunizationList.length} vaccine{immunizationList.length !== 1 ? 's' : ''}</span>
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

export default ImmunizationList;
