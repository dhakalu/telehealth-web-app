import React from "react";
import type { Allergy } from "~/api/patient";
import { patientUtils } from "~/api/patient";
import Card from "~/components/common/Card";

export interface AllergyItemProps {
    /** Allergy data */
    allergy: Allergy;
    /** Additional CSS classes */
    className?: string;
    /** Whether to show detailed information */
    showDetails?: boolean;
    /** Callback when allergy is clicked */
    onClick?: (allergy: Allergy) => void;
}

export const AllergyItem: React.FC<AllergyItemProps> = ({
    allergy,
    className = "",
    showDetails = true,
    onClick
}) => {
    const severityColor = patientUtils.getAllergySeverityColor(allergy.severity);

    const handleClick = () => {
        if (onClick) {
            onClick(allergy);
        }
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
                                {allergy.substance}
                            </h3>
                            {allergy.reaction && (
                                <p className="text-sm text-base-content/70 mt-1">
                                    {allergy.reaction}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`badge badge-sm ${severityColor} border-current`}>
                                {allergy.severity}
                            </span>
                            {allergy.status && (
                                <span className="badge badge-sm badge-outline">
                                    {allergy.status}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Details - grows to fill available space */}
                    {showDetails && (
                        <div className="flex-1 space-y-2">
                            {allergy.reaction && (
                                <div>
                                    <span className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                                        Reaction
                                    </span>
                                    <p className="text-sm text-base-content opacity-80 mt-1 overflow-hidden" style={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical'
                                    }}>
                                        {allergy.reaction}
                                    </p>
                                </div>
                            )}

                            {allergy.severity && (
                                <div>
                                    <span className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                                        Severity
                                    </span>
                                    <p className={`text-sm mt-1 ${severityColor} font-medium`}>
                                        {allergy.severity.charAt(0).toUpperCase() + allergy.severity.slice(1).replace('-', ' ')}
                                    </p>
                                </div>
                            )}

                            {allergy.status && (
                                <div>
                                    <span className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                                        Status
                                    </span>
                                    <p className="text-sm text-base-content opacity-80 mt-1">
                                        {allergy.status.charAt(0).toUpperCase() + allergy.status.slice(1)}
                                    </p>
                                </div>
                            )}

                            {allergy.notes && (
                                <div>
                                    <span className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                                        Notes
                                    </span>
                                    <p className="text-sm text-base-content opacity-80 mt-1 overflow-hidden" style={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical'
                                    }}>
                                        {allergy.notes}
                                    </p>
                                </div>
                            )}

                            {allergy.created_at && (
                                <div>
                                    <span className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                                        Recorded
                                    </span>
                                    <p className="text-sm text-base-content opacity-80 mt-1">
                                        {patientUtils.formatDate(allergy.created_at)}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Compact view for when details are hidden - stays at bottom */}
                    {!showDetails && (
                        <div className="flex items-center justify-between text-sm text-base-content/70 mt-auto">
                            {allergy.severity && (
                                <span className={severityColor}>
                                    {allergy.severity.charAt(0).toUpperCase() + allergy.severity.slice(1).replace('-', ' ')}
                                </span>
                            )}
                            {allergy.created_at && (
                                <span>{patientUtils.formatDate(allergy.created_at)}</span>
                            )}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AllergyItem;
