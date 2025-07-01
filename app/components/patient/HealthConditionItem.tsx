import React from "react";
import type { HealthCondition } from "~/api/patient";
import { patientUtils } from "~/api/patient";
import Card from "~/components/common/Card";
import DetailItem from "~/components/common/DetailItem";

export interface HealthConditionItemProps {
    /** Health condition data */
    condition: HealthCondition;
    /** Additional CSS classes */
    className?: string;
    /** Whether to show detailed information */
    showDetails?: boolean;
    /** Callback when condition is clicked */
    onClick?: (condition: HealthCondition) => void;
}

export const HealthConditionItem: React.FC<HealthConditionItemProps> = ({
    condition,
    className = "",
    showDetails = true,
    onClick
}) => {
    const statusColor = patientUtils.getConditionStatusColor(condition.status);
    const diagnosedDate = condition.diagnosed_on ? patientUtils.formatDate(condition.diagnosed_on) : null;

    const handleClick = () => {
        if (onClick) {
            onClick(condition);
        }
    };

    return (
        <div
            className={`h-full ${onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
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
                                {condition.name}
                            </h3>
                            {diagnosedDate && (
                                <p className="text-sm text-base-content/70 mt-1">
                                    Diagnosed: {diagnosedDate}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`badge badge-sm ${statusColor} border-current`}>
                                {condition.status}
                            </span>
                        </div>
                    </div>

                    {/* Details - grows to fill available space */}
                    {showDetails && (
                        <div className="flex-1 space-y-2">
                            {condition.source_id && (
                                <DetailItem
                                    label="Source ID"
                                    value={condition.source_id}
                                />
                            )}

                            {condition.notes && (
                                <DetailItem
                                    label="Notes"
                                    value={condition.notes}
                                    maxLines={3}
                                />
                            )}
                        </div>
                    )}

                    {/* Compact view for when details are hidden - stays at bottom */}
                    {!showDetails && (
                        <div className="flex items-center justify-between text-sm text-base-content/70 mt-auto">
                            {condition.source_id && (
                                <span>Source: {condition.source_id}</span>
                            )}
                            {diagnosedDate && (
                                <span>{diagnosedDate}</span>
                            )}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default HealthConditionItem;
