import { LoaderFunction } from "react-router";
import { requireAuthCookie } from "~/auth";
import SupportDashboardCard from "~/components/support/SupportDashboardCard";
import SupportPageLayout from "~/components/support/SupportPageLayout";
import { configToCardProps, supportCards } from "~/components/support/supportCardConfigs";
import { usePageTitle } from "~/hooks";

export const loader: LoaderFunction = async ({ request }) => {
    const user = await requireAuthCookie(request);
    return user;
}

export default function SupportDashboard() {
    usePageTitle("Support Dashboard - MedTok");

    return (
        <SupportPageLayout title="Support Dashboard">
            <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Welcome to MedTok Support
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Your support staff dashboard is being set up. You'll have access to customer support tools, ticket management, and team collaboration features.
                    </p>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {supportCards.map((cardConfig, index) => (
                            <SupportDashboardCard
                                key={`${cardConfig.title}-${index}`}
                                {...configToCardProps(cardConfig)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </SupportPageLayout>
    );
}
