
import { LoaderFunctionArgs } from "react-router";
import { requireAuthCookie } from "~/auth";
import PageLayout from "~/components/common/page-layout/PageLayout";
import { MyHealth } from "~/components/patient";
import { usePageTitle } from "~/hooks";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    return await requireAuthCookie(request);
}

export default function MyHealthPage() {
    usePageTitle("My Health - MedTok");

    return <PageLayout title="My Health" subtitle="View and manage your health records">
        <MyHealth />
    </PageLayout>;
}