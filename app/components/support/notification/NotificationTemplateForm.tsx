import axios from "axios";
import { useEffect, useState } from "react";
import type {
    NotificationTemplate,
    NotificationType,
    Variables
} from "~/api/notification";
import { NOTIFICATION_TYPE, notificationApi } from "~/api/notification";
import Button from "~/components/common/Button";
import { Input } from "~/components/common/Input";
import { Select } from "~/components/common/Select";
import { TextArea } from "~/components/common/TextArea";
import { useToast } from "~/hooks/useToast";

interface NotificationTemplateFormData {
    name: string;
    type: NotificationType;
    subject: string;
    content_template: string;
    variables: Variables | null;
    is_active: boolean;
}

interface NotificationTemplateFormProps {
    templateId?: string; // For editing existing template
    onTemplateCreated?: (template: NotificationTemplate) => void;
    onTemplateUpdated?: (template: NotificationTemplate) => void;
    onCancel?: () => void;
}

export default function NotificationTemplateForm({
    templateId,
    onTemplateCreated,
    onTemplateUpdated,
    onCancel,
}: NotificationTemplateFormProps) {
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<NotificationTemplateFormData>({
        name: "",
        type: "system",
        subject: "",
        content_template: "",
        variables: null,
        is_active: true,
    });

    // Prepare options for notification type select
    const typeOptions = Object.entries(NOTIFICATION_TYPE).map(([key, value]) => ({
        value: value,
        label: key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')
    }));

    // Load existing template data when editing
    useEffect(() => {
        const fetchTemplateData = async () => {
            if (!templateId) return;

            setIsLoading(true);
            try {
                const template = await notificationApi.getTemplate(templateId);

                setFormData({
                    name: template.name,
                    type: template.type,
                    subject: template.subject,
                    content_template: template.content_template,
                    variables: template.variables,
                    is_active: template.is_active,
                });
            } catch (error) {
                console.error("Failed to fetch template data:", error);
                toast.error("Failed to load template data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        if (templateId) {
            fetchTemplateData();
        }
        // We intentionally do not include toast in the dependency array to avoid unnecessary re-renders
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [templateId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Basic form validation
        if (!formData.name.trim()) {
            toast.error("Template name is required.");
            setIsSubmitting(false);
            return;
        }

        if (!formData.subject.trim()) {
            toast.error("Subject is required.");
            setIsSubmitting(false);
            return;
        }

        if (!formData.content_template.trim()) {
            toast.error("Content template is required.");
            setIsSubmitting(false);
            return;
        }

        try {
            // Parse variables JSON if provided
            let parsedVariables: Variables | null = null;
            if (formData.variables && typeof formData.variables === 'string') {
                const trimmedVariables = (formData.variables as string).trim();
                if (trimmedVariables) {
                    try {
                        parsedVariables = JSON.parse(trimmedVariables);
                    } catch (parseError) {
                        console.error("JSON parse error:", parseError);
                        toast.error("Invalid JSON format in variables field.");
                        setIsSubmitting(false);
                        return;
                    }
                }
            } else if (formData.variables && typeof formData.variables === 'object') {
                parsedVariables = formData.variables;
            }

            if (templateId) {
                // Update existing template
                const updateData = {
                    name: formData.name,
                    type: formData.type,
                    subject: formData.subject,
                    content_template: formData.content_template,
                    variables: parsedVariables,
                    is_active: formData.is_active,
                };

                const updatedTemplate = await notificationApi.updateTemplate(templateId, updateData);
                onTemplateUpdated?.(updatedTemplate);
                toast.success("Template updated successfully!");
            } else {
                // Create new template
                const createData = {
                    name: formData.name,
                    type: formData.type,
                    subject: formData.subject,
                    content_template: formData.content_template,
                    variables: parsedVariables,
                    is_active: formData.is_active,
                };

                const newTemplate = await notificationApi.createTemplate(createData);
                onTemplateCreated?.(newTemplate);
                toast.success("Template created successfully!");

                // Reset form for new creation
                setFormData({
                    name: "",
                    type: "system",
                    subject: "",
                    content_template: "",
                    variables: null,
                    is_active: true,
                });
            }
        } catch (error) {
            console.error("Failed to save template:", error);
            let errorMessage = `Failed to ${templateId ? 'update' : 'create'} template. Please try again.`;
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleVariablesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        // Store as string for editing, will be parsed on submit
        setFormData(prev => ({ ...prev, variables: value as unknown as Variables }));
    };

    if (isLoading) {
        return (
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="flex justify-center items-center h-64">
                        <span className="loading loading-spinner loading-lg"></span>
                        <span className="ml-4">Loading template data...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">
                    {templateId ? "Edit Template" : "Create New Template"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Template Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter template name"
                                required
                            />

                            <Select
                                label="Notification Type"
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                options={typeOptions}
                                required
                            />
                        </div>

                        <Input
                            label="Subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            placeholder="Enter notification subject"
                            required
                        />
                    </div>

                    {/* Template Content */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Template Content</h3>

                        <TextArea
                            label="Content Template"
                            name="content_template"
                            value={formData.content_template}
                            onChange={handleInputChange}
                            placeholder="Enter template content with variables like {{variable_name}}"
                            rows={6}
                            required
                        />

                        <div className="text-sm opacity-60">
                            <p><strong>Tip:</strong> Use variables in your template like <code>{'{{patient_name}}'}</code> or <code>{'{{medication_name}}'}</code></p>
                            <p>Common variables: patient_name, practitioner_name, medication_name, appointment_date, etc.</p>
                        </div>
                    </div>

                    {/* Variables Configuration */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Variables Configuration (Optional)</h3>

                        <TextArea
                            label="Variables JSON"
                            name="variables"
                            value={typeof formData.variables === 'string'
                                ? formData.variables
                                : formData.variables
                                    ? JSON.stringify(formData.variables, null, 2)
                                    : ''
                            }
                            onChange={handleVariablesChange}
                            placeholder='{"variable_name": "default_value", "another_variable": "another_default"}'
                            rows={4}
                        />

                        <div className="text-sm opacity-60">
                            <p><strong>Format:</strong> Valid JSON object with variable names and their default values</p>
                            <p><strong>Example:</strong> <code>{`{"patient_name": "Patient", "medication_name": "Medication"}`}</code></p>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Status</h3>
                        <div className="form-control">
                            <label className="label cursor-pointer justify-start">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleInputChange}
                                    className="checkbox checkbox-primary mr-3"
                                />
                                <span className="label-text font-medium">Template is active</span>
                            </label>
                            <div className="text-sm opacity-60 ml-6">
                                Only active templates can be used for sending notifications
                            </div>
                        </div>
                    </div>

                    <div className="card-actions justify-end space-x-2">
                        {onCancel && (
                            <Button
                                type="button"
                                onClick={onCancel}
                                buttonType="neutral"
                            >
                                Cancel
                            </Button>
                        )}
                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? (templateId ? 'Updating...' : 'Creating...')
                                : (templateId ? 'Update Template' : 'Create Template')
                            }
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
