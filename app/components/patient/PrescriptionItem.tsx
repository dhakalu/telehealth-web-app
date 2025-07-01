import React from "react";
import type { PrescriptionWithDetails } from "~/api/prescription";
import { prescriptionUtils } from "~/api/prescription";
import Card from "~/components/common/Card";
import DetailItem from "~/components/common/DetailItem";

export interface PrescriptionItemProps {
    /** Prescription data */
    prescription: PrescriptionWithDetails;
    /** Additional CSS classes */
    className?: string;
    /** Whether to show detailed information */
    showDetails?: boolean;
    /** Callback when prescription is clicked */
    onClick?: (prescription: PrescriptionWithDetails) => void;
}

export const PrescriptionItem: React.FC<PrescriptionItemProps> = ({
    prescription,
    className = "",
    showDetails = true,
    onClick
}) => {
    const statusColor = prescriptionUtils.getStatusColor(prescription.status);
    const prescribedDate = prescriptionUtils.formatDate(prescription.prescribed_date);
    const expiryDate = prescription.expiry_date ? prescriptionUtils.formatDate(prescription.expiry_date) : null;

    const handleClick = () => {
        if (onClick) {
            onClick(prescription);
        }
    };

    return (
        <div
            className={`${onClick ? 'cursor-pointer h-full hover:opacity-90 transition-opacity' : ''}`}
            onClick={handleClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={onClick ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                }
            } : undefined}
        >
            <Card
                additionalClassName={`${className} h-full`}
                hasBorder
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-base-content">
                                {prescription.medication_name}
                            </h3>
                            {prescription.strength && (
                                <p className="text-sm text-base-content/70 mt-1">
                                    {prescription.strength}
                                    {prescription.frequency && ` • ${prescription.frequency}`}
                                    {prescription.quantity && ` • Qty: ${prescription.quantity}`}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`badge badge-sm ${statusColor} border-current`}>
                                {prescription.status}
                            </span>
                            {prescription.is_controlled_substance && (
                                <span className="badge badge-warning badge-sm">
                                    Controlled
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Details - grows to fill available space */}
                    {showDetails && (
                        <div className="flex-1 space-y-2">
                            {prescription.directions_for_use && (
                                <DetailItem
                                    label="Directions"
                                    value={prescription.directions_for_use}
                                    maxLines={3}
                                />
                            )}

                            {prescription.practitioner_name && (
                                <DetailItem
                                    label="Prescribed by"
                                    value={prescription.practitioner_name}
                                />
                            )}

                            <DetailItem
                                label="Pharmacy"
                                value={prescription.pharmacy_name || "N/A"}
                            />

                            {(prescribedDate || expiryDate) && (
                                <DetailItem
                                    label="Dates"
                                    value={`${prescribedDate ? `Prescribed: ${prescribedDate}` : ''}${prescribedDate && expiryDate ? ' • ' : ''}${expiryDate ? `Expires: ${expiryDate}` : ''}`}
                                />
                            )}

                            {prescription.refills_remaining !== undefined && (
                                <DetailItem
                                    label="Refills"
                                    value={`${prescription.refills_remaining} of ${prescription.refills_authorized} remaining`}
                                />
                            )}

                            {prescription.notes && (
                                <DetailItem
                                    label="Notes"
                                    value={prescription.notes}
                                    maxLines={2}
                                />
                            )}
                        </div>
                    )}

                    {/* Compact view for when details are hidden - stays at bottom */}
                    {!showDetails && (
                        <div className="flex items-center justify-between text-sm text-base-content/70 mt-auto">
                            {prescription.practitioner_name && (
                                <span>Prescribed by {prescription.practitioner_name}</span>
                            )}
                            {prescribedDate && (
                                <span>{prescribedDate}</span>
                            )}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default PrescriptionItem;
