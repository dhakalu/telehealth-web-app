import { ReactNode } from "react";

interface StatisticsCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    colorClass: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'yellow' | 'indigo' | 'gray';
}

const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    gray: 'bg-gray-100 opacity-60',
};

export default function StatisticsCard({ title, value, icon, colorClass }: StatisticsCardProps) {
    return (
        <div className="overflow-hidden shadow rounded-lg bg-base-300 border">
            <div className="p-5">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClasses[colorClass]}`}>
                            {icon}
                        </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium opacity-50 truncate">{title}</dt>
                            <dd className="text-lg font-medium opacity-90">{value}</dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}
