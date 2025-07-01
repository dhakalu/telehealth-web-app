import { LoaderFunctionArgs, useLoaderData, useNavigate } from "react-router";
import { Result } from "~/api/patient";
import { requireAuthCookie } from "~/auth";
import { Button } from "~/components/common";
import PageLayout from "~/components/common/page-layout/PageLayout";
import { ResultList } from "~/components/patient";
import { usePageTitle } from "~/hooks";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const user = await requireAuthCookie(request);
    return { user };
}

export default function PatientResults() {
    usePageTitle("My Test Results - MedTok");
    const navigate = useNavigate();
    const { user } = useLoaderData<{ user: { sub: string } }>();

    const handleViewAllResults = () => {
        // TODO: Navigate to full results page or open modal
        console.log('View all results clicked');
    };

    const handleResultClick = (result: Result) => {
        // TODO: Open result details modal or navigate to detail page
        console.log('Result clicked:', result);
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
            title="My Test Results"
            subtitle="View and track your laboratory and diagnostic test results"
            headerActions={headerActions}
        >

            <ResultList
                patientId={user.sub}
                showHeader={true}
                title="Recent Test Results"
                maxItems={20}
                showDetails={true}
                onViewAll={handleViewAllResults}
                onResultClick={handleResultClick}
                className="bg-base-100 rounded-lg shadow p-6"
            />

            {/* Example of compact view for dashboard usage */}
            <div className="mt-8">
                <h3 className="text-lg font-medium text-base-content mb-4">
                    Latest Test Results Summary
                </h3>
                <ResultList
                    patientId={user.sub}
                    showHeader={false}
                    maxItems={3}
                    showDetails={false}
                    onResultClick={handleResultClick}
                    className="bg-base-100 rounded-lg shadow p-4"
                />
            </div>
        </PageLayout >
    );
}
