import React from "react";
import type { Immunization } from "~/api/patient";
import { patientUtils } from "~/api/patient";
import Card from "~/components/common/Card";
import DetailItem from "~/components/common/DetailItem";

export interface ImmunizationItemProps {
    /** Immunization data */
    immunization: Immunization;
    /** Additional CSS classes */
    className?: string;
    /** Whether to show detailed information */
    showDetails?: boolean;
    /** Callback when immunization is clicked */
    onClick?: (immunization: Immunization) => void;
}

export const ImmunizationItem: React.FC<ImmunizationItemProps> = ({
    immunization,
    className = "",
    showDetails = true,
    onClick
}) => {
    const administeredDate = immunization.date_administered ? patientUtils.formatDate(immunization.date_administered) : null;

    const handleClick = () => {
        if (onClick) {
            onClick(immunization);
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
                                {immunization.vaccine}
                            </h3>
                            {administeredDate && (
                                <p className="text-sm text-base-content/70 mt-1">
                                    Administered: {administeredDate}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="badge badge-sm badge-success border-current">
                                Vaccinated
                            </span>
                        </div>
                    </div>

                    {/* Details - grows to fill available space */}
                    {showDetails && (
                        <div className="flex-1 space-y-2">
                            {immunization.notes && (
                                <DetailItem
                                    label="Notes"
                                    value={immunization.notes}
                                    maxLines={3}
                                />
                            )}

                            {immunization.date_administered && (
                                <DetailItem
                                    label="Administration Date"
                                    value={patientUtils.formatDate(immunization.date_administered)}
                                />
                            )}
                        </div>
                    )}

                    {/* Compact view for when details are hidden - stays at bottom */}
                    {!showDetails && (
                        <div className="flex items-center justify-between text-sm text-base-content/70 mt-auto">
                            <span>Vaccine</span>
                            {administeredDate && (
                                <span>{administeredDate}</span>
                            )}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default ImmunizationItem;
