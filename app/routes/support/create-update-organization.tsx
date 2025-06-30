import { LoaderFunction, useLoaderData, useParams } from "react-router";
import { API_BASE_URL } from "~/api";
import { requireAuthCookie } from "~/auth";
import OrganizationManagement from "~/components/organization/OrganizationManagement";
import SupportPageLayout from "~/components/support/SupportPageLayout";
import { usePageTitle } from "~/hooks";

export const loader: LoaderFunction = async ({ request }) => {
    const user = await requireAuthCookie(request);
    return { user, baseUrl: API_BASE_URL };
}

export default function ManageOrganizations() {
    usePageTitle("Manage Organizations - MedTok Support");
    const { baseUrl } = useLoaderData<{ baseUrl: string }>();

    const { organizationId } = useParams<{ organizationId: string }>();

    const breadcrumbs = [
        { label: "Support Dashboard", href: "/support" },
        { label: "Support", href: "/support" },
        { label: "Organizations", href: "/support/manage-organizations" },
        { label: organizationId === "create" ? "Create Organization" : "Edit Organization" }
    ];

    return (
        <SupportPageLayout
            title="Manage Organizations"
            subtitle="Create, view, and manage healthcare organizations in the system"
            breadcrumbs={breadcrumbs}
        >
            <div className="overflow-hidden shadow rounded-lg">
                <OrganizationManagement
                    organizationId={organizationId === "create" ? undefined : organizationId}
                    baseUrl={baseUrl}
                    onOrganizationCreated={(org) => {
                        console.log("Organization created:", org);
                    }}
                />
            </div>
        </SupportPageLayout>
    );
}
