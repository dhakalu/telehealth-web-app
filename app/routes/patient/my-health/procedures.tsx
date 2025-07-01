import { LoaderFunctionArgs, useLoaderData, useNavigate } from "react-router";
import { Procedure } from "~/api/patient";
import { requireAuthCookie } from "~/auth";
import { Button } from "~/components/common";
import PageLayout from "~/components/common/page-layout/PageLayout";
import { ProcedureList } from "~/components/patient";
import { usePageTitle } from "~/hooks";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const user = await requireAuthCookie(request);
    return { user };
}

export default function PatientProcedures() {
    usePageTitle("My Procedures - MedTok");
    const navigate = useNavigate();
    const { user } = useLoaderData<{ user: { sub: string } }>();

    const handleViewAllProcedures = () => {
        // TODO: Navigate to full procedures page or open modal
        console.log('View all procedures clicked');
    };

    const handleProcedureClick = (procedure: Procedure) => {
        // TODO: Open procedure details modal or navigate to detail page
        console.log('Procedure clicked:', procedure);
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
            title="My Procedures"
            subtitle="View and manage your medical procedures and treatment history"
            headerActions={headerActions}
        >

            <ProcedureList
                patientId={user.sub}
                showHeader={true}
                title="Medical Procedures"
                maxItems={20}
                showDetails={true}
                onViewAll={handleViewAllProcedures}
                onProcedureClick={handleProcedureClick}
                className="bg-base-100 rounded-lg shadow p-6"
            />

            {/* Example of compact view for dashboard usage */}
            <div className="mt-8">
                <h3 className="text-lg font-medium text-base-content mb-4">
                    Recent Procedure Summary
                </h3>
                <ProcedureList
                    patientId={user.sub}
                    showHeader={false}
                    maxItems={3}
                    showDetails={false}
                    onProcedureClick={handleProcedureClick}
                    className="bg-base-100 rounded-lg shadow p-4"
                />
            </div>
        </PageLayout >
    );
}
