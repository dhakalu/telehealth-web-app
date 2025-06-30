import { LoaderFunctionArgs } from "react-router";
import { requireAuthCookie } from "~/auth";
import { configToCardProps, patientCards } from "~/components/common/dahboard-card/patientCardConfigs";
import DashboardCard from "~/components/common/dahboard-card/SupportDashboardCard";
import DashboardWrapper from "~/components/common/page-layout/DashboardWrapper";
import PageLayout from "~/components/common/page-layout/PageLayout";
import { usePageTitle } from "~/hooks";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await requireAuthCookie(request)
}

export default function PatientDashboard() {
  usePageTitle("Patient Dashboard - MedTok");

  return (
    <PageLayout title="Health Portal" subtitle="Manage your health records and connect with your care team">
      <DashboardWrapper
        title="Welcome to Your Health Portal"
        subtitle="Manage your health records, find healthcare providers, and stay connected with your care team."
        maxItemsInRow={3}
      >
        {patientCards.map((cardConfig, index) => (
          <DashboardCard
            key={`${cardConfig.title}-${index}`}
            {...configToCardProps(cardConfig)}
          />
        ))}
      </DashboardWrapper>
    </PageLayout >
  );
}