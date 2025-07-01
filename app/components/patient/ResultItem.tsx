import React from "react";
import type { Result } from "~/api/patient";
import { patientUtils } from "~/api/patient";
import Card from "~/components/common/Card";

export interface ResultItemProps {
    /** Result data */
    result: Result;
    /** Additional CSS classes */
    className?: string;
    /** Whether to show detailed information */
    showDetails?: boolean;
    /** Callback when result is clicked */
    onClick?: (result: Result) => void;
}

export const ResultItem: React.FC<ResultItemProps> = ({
    result,
    className = "",
    showDetails = true,
    onClick
}) => {
    const resultTypeColor = patientUtils.getResultTypeColor(result.type);
    const resultStatus = patientUtils.getResultStatus(result.value, result.reference_range);
    const statusColor = patientUtils.getResultStatusColor(resultStatus);
    const resultDate = result.result_date ? patientUtils.formatDate(result.result_date) : null;
    const createdDate = result.created_at ? patientUtils.formatDate(result.created_at) : null;

    const handleClick = () => {
        if (onClick) {
            onClick(result);
        }
    };

    // Format result value with unit
    const formatResultValue = (value: string, unit: string) => {
        return `${value}${unit ? ` ${unit}` : ''}`;
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
                                {result.type?.charAt(0).toUpperCase() + result.type?.slice(1).replace('_', ' ') || 'Test Result'}
                            </h3>
                            <p className="text-sm text-base-content/70 mt-1">
                                <span className={`font-medium ${statusColor}`}>
                                    {formatResultValue(result.value, result.unit)}
                                </span>
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`badge badge-sm ${resultTypeColor} border-current`}>
                                {result.type}
                            </span>
                            {resultStatus !== 'unknown' && (
                                <span className={`badge badge-sm ${statusColor} border-current`}>
                                    {resultStatus}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Details - grows to fill available space */}
                    {showDetails && (
                        <div className="flex-1 space-y-2">
                            <div>
                                <span className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                                    Result
                                </span>
                                <p className={`text-sm mt-1 ${statusColor} font-medium`}>
                                    {formatResultValue(result.value, result.unit)}
                                </p>
                            </div>

                            {result.reference_range && (
                                <div>
                                    <span className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                                        Reference Range
                                    </span>
                                    <p className="text-sm text-base-content opacity-80 mt-1">
                                        {result.reference_range}
                                    </p>
                                </div>
                            )}

                            {result.type && (
                                <div>
                                    <span className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                                        Test Type
                                    </span>
                                    <p className="text-sm text-base-content opacity-80 mt-1">
                                        {result.type.charAt(0).toUpperCase() + result.type.slice(1).replace('_', ' ')}
                                    </p>
                                </div>
                            )}

                            {result.unit && (
                                <div>
                                    <span className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                                        Unit
                                    </span>
                                    <p className="text-sm text-base-content opacity-80 mt-1">
                                        {result.unit}
                                    </p>
                                </div>
                            )}

                            {result.notes && (
                                <div>
                                    <span className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                                        Notes
                                    </span>
                                    <p className="text-sm text-base-content opacity-80 mt-1 overflow-hidden" style={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical'
                                    }}>
                                        {result.notes}
                                    </p>
                                </div>
                            )}

                            {resultDate && (
                                <div>
                                    <span className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                                        Test Date
                                    </span>
                                    <p className="text-sm text-base-content opacity-80 mt-1">
                                        {resultDate}
                                    </p>
                                </div>
                            )}

                            {createdDate && !resultDate && (
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
                            <span className={statusColor}>
                                {formatResultValue(result.value, result.unit)}
                            </span>
                            {resultDate && (
                                <span>{resultDate}</span>
                            )}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default ResultItem;
