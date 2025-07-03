import { useEffect, useState } from "react";
import type { LoaderFunction } from "react-router";
import { useNavigate, useParams } from "react-router";
import type { NotificationTemplate } from "~/api/notification";
import { notificationApi } from "~/api/notification";
import { requireAuthCookie } from "~/auth";
import SupportPageLayout from "~/components/common/page-layout/PageLayout";
import { ErrorState } from "~/components/patient";
import { NotificationTemplateForm } from "~/components/support/notification";
import { usePageTitle } from "~/hooks";

export const loader: LoaderFunction = async ({ request }) => {
    const user = await requireAuthCookie(request);
    return user;
};

export default function EditNotificationTemplatePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    usePageTitle("Edit Notification Template - Support - MedTok");

    const [template, setTemplate] = useState<NotificationTemplate | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load template on component mount
    useEffect(() => {
        if (id) {
            loadTemplate(id);
        } else {
            setError('Invalid template ID');
            setLoading(false);
        }
    }, [id]);

    const loadTemplate = async (templateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await notificationApi.getTemplate(templateId);
            setTemplate(response);
        } catch (err) {
            console.error('Failed to load notification template:', err);
            setError('Failed to load notification template. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleTemplateUpdated = (updatedTemplate: NotificationTemplate) => {
        console.log('Template updated:', updatedTemplate);
        // Navigate back to the templates list after successful update
        navigate('/support/notification-templates', { replace: true });
    };

    const handleCancel = () => {
        navigate('/support/notification-templates');
    };

    if (loading) {
        return (
            <SupportPageLayout
                title="Edit Notification Template"
                subtitle="Update notification template details">
                <div className="max-w-2xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
                        <div className="space-y-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-12 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </SupportPageLayout>
        );
    }

    if (error || !template) {
        return (
            <SupportPageLayout
                title="Edit Notification Template"
                subtitle="Update notification template details">
                <div className="max-w-2xl mx-auto">
                    <ErrorState
                        error={error || 'Template not found'}
                        onRetry={() => id && loadTemplate(id)}
                    />
                </div>
            </SupportPageLayout>
        );
    }

    return (
        <SupportPageLayout
            title="Edit Notification Template"
            subtitle="Update notification template details">
            <div className="max-w-2xl mx-auto">
                <NotificationTemplateForm
                    templateId={id}
                    onTemplateUpdated={handleTemplateUpdated}
                    onCancel={handleCancel}
                />
            </div>
        </SupportPageLayout>
    );
}
