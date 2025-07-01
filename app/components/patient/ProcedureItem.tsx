import React from "react";
import type { Procedure } from "~/api/patient";
import { patientUtils } from "~/api/patient";
import Card from "~/components/common/Card";

export interface ProcedureItemProps {
    /** Procedure data */
    procedure: Procedure;
    /** Additional CSS classes */
    className?: string;
    /** Whether to show detailed information */
    showDetails?: boolean;
    /** Callback when procedure is clicked */
    onClick?: (procedure: Procedure) => void;
}

export const ProcedureItem: React.FC<ProcedureItemProps> = ({
    procedure,
    className = "",
    showDetails = true,
    onClick
}) => {
    const outcomeColor = patientUtils.getProcedureOutcomeColor(procedure.outcome);
    const performedDate = procedure.performed_on ? patientUtils.formatDate(procedure.performed_on) : null;

    const handleClick = () => {
        if (onClick) {
            onClick(procedure);
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
                                {procedure.name}
                            </h3>
                            {performedDate && (
                                <p className="text-sm text-base-content/70 mt-1">
                                    Performed: {performedDate}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`badge badge-sm ${outcomeColor} border-current`}>
                                {procedure.outcome}
                            </span>
                        </div>
                    </div>

                    {/* Details - grows to fill available space */}
                    {showDetails && (
                        <div className="flex-1 space-y-2">
                            {procedure.location && (
                                <div>
                                    <span className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                                        Location
                                    </span>
                                    <p className="text-sm text-base-content/80 mt-1">
                                        {procedure.location}
                                    </p>
                                </div>
                            )}

                            {procedure.source_id && (
                                <div>
                                    <span className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                                        Source ID
                                    </span>
                                    <p className="text-sm text-base-content/80 mt-1">
                                        {procedure.source_id}
                                    </p>
                                </div>
                            )}

                            {procedure.notes && (
                                <div>
                                    <span className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                                        Notes
                                    </span>
                                    <p className="text-sm text-base-content/80 mt-1 overflow-hidden" style={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical'
                                    }}>
                                        {procedure.notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Compact view for when details are hidden - stays at bottom */}
                    {!showDetails && (
                        <div className="flex items-center justify-between text-sm text-base-content/70 mt-auto">
                            {procedure.location && (
                                <span>{procedure.location}</span>
                            )}
                            {performedDate && (
                                <span>{performedDate}</span>
                            )}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default ProcedureItem;
