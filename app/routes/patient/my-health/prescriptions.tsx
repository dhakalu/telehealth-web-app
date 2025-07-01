import { LoaderFunctionArgs, useLoaderData, useNavigate } from "react-router";
import { Medication } from "~/api/patient";
import { requireAuthCookie } from "~/auth";
import { Button } from "~/components/common";
import PageLayout from "~/components/common/page-layout/PageLayout";
import { PrescriptionList } from "~/components/patient";
import { usePageTitle } from "~/hooks";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const user = await requireAuthCookie(request);
    return { user };
}

export default function PatientPrescriptions() {
    usePageTitle("My Prescriptions - MedTok");
    const navigate = useNavigate();
    const { user } = useLoaderData<{ user: { sub: string } }>();

    const handleViewAllPrescriptions = () => {
        // TODO: Navigate to full prescriptions page or open modal
        console.log('View all prescriptions clicked');
    };

    const handlePrescriptionClick = (prescription: Medication) => {
        // TODO: Open prescription details modal or navigate to detail page
        console.log('Prescription clicked:', prescription);
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
            title="My Prescriptions"
            subtitle="View and manage your current and past prescriptions"
            headerActions={headerActions}
        >

            <PrescriptionList
                patientId={user.sub}
                showHeader={true}
                title="Current Prescriptions"
                maxItems={20}
                showDetails={true}
                onViewAll={handleViewAllPrescriptions}
                onPrescriptionClick={handlePrescriptionClick}
                className="bg-base-100 rounded-lg shadow p-6"
            />

            {/* Example of compact view for dashboard usage */}
            <div className="mt-8">
                <h3 className="text-lg font-medium text-base-content mb-4">
                    Recent Activity Summary
                </h3>
                <PrescriptionList
                    patientId={user.sub}
                    showHeader={false}
                    maxItems={3}
                    showDetails={false}
                    onPrescriptionClick={handlePrescriptionClick}
                    className="bg-base-100 rounded-lg shadow p-4"
                />
            </div>
        </PageLayout >
    );
}