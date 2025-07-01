import React, { useEffect, useState } from "react";
import type { PrescriptionWithDetails } from "~/api/prescription";
import { prescriptionApi, prescriptionUtils } from "~/api/prescription";
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
    onPrescriptionClick?: (prescription: PrescriptionWithDetails) => void;
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
    const [prescriptions, setPrescriptions] = useState<PrescriptionWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch prescriptions for the patient
    useEffect(() => {
        const fetchPrescriptions = async () => {
            if (!patientId) return;

            try {
                setLoading(true);
                const response = await prescriptionApi.getPrescriptions({
                    patient_id: patientId,
                    limit: 100, // Get more than we need for proper filtering
                    offset: 0
                });

                // Sort prescriptions by prescribed date (newest first)
                const sortedPrescriptions = response.prescriptions.sort((a, b) =>
                    new Date(b.prescribed_date).getTime() - new Date(a.prescribed_date).getTime()
                );

                setPrescriptions(sortedPrescriptions);
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
    const groupedPrescriptions = prescriptions.reduce((groups, prescription) => {
        const status = prescription.status;
        if (!groups[status]) {
            groups[status] = [];
        }
        groups[status].push(prescription);
        return groups;
    }, {} as Record<string, PrescriptionWithDetails[]>);
    const displayedPrescriptions = prescriptions.slice(0, maxItems);
    const hasMorePrescriptions = prescriptions.length > maxItems;

    // Statistics
    const totalPrescriptions = prescriptions.length;
    const activePrescriptions = groupedPrescriptions.pending?.length + groupedPrescriptions.sent?.length || 0;

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
                                    {Object.entries(groupedPrescriptions).map(([status, prescriptions]) => (
                                        <div
                                            key={status}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <div className={`w-3 h-3 rounded-full ${prescriptionUtils.getStatusColor(status as 'pending' | 'sent' | 'filled' | 'cancelled' | 'rejected' | 'expired').replace('text-', 'bg-')}`}></div>
                                            <span className="capitalize">{status}: {prescriptions.length}</span>
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