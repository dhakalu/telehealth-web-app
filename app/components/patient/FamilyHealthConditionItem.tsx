import React from "react";
import type { FamilyHealthCondition } from "~/api/patient";
import { patientUtils } from "~/api/patient";
import Card from "~/components/common/Card";

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
                                <div>
                                    <span className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                                        Family Relation
                                    </span>
                                    <p className="text-sm text-base-content opacity-80 mt-1">
                                        {familyHealthCondition.relation.charAt(0).toUpperCase() + familyHealthCondition.relation.slice(1)}
                                    </p>
                                </div>
                            )}

                            {familyHealthCondition.condition && (
                                <div>
                                    <span className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                                        Condition
                                    </span>
                                    <p className="text-sm text-base-content opacity-80 mt-1 overflow-hidden" style={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical'
                                    }}>
                                        {familyHealthCondition.condition}
                                    </p>
                                </div>
                            )}

                            {familyHealthCondition.status && (
                                <div>
                                    <span className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                                        Status
                                    </span>
                                    <p className={`text-sm mt-1 ${statusColor} font-medium`}>
                                        {familyHealthCondition.status.charAt(0).toUpperCase() + familyHealthCondition.status.slice(1)}
                                    </p>
                                </div>
                            )}

                            {familyHealthCondition.notes && (
                                <div>
                                    <span className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                                        Notes
                                    </span>
                                    <p className="text-sm text-base-content opacity-80 mt-1 overflow-hidden" style={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical'
                                    }}>
                                        {familyHealthCondition.notes}
                                    </p>
                                </div>
                            )}

                            {createdDate && (
                                <div>
                                    <span className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                                        Recorded
                                    </span>
                                    <p className="text-sm text-base-content opacity-80 mt-1">
                                        {createdDate}
                                    </p>
                                </div>
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
