import React from "react";
import DashboardCard from "~/components/common/dahboard-card/SupportDashboardCard";
import { configToCardProps, patientHealthCards } from "./patientHealthConfigurations";

export interface MyHealthProps {
    /** Additional CSS classes */
    className?: string;
}

export const MyHealth: React.FC<MyHealthProps> = ({
    className = ""
}) => {
    return (
        <div className={`bg-base-200 ${className}`}>
            <div className="mx-auto sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0">
                    <div className="overflow-hidden shadow rounded-lg bg-base-100">
                        <div className="px-4 py-5 sm:p-6">
                            <h2 className="text-lg font-medium text-base-content mb-4">
                                Health Records Overview
                            </h2>
                            <p className="text-base-content opacity-70 mb-6">
                                View and manage your medical records, prescriptions, test results, and health history.
                            </p>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {patientHealthCards.map((cardConfig, index) => (
                                    <DashboardCard
                                        key={`${cardConfig.title}-${index}`}
                                        {...configToCardProps(cardConfig)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyHealth;
