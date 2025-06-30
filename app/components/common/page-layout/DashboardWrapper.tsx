import React, { ReactNode } from "react";


export interface DashboardWrapperProps {
    children: ReactNode;
    title?: string;
    maxItemsInRow?: number;
    subtitle?: string;
}

export default function DashboardWrapper({ children, title, subtitle, maxItemsInRow }: DashboardWrapperProps) {
    const largeCols = children ? Math.min(maxItemsInRow || 4, React.Children.count(children)) : 1;
    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="overflow-hidden shadow rounded-lg bg-base-100">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-lg font-medium text-base-content mb-4">
                            {title}
                        </h2>
                        <p className="text-base-content opacity-70 mb-6">
                            {subtitle}
                        </p>
                        <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-${largeCols}`}>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}