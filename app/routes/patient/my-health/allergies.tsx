import { LoaderFunctionArgs, useLoaderData, useNavigate } from "react-router";
import { Allergy } from "~/api/patient";
import { requireAuthCookie } from "~/auth";
import { Button } from "~/components/common";
import PageLayout from "~/components/common/page-layout/PageLayout";
import { AllergyList } from "~/components/patient";
import { usePageTitle } from "~/hooks";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const user = await requireAuthCookie(request);
    return { user };
}

export default function PatientAllergies() {
    usePageTitle("My Allergies - MedTok");
    const navigate = useNavigate();
    const { user } = useLoaderData<{ user: { sub: string } }>();

    const handleViewAllAllergies = () => {
        // TODO: Navigate to full allergies page or open modal
        console.log('View all allergies clicked');
    };

    const handleAllergyClick = (allergy: Allergy) => {
        // TODO: Open allergy details modal or navigate to detail page
        console.log('Allergy clicked:', allergy);
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
            title="My Allergies"
            subtitle="View and manage your allergy information and reactions"
            headerActions={headerActions}
        >

            <AllergyList
                patientId={user.sub}
                showHeader={true}
                title="Known Allergies"
                maxItems={20}
                showDetails={true}
                onViewAll={handleViewAllAllergies}
                onAllergyClick={handleAllergyClick}
                className="bg-base-100 rounded-lg shadow p-6"
            />

            {/* Example of compact view for dashboard usage */}
            <div className="mt-8">
                <h3 className="text-lg font-medium text-base-content mb-4">
                    Critical Allergies Summary
                </h3>
                <AllergyList
                    patientId={user.sub}
                    showHeader={false}
                    maxItems={3}
                    showDetails={false}
                    onAllergyClick={handleAllergyClick}
                    className="bg-base-100 rounded-lg shadow p-4"
                />
            </div>
        </PageLayout >
    );
}
