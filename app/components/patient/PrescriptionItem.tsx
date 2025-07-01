import React from "react";
import type { Medication } from "~/api/patient";
import { patientUtils } from "~/api/patient";
import Card from "~/components/common/Card";

export interface PrescriptionItemProps {
    /** Prescription/Medication data */
    prescription: Medication;
    /** Additional CSS classes */
    className?: string;
    /** Whether to show detailed information */
    showDetails?: boolean;
    /** Callback when prescription is clicked */
    onClick?: (prescription: Medication) => void;
}

export const PrescriptionItem: React.FC<PrescriptionItemProps> = ({
    prescription,
    className = "",
    showDetails = true,
    onClick
}) => {
    const statusColor = patientUtils.getMedicationStatusColor(prescription.status);
    const startDate = prescription.start_date ? patientUtils.formatDate(prescription.start_date) : null;
    const endDate = prescription.end_date ? patientUtils.formatDate(prescription.end_date) : null;

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
                                {prescription.name}
                            </h3>
                            {prescription.dosage && (
                                <p className="text-sm text-base-content/70 mt-1">
                                    {prescription.dosage}
                                    {prescription.frequency && ` • ${prescription.frequency}`}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`badge badge-sm ${statusColor} border-current`}>
                                {prescription.status}
                            </span>
                        </div>
                    </div>

                    {/* Details - grows to fill available space */}
                    {showDetails && (
                        <div className="flex-1 space-y-2">
                            {prescription.direction && (
                                <div>
                                    <span className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                                        Directions
                                    </span>
                                    <p className="text-sm text-base-content opacity-80 mt-1 overflow-hidden" style={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical'
                                    }}>
                                        {prescription.direction}
                                    </p>
                                </div>
                            )}

                            {prescription.prescribed_by && (
                                <div>
                                    <span className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                                        Prescribed by
                                    </span>
                                    <p className="text-sm text-base-content opacity-80 mt-1">
                                        {prescription.prescribed_by}
                                    </p>
                                </div>
                            )}

                            {(startDate || endDate) && (
                                <div>
                                    <span className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                                        Duration
                                    </span>
                                    <p className="text-sm text-base-content opacity-80 mt-1">
                                        {startDate && `Start: ${startDate}`}
                                        {startDate && endDate && ' • '}
                                        {endDate && `End: ${endDate}`}
                                    </p>
                                </div>
                            )}

                            {prescription.notes && (
                                <div>
                                    <span className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                                        Notes
                                    </span>
                                    <p className="text-sm text-base-content opacity-80 mt-1 overflow-hidden" style={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical'
                                    }}>
                                        {prescription.notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Compact view for when details are hidden - stays at bottom */}
                    {!showDetails && (
                        <div className="flex items-center justify-between text-sm text-base-content/70 mt-auto">
                            {prescription.prescribed_by && (
                                <span>Prescribed by {prescription.prescribed_by}</span>
                            )}
                            {startDate && (
                                <span>{startDate}</span>
                            )}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default PrescriptionItem;
