import React from "react";
import type { FamilyHealthCondition } from "~/api/patient";
import { patientUtils } from "~/api/patient";
import Card from "~/components/common/Card";
import DetailItem from "~/components/common/DetailItem";

export interface FamilyHealthConditionItemProps {
    /** Family Health Condition data */
    familyHealthCondition: FamilyHealthCondition;
    /** Additional CSS classes */
    className?: string;
    /** Whether to show detailed information */
    showDetails?: boolean;
    /** Callback when family health condition is clicked */
    onClick?: (familyHealthCondition: FamilyHealthCondition) => void;
}

export const FamilyHealthConditionItem: React.FC<FamilyHealthConditionItemProps> = ({
    familyHealthCondition,
    className = "",
    showDetails = true,
    onClick
}) => {
    const statusColor = patientUtils.getConditionStatusColor(familyHealthCondition.status);
    const createdDate = familyHealthCondition.created_at ? patientUtils.formatDate(familyHealthCondition.created_at) : null;

    const handleClick = () => {
        if (onClick) {
            onClick(familyHealthCondition);
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
                                {familyHealthCondition.condition}
                            </h3>
                            {familyHealthCondition.relation && (
                                <p className="text-sm text-base-content/70 mt-1">
                                    Relation: {familyHealthCondition.relation}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {familyHealthCondition.status && (
                                <span className={`badge badge-sm ${statusColor} border-current`}>
                                    {familyHealthCondition.status}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Details - grows to fill available space */}
                    {showDetails && (
                        <div className="flex-1 space-y-2">
                            {familyHealthCondition.relation && (
                                <DetailItem
                                    label="Family Relation"
                                    value={familyHealthCondition.relation.charAt(0).toUpperCase() + familyHealthCondition.relation.slice(1)}
                                />
                            )}

                            {familyHealthCondition.condition && (
                                <DetailItem
                                    label="Condition"
                                    value={familyHealthCondition.condition}
                                    maxLines={3}
                                />
                            )}

                            {familyHealthCondition.status && (
                                <DetailItem
                                    label="Status"
                                    value={familyHealthCondition.status.charAt(0).toUpperCase() + familyHealthCondition.status.slice(1)}
                                    className={statusColor}
                                />
                            )}

                            {familyHealthCondition.notes && (
                                <DetailItem
                                    label="Notes"
                                    value={familyHealthCondition.notes}
                                    maxLines={2}
                                />
                            )}

                            {createdDate && (
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
                            {familyHealthCondition.relation && (
                                <span>{familyHealthCondition.relation}</span>
                            )}
                            {createdDate && (
                                <span>{createdDate}</span>
                            )}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default FamilyHealthConditionItem;
