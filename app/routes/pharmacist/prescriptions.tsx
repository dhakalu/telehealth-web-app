import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { API_BASE_URL } from "~/api";
import { pharmacistApi } from "~/api/pharmacist";
import { requireAuthCookie } from "~/auth";
import ErrorPage from "~/components/common/ErrorPage";
import { PharmacyPrescriptions } from "~/components/prescription";

export const loader = async ({ request }: LoaderFunctionArgs) => {

    const user = await requireAuthCookie(request);

    try {
        // const pharmacist = await pharmacistApi.getPharmacistById(user.sub);
        const organizations = await pharmacistApi.getPharmacistOrganizations(user.sub);
        return { organizations, baseUrl: API_BASE_URL };
    } catch (error) {
        console.error("Error loading pharmacy prescriptions:", error);
        return {
            error: "Failed to load pharmacy prescriptions. Please try again later."
        }

    }
}


export default function PharmacyPrescriptionsPage() {
    const { organizations, error, baseUrl } = useLoaderData();

    if (error) {
        return <ErrorPage error={error} />;
    }

    return (
        <PharmacyPrescriptions
            baseUrl={baseUrl}
            pharmacyId={organizations[0]?.id}
            className="max-w-7xl mx-auto"
        />
    );
}

/**
 * Usage Examples:
 * 
 * 1. Basic usage:
 * <PharmacyPrescriptions pharmacyId="your-pharmacy-id" />
 * 
 * 2. With custom styling:
 * <PharmacyPrescriptions 
 *   pharmacyId="your-pharmacy-id" 
 *   className="custom-container-class"
 * />
 * 
 * 3. In a route with params:
 * export default function PharmacyRoute() {
 *   const { pharmacyId } = useParams();
 *   return <PharmacyPrescriptions pharmacyId={pharmacyId} />;
 * }
 * 
 * 4. With user context:
 * export default function MyPharmacyPrescriptions() {
 *   const { user } = useAuth();
 *   return <PharmacyPrescriptions pharmacyId={user.organizationId} />;
 * }
 */
