import { LoaderFunctionArgs, useLoaderData, useNavigate } from "react-router";
import { FamilyHealthCondition } from "~/api/patient";
import { requireAuthCookie } from "~/auth";
import { Button } from "~/components/common";
import PageLayout from "~/components/common/page-layout/PageLayout";
import { FamilyHealthConditionList } from "~/components/patient";
import { usePageTitle } from "~/hooks";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const user = await requireAuthCookie(request);
    return { user };
}

export default function PatientFamilyHealthConditions() {
    usePageTitle("Family Health History - MedTok");
    const navigate = useNavigate();
    const { user } = useLoaderData<{ user: { sub: string } }>();

    const handleViewAllConditions = () => {
        // TODO: Navigate to full family health conditions page or open modal
        console.log('View all family health conditions clicked');
    };

    const handleConditionClick = (condition: FamilyHealthCondition) => {
        // TODO: Open family health condition details modal or navigate to detail page
        console.log('Family health condition clicked:', condition);
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
            title="Family Health History"
            subtitle="View your family's health conditions and genetic predispositions"
            headerActions={headerActions}
        >

            <FamilyHealthConditionList
                patientId={user.sub}
                showHeader={true}
                title="Family Health Conditions"
                maxItems={20}
                showDetails={true}
                onViewAll={handleViewAllConditions}
                onFamilyHealthConditionClick={handleConditionClick}
                className="bg-base-100 rounded-lg shadow p-6"
            />

            {/* Example of compact view for dashboard usage */}
            <div className="mt-8">
                <h3 className="text-lg font-medium text-base-content mb-4">
                    Immediate Family Summary
                </h3>
                <FamilyHealthConditionList
                    patientId={user.sub}
                    showHeader={false}
                    maxItems={5}
                    showDetails={false}
                    onFamilyHealthConditionClick={handleConditionClick}
                    className="bg-base-100 rounded-lg shadow p-4"
                />
            </div>
        </PageLayout >
    );
}
