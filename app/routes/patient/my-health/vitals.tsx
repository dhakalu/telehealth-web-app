import { LoaderFunctionArgs, useLoaderData, useNavigate } from "react-router";
import { Vital } from "~/api/patient";
import { requireAuthCookie } from "~/auth";
import { Button } from "~/components/common";
import PageLayout from "~/components/common/page-layout/PageLayout";
import { VitalList } from "~/components/patient";
import { usePageTitle } from "~/hooks";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const user = await requireAuthCookie(request);
    return { user };
}

export default function PatientVitals() {
    usePageTitle("My Vitals - MedTok");
    const navigate = useNavigate();
    const { user } = useLoaderData<{ user: { sub: string } }>();

    const handleViewAllVitals = () => {
        // TODO: Navigate to full vitals page or open modal
        console.log('View all vitals clicked');
    };

    const handleVitalClick = (vital: Vital) => {
        // TODO: Open vital details modal or navigate to detail page
        console.log('Vital clicked:', vital);
    };

    const headerActions = (
        <Button
            onClick={() => navigate('/patient/my-health')}
            buttonType="neutral"
        >
            <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to My Health
        </Button>
    );

    return (
        <PageLayout
            title="My Vital Signs"
            subtitle="View and track your vital signs and health measurements"
            headerActions={headerActions}
        >

            <VitalList
                patientId={user.sub}
                showHeader={true}
                title="Recent Vital Signs"
                maxItems={20}
                showDetails={true}
                onViewAll={handleViewAllVitals}
                onVitalClick={handleVitalClick}
                className="bg-base-100 rounded-lg shadow p-6"
            />

            {/* Example of compact view for dashboard usage */}
            <div className="mt-8">
                <h3 className="text-lg font-medium text-base-content mb-4">
                    Latest Measurements Summary
                </h3>
                <VitalList
                    patientId={user.sub}
                    showHeader={false}
                    maxItems={4}
                    showDetails={false}
                    onVitalClick={handleVitalClick}
                    className="bg-base-100 rounded-lg shadow p-4"
                />
            </div>
        </PageLayout >
    );
}
