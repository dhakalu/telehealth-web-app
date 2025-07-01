import React, { useEffect, useState } from "react";
import type { Vital } from "~/api/patient";
import { patientApi, patientUtils } from "~/api/patient";
import Card from "~/components/common/Card";
import { VitalItem } from "./VitalItem";
import {
    EmptyState,
    ErrorState,
    LoadingState,
    ResourceListHeader,
    ShowMoreSection,
    type BasePatientResourceListProps
} from "./shared/PatientResourceList";

export interface VitalListProps extends BasePatientResourceListProps {
    /** Callback when a vital is clicked */
    onVitalClick?: (vital: Vital) => void;
}

export const VitalList: React.FC<VitalListProps> = ({
    patientId,
    maxItems = 10,
    showHeader = true,
    title = "Vital Signs",
    className = "",
    showDetails = true,
    onViewAll,
    onVitalClick
}) => {
    const [vitals, setVitals] = useState<Vital[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch vitals for the patient
    useEffect(() => {
        const fetchVitals = async () => {
            if (!patientId) return;

            try {
                setLoading(true);
                const vitalData = await patientApi.getVitals(patientId);

                // Filter out deleted vitals and sort by measurement date
                const activeVitals = patientUtils.filterActive(vitalData);
                const sortedVitals = patientUtils.sortVitalsByDate(activeVitals);

                setVitals(sortedVitals);
                setError(null);
            } catch (err) {
                console.error('Error fetching vitals:', err);
                setError('Failed to load vitals');
            } finally {
                setLoading(false);
            }
        };

        fetchVitals();
    }, [patientId]);

    // Group vitals by type for better organization
    const groupedVitals = patientUtils.groupVitalsByType(vitals);
    const displayedVitals = vitals.slice(0, maxItems);
    const hasMoreVitals = vitals.length > maxItems;

    // Statistics
    const totalVitals = vitals.length;
    const recentVitals = vitals.filter(vital => {
        const measureDate = new Date(vital.measured_at || vital.created_at || 0);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return measureDate >= thirtyDaysAgo;
    }).length;

    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <div className={`mt-6 ${className}`}>
            {/* Header with title and statistics */}
            {showHeader && (
                <ResourceListHeader
                    title={title}
                    totalCount={totalVitals}
                    activeCount={recentVitals}
                    hasMore={hasMoreVitals}
                    onViewAll={onViewAll}
                />
            )}

            {/* Loading state */}
            {loading && <LoadingState message="Loading vitals..." />}

            {/* Error state */}
            {error && <ErrorState error={error} onRetry={handleRetry} />}

            {/* Empty state */}
            {!loading && !error && vitals.length === 0 && (
                <EmptyState
                    title="No Vitals Found"
                    description="No vital signs have been recorded for this patient yet."
                />
            )}

            {/* Vitals grid */}
            {!loading && !error && vitals.length > 0 && (
                <div className="space-y-4">
                    {/* Responsive grid layout with uniform heights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 h-full lg:grid-cols-3 gap-4 items-start">
                        {displayedVitals.map((vital) => (
                            <VitalItem
                                key={vital.id}
                                vital={vital}
                                showDetails={showDetails}
                                onClick={onVitalClick}
                                className="h-full"
                            />
                        ))}
                    </div>

                    {/* Show more button */}
                    {hasMoreVitals && onViewAll && (
                        <ShowMoreSection
                            currentCount={maxItems}
                            totalCount={vitals.length}
                            onViewAll={onViewAll}
                        />
                    )}

                    {/* Vital type breakdown */}
                    {showHeader && Object.keys(groupedVitals).length > 1 && (
                        <Card additionalClassName="mt-6">
                            <div className="p-4">
                                <h3 className="text-sm font-medium text-base-content/70 mb-3">
                                    Vital Signs Breakdown
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(groupedVitals).map(([type, vitalList]) => (
                                        <div
                                            key={type}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <div className={`w-3 h-3 rounded-full ${patientUtils.getVitalTypeColor(type).replace('text-', 'bg-')}`}></div>
                                            <span className="capitalize">{type.replace('_', ' ')}: {vitalList.length}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Latest measurements summary */}
                    {showHeader && vitals.length > 0 && (
                        <Card additionalClassName="mt-6">
                            <div className="p-4">
                                <h3 className="text-sm font-medium text-base-content/70 mb-3">
                                    Latest Measurements
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {Object.entries(groupedVitals).slice(0, 4).map(([type, vitalList]) => {
                                        const latestVital = vitalList[0]; // Already sorted by date
                                        const rangeStatus = patientUtils.getVitalRangeStatus(latestVital.type, latestVital.value, latestVital.unit);
                                        const rangeColor = patientUtils.getVitalRangeColor(rangeStatus);

                                        return (
                                            <div key={type} className="text-center">
                                                <p className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                                                    {type.replace('_', ' ')}
                                                </p>
                                                <p className={`text-lg font-semibold mt-1 ${rangeColor}`}>
                                                    {latestVital.value} {latestVital.unit}
                                                </p>
                                                <p className="text-xs text-base-content/50">
                                                    {patientUtils.formatDate(latestVital.measured_at || latestVital.created_at || '')}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
};

export default VitalList;
