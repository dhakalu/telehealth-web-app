import React, { useEffect, useState } from "react";
import type { Medication } from "~/api/patient";
import { patientApi, patientUtils } from "~/api/patient";
import Card from "~/components/common/Card";
import { PrescriptionItem } from "./PrescriptionItem";
import {
    EmptyState,
    ErrorState,
    LoadingState,
    ResourceListHeader,
    ShowMoreSection,
    type BasePatientResourceListProps
} from "./shared/PatientResourceList";

export interface PrescriptionListProps extends BasePatientResourceListProps {
    /** Callback when a prescription is clicked */
    onPrescriptionClick?: (prescription: Medication) => void;
}

export const PrescriptionList: React.FC<PrescriptionListProps> = ({
    patientId,
    maxItems = 10,
    showHeader = true,
    title = "Prescriptions",
    className = "",
    showDetails = true,
    onViewAll,
    onPrescriptionClick
}) => {
    const [prescriptions, setPrescriptions] = useState<Medication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch prescriptions for the patient
    useEffect(() => {
        const fetchPrescriptions = async () => {
            if (!patientId) return;

            try {
                setLoading(true);
                const medications = await patientApi.getMedications(patientId);

                // Filter and sort medications
                setPrescriptions(medications);
                setError(null);
            } catch (err) {
                console.error('Error fetching prescriptions:', err);
                setError('Failed to load prescriptions');
            } finally {
                setLoading(false);
            }
        };

        fetchPrescriptions();
    }, [patientId]);

    // Group prescriptions by status for better organization
    const groupedPrescriptions = patientUtils.groupMedicationsByStatus(prescriptions);
    const displayedPrescriptions = prescriptions.slice(0, maxItems);
    const hasMorePrescriptions = prescriptions.length > maxItems;

    // Statistics
    const totalPrescriptions = prescriptions.length;
    const activePrescriptions = groupedPrescriptions.active?.length || 0;

    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <div className={`mt-6 ${className}`}>
            {/* Header with title and statistics */}
            {showHeader && (
                <ResourceListHeader
                    title={title}
                    totalCount={totalPrescriptions}
                    activeCount={activePrescriptions}
                    hasMore={hasMorePrescriptions}
                    onViewAll={onViewAll}
                />
            )}

            {/* Loading state */}
            {loading && <LoadingState message="Loading prescriptions..." />}

            {/* Error state */}
            {error && <ErrorState error={error} onRetry={handleRetry} />}

            {/* Empty state */}
            {!loading && !error && prescriptions.length === 0 && (
                <EmptyState
                    title="No Prescriptions Found"
                    description="No prescriptions have been recorded for this patient yet."
                />
            )}

            {/* Prescriptions grid */}
            {!loading && !error && prescriptions.length > 0 && (
                <div className="space-y-4">
                    {/* Responsive grid layout with uniform heights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 h-full lg:grid-cols-3 gap-4 items-start">
                        {displayedPrescriptions.map((prescription) => (
                            <PrescriptionItem
                                key={prescription.id}
                                prescription={prescription}
                                showDetails={showDetails}
                                onClick={onPrescriptionClick}
                                className="h-full"
                            />
                        ))}
                    </div>

                    {/* Show more button */}
                    {hasMorePrescriptions && onViewAll && (
                        <ShowMoreSection
                            currentCount={maxItems}
                            totalCount={prescriptions.length}
                            onViewAll={onViewAll}
                        />
                    )}

                    {/* Status breakdown */}
                    {showHeader && Object.keys(groupedPrescriptions).length > 1 && (
                        <Card additionalClassName="mt-6">
                            <div className="p-4">
                                <h3 className="text-sm font-medium text-base-content/70 mb-3">
                                    Prescription Status Breakdown
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(groupedPrescriptions).map(([status, meds]) => (
                                        <div
                                            key={status}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <div className={`w-3 h-3 rounded-full ${patientUtils.getMedicationStatusColor(status).replace('text-', 'bg-')}`}></div>
                                            <span className="capitalize">{status}: {meds.length}</span>
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

export default PrescriptionList;