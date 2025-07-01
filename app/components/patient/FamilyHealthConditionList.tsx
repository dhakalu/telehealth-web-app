import React, { useEffect, useState } from "react";
import type { FamilyHealthCondition } from "~/api/patient";
import { patientApi, patientUtils } from "~/api/patient";
import Card from "~/components/common/Card";
import { FamilyHealthConditionItem } from "./FamilyHealthConditionItem";
import {
    EmptyState,
    ErrorState,
    LoadingState,
    ResourceListHeader,
    ShowMoreSection,
    type BasePatientResourceListProps
} from "./shared/PatientResourceList";

export interface FamilyHealthConditionListProps extends BasePatientResourceListProps {
    /** Callback when a family health condition is clicked */
    onFamilyHealthConditionClick?: (familyHealthCondition: FamilyHealthCondition) => void;
}

export const FamilyHealthConditionList: React.FC<FamilyHealthConditionListProps> = ({
    patientId,
    maxItems = 10,
    showHeader = true,
    title = "Family Health Conditions",
    className = "",
    showDetails = true,
    onViewAll,
    onFamilyHealthConditionClick
}) => {
    const [familyHealthConditions, setFamilyHealthConditions] = useState<FamilyHealthCondition[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch family health conditions for the patient
    useEffect(() => {
        const fetchFamilyHealthConditions = async () => {
            if (!patientId) return;

            try {
                setLoading(true);
                const conditionData = await patientApi.getFamilyHealthConditions(patientId);

                // Filter out deleted conditions and sort by creation date
                const activeConditions = patientUtils.filterActive(conditionData);
                const sortedConditions = activeConditions.sort((a, b) => {
                    // Sort by relation (immediate family first) then by creation date
                    const relationOrder = {
                        'parent': 5,
                        'father': 5,
                        'mother': 5,
                        'sibling': 4,
                        'brother': 4,
                        'sister': 4,
                        'child': 3,
                        'son': 3,
                        'daughter': 3,
                        'grandparent': 2,
                        'grandchild': 1
                    };

                    const relationA = relationOrder[a.relation?.toLowerCase() as keyof typeof relationOrder] || 0;
                    const relationB = relationOrder[b.relation?.toLowerCase() as keyof typeof relationOrder] || 0;

                    if (relationA !== relationB) {
                        return relationB - relationA;
                    }

                    // If same relation type, sort by creation date (newest first)
                    const dateA = new Date(a.created_at || 0);
                    const dateB = new Date(b.created_at || 0);
                    return dateB.getTime() - dateA.getTime();
                });

                setFamilyHealthConditions(sortedConditions);
                setError(null);
            } catch (err) {
                console.error('Error fetching family health conditions:', err);
                setError('Failed to load family health conditions');
            } finally {
                setLoading(false);
            }
        };

        fetchFamilyHealthConditions();
    }, [patientId]);

    // Group family health conditions by relation for better organization
    const groupedConditions = familyHealthConditions.reduce((groups, condition) => {
        const relation = condition.relation || 'unknown';
        if (!groups[relation]) {
            groups[relation] = [];
        }
        groups[relation].push(condition);
        return groups;
    }, {} as Record<string, FamilyHealthCondition[]>);

    const displayedConditions = familyHealthConditions.slice(0, maxItems);
    const hasMoreConditions = familyHealthConditions.length > maxItems;

    // Statistics
    const totalConditions = familyHealthConditions.length;
    const immediateFamily = familyHealthConditions.filter(condition =>
        ['parent', 'father', 'mother', 'sibling', 'brother', 'sister', 'child', 'son', 'daughter']
            .includes(condition.relation?.toLowerCase() || '')
    ).length;

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
                    activeCount={immediateFamily}
                    hasMore={hasMoreConditions}
                    onViewAll={onViewAll}
                />
            )}

            {/* Loading state */}
            {loading && <LoadingState message="Loading family health conditions..." />}

            {/* Error state */}
            {error && <ErrorState error={error} onRetry={handleRetry} />}

            {/* Empty state */}
            {!loading && !error && familyHealthConditions.length === 0 && (
                <EmptyState
                    title="No Family Health Conditions Found"
                    description="No family health conditions have been recorded for this patient yet."
                />
            )}

            {/* Family Health Conditions grid */}
            {!loading && !error && familyHealthConditions.length > 0 && (
                <div className="space-y-4">
                    {/* Responsive grid layout with uniform heights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 h-full lg:grid-cols-3 gap-4 items-start">
                        {displayedConditions.map((condition) => (
                            <FamilyHealthConditionItem
                                key={condition.id}
                                familyHealthCondition={condition}
                                showDetails={showDetails}
                                onClick={onFamilyHealthConditionClick}
                                className="h-full"
                            />
                        ))}
                    </div>

                    {/* Show more button */}
                    {hasMoreConditions && onViewAll && (
                        <ShowMoreSection
                            currentCount={maxItems}
                            totalCount={familyHealthConditions.length}
                            onViewAll={onViewAll}
                        />
                    )}

                    {/* Relation breakdown */}
                    {showHeader && Object.keys(groupedConditions).length > 1 && (
                        <Card additionalClassName="mt-6">
                            <div className="p-4">
                                <h3 className="text-sm font-medium text-base-content/70 mb-3">
                                    Family Relation Breakdown
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(groupedConditions).map(([relation, conditionList]) => (
                                        <div
                                            key={relation}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                            <span className="capitalize">{relation}: {conditionList.length}</span>
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

export default FamilyHealthConditionList;
