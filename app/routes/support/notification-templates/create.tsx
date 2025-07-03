import type { LoaderFunction } from "react-router";
import { useNavigate } from "react-router";
import type { NotificationTemplate } from "~/api/notification";
import { requireAuthCookie } from "~/auth";
import SupportPageLayout from "~/components/common/page-layout/PageLayout";
import { NotificationTemplateForm } from "~/components/support/notification";
import { usePageTitle } from "~/hooks";

export const loader: LoaderFunction = async ({ request }) => {
    const user = await requireAuthCookie(request);
    return user;
};

export default function CreateNotificationTemplate() {
    usePageTitle("Create Notification Template - Support - MedTok");
    const navigate = useNavigate();

    const handleTemplateCreated = (template: NotificationTemplate) => {
        console.log('Template created:', template);
        // Navigate back to templates list
        navigate('/support/notification-templates');
    };

    const handleCancel = () => {
        navigate('/support/notification-templates');
    };

    return (
        <SupportPageLayout title="Create Notification Template">
            <div className="space-y-6">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold opacity-90">Create Notification Template</h1>
                        <p className="mt-2 text-sm opacity-50">
                            Create a new notification template for the system
                        </p>
                    </div>
                </div>

                <NotificationTemplateForm
                    onTemplateCreated={handleTemplateCreated}
                    onCancel={handleCancel}
                />
            </div>
        </SupportPageLayout>
    );
}
