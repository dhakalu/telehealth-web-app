import { LoaderFunction, useLoaderData, useNavigate, useParams } from "react-router";
import { API_BASE_URL } from "~/api";
import { requireAuthCookie } from "~/auth";
import Button from "~/components/common/Button";
import OrganizationManagement from "~/components/organization/OrganizationManagement";
import SupportPageLayout from "~/components/support/SupportPageLayout";
import { usePageTitle } from "~/hooks";

export const loader: LoaderFunction = async ({ request }) => {
    const user = await requireAuthCookie(request);
    return { user, baseUrl: API_BASE_URL };
}

export default function EditOrganization() {
    usePageTitle("Edit Organization - MedTok Support");
    const { baseUrl } = useLoaderData<{ baseUrl: string }>();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const breadcrumbs = [
        { label: "Support Dashboard", href: "/support" },
        { label: "Organizations", href: "/support/manage-organizations" },
        { label: "Edit Organization" }
    ];

    const headerActions = (
        <Button
            onClick={() => navigate('/support/manage-organizations')}
            buttonType="neutral"
        >
            <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Organizations
        </Button>
    );

    const handleOrganizationSaved = () => {
        navigate('/support/manage-organizations');
    };

    return (
        <SupportPageLayout
            title="Edit Organization"
            subtitle="Update organization details and manage related information"
            breadcrumbs={breadcrumbs}
            headerActions={headerActions}
        >
            <div className="bg-white overflow-hidden shadow rounded-lg">
                <OrganizationManagement
                    baseUrl={baseUrl}
                    organizationId={id}
                    onOrganizationCreated={handleOrganizationSaved}
                />
            </div>
        </SupportPageLayout>
    );
}
