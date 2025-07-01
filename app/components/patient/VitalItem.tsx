import React from "react";
import type { Vital } from "~/api/patient";
import { patientUtils } from "~/api/patient";
import Card from "~/components/common/Card";
import DetailItem from "~/components/common/DetailItem";

export interface VitalItemProps {
    /** Vital data */
    vital: Vital;
    /** Additional CSS classes */
    className?: string;
    /** Whether to show detailed information */
    showDetails?: boolean;
    /** Callback when vital is clicked */
    onClick?: (vital: Vital) => void;
}

export const VitalItem: React.FC<VitalItemProps> = ({
    vital,
    className = "",
    showDetails = true,
    onClick
}) => {
    const vitalTypeColor = patientUtils.getVitalTypeColor(vital.type);
    const measuredDate = vital.measured_at ? patientUtils.formatDate(vital.measured_at) : null;
    const createdDate = vital.created_at ? patientUtils.formatDate(vital.created_at) : null;

    const handleClick = () => {
        if (onClick) {
            onClick(vital);
        }
    };

    // Format vital value with unit
    const formatVitalValue = (value: string, unit: string) => {
        return `${value}${unit ? ` ${unit}` : ''}`;
    };

    return (
        <div
            className={`h-full ${onClick ? 'cursor-pointer h-full hover:opacity-90 transition-opacity' : ''}`}
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
                                {vital.type?.charAt(0).toUpperCase() + vital.type?.slice(1) || 'Vital Sign'}
                            </h3>
                            <p className="text-sm text-base-content/70 mt-1">
                                <span className={`font-medium ${vitalTypeColor}`}>
                                    {formatVitalValue(vital.value, vital.unit)}
                                </span>
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`badge badge-sm ${vitalTypeColor} border-current`}>
                                {vital.type}
                            </span>
                        </div>
                    </div>

                    {/* Details - grows to fill available space */}
                    {showDetails && (
                        <div className="flex-1 space-y-2">
                            <DetailItem
                                label="Measurement"
                                value={formatVitalValue(vital.value, vital.unit)}
                                className={vitalTypeColor}
                            />

                            {vital.type && (
                                <DetailItem
                                    label="Type"
                                    value={vital.type.charAt(0).toUpperCase() + vital.type.slice(1).replace('_', ' ')}
                                />
                            )}

                            {vital.unit && (
                                <DetailItem
                                    label="Unit"
                                    value={vital.unit}
                                />
                            )}

                            {measuredDate && (
                                <DetailItem
                                    label="Measured On"
                                    value={measuredDate}
                                />
                            )}

                            {createdDate && !measuredDate && (
                                <DetailItem
                                    label="Recorded"
                                    value={createdDate}
                                />
                            )}
                        </div>
                    )}

                    {/* Compact view for when details are hidden - stays at bottom */}
                    {!showDetails && (
                        <div className="flex items-center justify-between text-sm text-base-content/70 mt-auto">
                            <span className={vitalTypeColor}>
                                {formatVitalValue(vital.value, vital.unit)}
                            </span>
                            {measuredDate && (
                                <span>{measuredDate}</span>
                            )}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default VitalItem;
