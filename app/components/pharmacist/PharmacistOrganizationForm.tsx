import axios from "axios";
import { useState } from "react";
import { useToast } from "~/hooks/useToast";
import Button from "../common/Button";
import Card from "../common/Card";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { CreateOrganizationPharmacistRequest, EMPLOYMENT_TYPES, OrganizationPharmacist } from "../organization/types";

interface PharmacistOrganizationFormProps {
    baseUrl: string;
    organizationId: string;
    onRelationshipCreated: (relationship: OrganizationPharmacist) => void;
}

export default function PharmacistOrganizationForm({
    baseUrl,
    organizationId,
    onRelationshipCreated,
}: PharmacistOrganizationFormProps) {
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<CreateOrganizationPharmacistRequest>({
        pharmacist_id: "",
        organization_id: organizationId,
        supervisor_id: "",
        role: "",
        employment_type: "full_time",
        start_date: "",
        end_date: "",
        is_primary: false,
    });

    // Prepare employment type options for Select component
    const employmentTypeOptions = EMPLOYMENT_TYPES.map(type => ({
        value: type,
        label: type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')
    }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Clean up the data - remove empty strings for optional fields
            const cleanedData = {
                ...formData,
                supervisor_id: formData.supervisor_id || undefined,
                role: formData.role || undefined,
                start_date: formData.start_date || undefined,
                end_date: formData.end_date || undefined,
            };

            const response = await axios.post(
                `${baseUrl}/organizations/${organizationId}/pharmacists`,
                cleanedData
            );

            onRelationshipCreated(response.data);
            toast.success("Pharmacist relationship created successfully!");

            // Reset form
            setFormData({
                pharmacist_id: "",
                organization_id: organizationId,
                supervisor_id: "",
                role: "",
                employment_type: "full_time",
                start_date: "",
                end_date: "",
                is_primary: false,
            });
        } catch (error) {
            console.error("Failed to create pharmacist relationship:", error);
            let errorMessage = "Failed to create pharmacist relationship. Please try again.";
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    return (
        <Card>
            <h2 className="card-title">Add Pharmacist to Organization</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pharmacist ID */}
                    <Input
                        label="Pharmacist ID"
                        name="pharmacist_id"
                        value={formData.pharmacist_id}
                        onChange={handleInputChange}
                        placeholder="Enter pharmacist ID"
                        required
                    />

                    {/* Supervisor ID */}
                    <Input
                        label="Supervisor ID"
                        name="supervisor_id"
                        value={formData.supervisor_id}
                        onChange={handleInputChange}
                        placeholder="Enter supervisor pharmacist ID (optional)"
                    />

                    {/* Role */}
                    <Input
                        label="Role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        placeholder="e.g., Staff Pharmacist, Pharmacy Manager"
                    />

                    {/* Employment Type */}
                    <Select
                        label="Employment Type"
                        name="employment_type"
                        value={formData.employment_type}
                        onChange={handleInputChange}
                        options={employmentTypeOptions}
                    />

                    {/* Start Date */}
                    <Input
                        label="Start Date"
                        name="start_date"
                        type="date"
                        value={formData.start_date}
                        onChange={handleInputChange}
                    />

                    {/* End Date */}
                    <Input
                        label="End Date"
                        name="end_date"
                        type="date"
                        value={formData.end_date}
                        onChange={handleInputChange}
                    />
                </div>

                {/* Is Primary */}
                <div className="form-control">
                    <label className="label cursor-pointer justify-start">
                        <input
                            type="checkbox"
                            name="is_primary"
                            checked={formData.is_primary}
                            onChange={handleInputChange}
                            className="checkbox checkbox-primary mr-3"
                        />
                        <span className="label-text font-medium">Primary organization for this pharmacist</span>
                    </label>
                </div>

                <div className="card-actions justify-end">
                    <Button
                        type="submit"
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating...' : 'Add Pharmacist'}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
