import React, { useEffect, useState } from "react";
import type { Allergy } from "~/api/patient";
import { patientApi, patientUtils } from "~/api/patient";
import Card from "~/components/common/Card";
import { AllergyItem } from "./AllergyItem";
import {
    EmptyState,
    ErrorState,
    LoadingState,
    ResourceListHeader,
    ShowMoreSection,
    type BasePatientResourceListProps
} from "./shared/PatientResourceList";

export interface AllergyListProps extends BasePatientResourceListProps {
    /** Callback when an allergy is clicked */
    onAllergyClick?: (allergy: Allergy) => void;
}

export const AllergyList: React.FC<AllergyListProps> = ({
    patientId,
    maxItems = 10,
    showHeader = true,
    title = "Allergies",
    className = "",
    showDetails = true,
    onViewAll,
    onAllergyClick
}) => {
    const [allergies, setAllergies] = useState<Allergy[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch allergies for the patient
    useEffect(() => {
        const fetchAllergies = async () => {
            if (!patientId) return;

            try {
                setLoading(true);
                const allergyData = await patientApi.getAllergies(patientId);

                // Filter out deleted allergies and sort by creation date
                const activeAllergies = patientUtils.filterActive(allergyData);
                const sortedAllergies = activeAllergies.sort((a, b) => {
                    // Sort by severity (most severe first) then by creation date
                    const severityOrder = { 'life-threatening': 4, 'severe': 3, 'moderate': 2, 'mild': 1 };
                    const severityA = severityOrder[a.severity as keyof typeof severityOrder] || 0;
                    const severityB = severityOrder[b.severity as keyof typeof severityOrder] || 0;

                    if (severityA !== severityB) {
                        return severityB - severityA;
                    }

                    // If same severity, sort by creation date (newest first)
                    const dateA = new Date(a.created_at || 0);
                    const dateB = new Date(b.created_at || 0);
                    return dateB.getTime() - dateA.getTime();
                });

                setAllergies(sortedAllergies);
                setError(null);
            } catch (err) {
                console.error('Error fetching allergies:', err);
                setError('Failed to load allergies');
            } finally {
                setLoading(false);
            }
        };

        fetchAllergies();
    }, [patientId]);

    // Group allergies by severity for better organization
    const groupedAllergies = allergies.reduce((groups, allergy) => {
        const severity = allergy.severity || 'unknown';
        if (!groups[severity]) {
            groups[severity] = [];
        }
        groups[severity].push(allergy);
        return groups;
    }, {} as Record<string, Allergy[]>);

    const displayedAllergies = allergies.slice(0, maxItems);
    const hasMoreAllergies = allergies.length > maxItems;

    // Statistics
    const totalAllergies = allergies.length;
    const severeAllergies = (groupedAllergies['severe']?.length || 0) + (groupedAllergies['life-threatening']?.length || 0);

    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <div className={`mt-6 ${className}`}>
            {/* Header with title and statistics */}
            {showHeader && (
                <ResourceListHeader
                    title={title}
                    totalCount={totalAllergies}
                    activeCount={severeAllergies}
                    hasMore={hasMoreAllergies}
                    onViewAll={onViewAll}
                />
            )}

            {/* Loading state */}
            {loading && <LoadingState message="Loading allergies..." />}

            {/* Error state */}
            {error && <ErrorState error={error} onRetry={handleRetry} />}

            {/* Empty state */}
            {!loading && !error && allergies.length === 0 && (
                <EmptyState
                    title="No Allergies Found"
                    description="No allergies have been recorded for this patient yet."
                />
            )}

            {/* Allergies grid */}
            {!loading && !error && allergies.length > 0 && (
                <div className="space-y-4">
                    {/* Responsive grid layout with uniform heights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 h-full lg:grid-cols-3 gap-4 items-start">
                        {displayedAllergies.map((allergy) => (
                            <AllergyItem
                                key={allergy.id}
                                allergy={allergy}
                                showDetails={showDetails}
                                onClick={onAllergyClick}
                                className="h-full"
                            />
                        ))}
                    </div>

                    {/* Show more button */}
                    {hasMoreAllergies && onViewAll && (
                        <ShowMoreSection
                            currentCount={maxItems}
                            totalCount={allergies.length}
                            onViewAll={onViewAll}
                        />
                    )}

                    {/* Severity breakdown */}
                    {showHeader && Object.keys(groupedAllergies).length > 1 && (
                        <Card additionalClassName="mt-6">
                            <div className="p-4">
                                <h3 className="text-sm font-medium text-base-content/70 mb-3">
                                    Allergy Severity Breakdown
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(groupedAllergies).map(([severity, allergyList]) => (
                                        <div
                                            key={severity}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <div className={`w-3 h-3 rounded-full ${patientUtils.getAllergySeverityColor(severity).replace('text-', 'bg-')}`}></div>
                                            <span className="capitalize">{severity.replace('-', ' ')}: {allergyList.length}</span>
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

export default AllergyList;
