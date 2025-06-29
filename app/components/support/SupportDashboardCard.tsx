import React from "react";

export interface SupportDashboardCardProps {
    title: string;
    content: string | React.ReactNode;
    icon: React.ReactNode;
    iconBgColor: string;
    iconColor: string;
    href?: string;
}

export default function SupportDashboardCard({
    title,
    content,
    icon,
    iconBgColor,
    iconColor,
    href
}: SupportDashboardCardProps) {
    const cardContent = (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:bg-gray-100 transition-colors">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <div className={`w-8 h-8 ${iconBgColor} rounded-full flex items-center justify-center`}>
                        <div className={`w-5 h-5 ${iconColor}`}>
                            {icon}
                        </div>
                    </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                            {title}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                            {content}
                        </dd>
                    </dl>
                </div>
            </div>
        </div>
    );

    if (href) {
        return (
            <a href={href} className="block">
                {cardContent}
            </a>
        );
    }

    return cardContent;
}

// Helper type for predefined card configurations
export type SupportCardConfig = {
    title: string;
    content?: string;
    href?: string;
    linkText?: string;
    iconBgColor: string;
    iconColor: string;
    icon: React.ReactNode;
};
