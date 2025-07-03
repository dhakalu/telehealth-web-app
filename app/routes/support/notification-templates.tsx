import { useEffect, useState } from "react";
import type { LoaderFunction } from "react-router";
import { useNavigate } from "react-router";
import type { NotificationTemplate } from "~/api/notification";
import { notificationApi } from "~/api/notification";
import { requireAuthCookie } from "~/auth";
import Button from "~/components/common/Button";
import SupportPageLayout from "~/components/common/page-layout/PageLayout";
import { ErrorState } from "~/components/patient";
import { NotificationTemplateTable } from "~/components/support/notification";
import { usePageTitle } from "~/hooks";
import { useToast } from "~/hooks/useToast";

export const loader: LoaderFunction = async ({ request }) => {
    const user = await requireAuthCookie(request);
    return user;
};

export default function NotificationTemplatesPage() {
    usePageTitle("Notification Templates - Support - MedTok");
    const navigate = useNavigate();
    const toast = useToast();

    const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load templates on component mount
    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await notificationApi.getTemplates();
            setTemplates(response.templates);
        } catch (err) {
            console.error('Failed to load notification templates:', err);
            setError('Failed to load notification templates. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (template: NotificationTemplate) => {
        navigate(`/support/notification-templates/edit/${template.id}`);
    };

    const handleDelete = async (template: NotificationTemplate) => {
        // Show confirmation dialog
        const confirmed = window.confirm(
            `Are you sure you want to delete the template "${template.name}"?\n\nThis action cannot be undone.`
        );

        if (confirmed) {
            try {
                await notificationApi.deleteTemplate(template.id);
                toast.success(`Template "${template.name}" deleted successfully.`);
                // Reload the templates list
                loadTemplates();
            } catch (error) {
                console.error('Failed to delete template:', error);
                toast.error(`Failed to delete template "${template.name}". Please try again.`);
            }
        }
    };

    const handleCreateTemplate = () => {
        navigate('/support/notification-templates/create');
    };

    const actionButtons = (
        <Button
            type="button"
            onClick={handleCreateTemplate}
        >
            Create Template
        </Button>
    );

    return (
        <SupportPageLayout
            title="Notification Templates"
            subtitle="Manage notification templates for the MedTok platform"
            headerActions={actionButtons}>
            <div className="space-y-6">


                {/* Error State */}
                {error && (
                    <ErrorState error={error} onRetry={loadTemplates} />
                )}

                {!error && !loading && (
                    <NotificationTemplateTable
                        templates={templates}
                        loading={loading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </div>
        </SupportPageLayout>
    );
}