import { LoaderFunction } from "react-router";
import { requireAuthCookie } from "~/auth";
import { configToCardProps, supportCards } from "~/components/common/dahboard-card/supportCardConfigs";
import DashboardCard from "~/components/common/dahboard-card/SupportDashboardCard";
import DashboardWrapper from "~/components/common/page-layout/DashboardWrapper";
import SupportPageLayout from "~/components/common/page-layout/PageLayout";
import { usePageTitle } from "~/hooks";

export const loader: LoaderFunction = async ({ request }) => {
    const user = await requireAuthCookie(request);
    return user;
}

export default function SupportDashboard() {
    usePageTitle("Support Dashboard - MedTok");

    return (
        <SupportPageLayout title="Support Dashboard">
            <DashboardWrapper>
                {supportCards.map((cardConfig, index) => (
                    <DashboardCard
                        key={`${cardConfig.title}-${index}`}
                        {...configToCardProps(cardConfig)}
                    />
                ))}
            </DashboardWrapper>
        </SupportPageLayout>
    );
}
