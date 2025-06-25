import React from 'react';

interface PageHeaderProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ icon, title, description }) => (
    <div className="flex items-center gap-4 py-4">
        {icon && (
            <div className="flex items-center text-3xl">
                {icon}
            </div>
        )}
        <div>
            <div className="text-2xl font-semibold">{title}</div>
            {description && (
                <div className="opacity-60 mt-1">
                    {description}
                </div>
            )}
        </div>
    </div>
);

export default PageHeader;