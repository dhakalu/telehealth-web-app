import axios from "axios";
import { useEffect, useState } from "react";
import { Input } from "~/components/common/Input";
import { useToast } from "~/hooks/useToast";
import {
    CreatePractitionerOrganizationRequest,
    Organization,
    PractitionerOrganization
} from "./types";

interface PractitionerOrganizationFormProps {
    baseUrl: string;
    practitionerId?: string;
    organizationId?: string;
    relationshipId?: string; // Optional, if editing an existing relationship
    onRelationshipCreated?: (relationship: PractitionerOrganization) => void;
    onRelationshipUpdated?: (relationship: PractitionerOrganization) => void;
    onCancel?: () => void;
}

export default function PractitionerOrganizationForm({
    baseUrl,
    practitionerId,
    organizationId,
    relationshipId,
    onRelationshipCreated,
    onRelationshipUpdated,
    onCancel,
}: PractitionerOrganizationFormProps) {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(!!relationshipId);
    const [organizations, setOrganizations] = useState<Organization[]>([]);

    const [relationship, setRelationship] = useState<Partial<PractitionerOrganization>>({
        practitioner_id: practitionerId || "",
        organization_id: organizationId || "",
        role: "",
        start_date: "",
        end_date: "",
        is_primary: false,
    });

    // Fetch organizations for dropdown
    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const response = await axios.get(`${baseUrl}/organizations?limit=100`);
                setOrganizations(response.data || []);
            } catch (error) {
                console.error("Failed to fetch organizations:", error);
                toast.error("Failed to load organizations.");
            }
        };

        fetchOrganizations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseUrl]);

    // Fetch relationship details when relationshipId is provided
    useEffect(() => {
        const fetchRelationshipDetails = async () => {
            if (!relationshipId) return;

            setLoading(true);
            try {
                const response = await axios.get(`${baseUrl}/practitioner-organizations/${relationshipId}`);
                const relationshipData = response.data;

                // Format dates for datetime-local input
                if (relationshipData.start_date) {
                    relationshipData.start_date = new Date(relationshipData.start_date).toISOString().slice(0, 16);
                }
                if (relationshipData.end_date) {
                    relationshipData.end_date = new Date(relationshipData.end_date).toISOString().slice(0, 16);
                }

                setRelationship(relationshipData);
                setIsEditing(true);
            } catch (error) {
                console.error("Failed to fetch relationship details:", error);
                toast.error("Failed to load relationship details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (relationshipId) {
            fetchRelationshipDetails();
        }
    }, [relationshipId, baseUrl, toast]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setRelationship(prev => ({
            ...prev,
            [name]: type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : value === "" ? undefined : value
        }));
    };

    const saveRelationship = async () => {
        try {
            setLoading(true);

            // Prepare request data
            const requestData = { ...relationship };

            // Convert dates to ISO strings if provided
            if (requestData.start_date) {
                requestData.start_date = new Date(requestData.start_date).toISOString();
            }
            if (requestData.end_date) {
                requestData.end_date = new Date(requestData.end_date).toISOString();
            }

            let response;
            if (isEditing && relationshipId) {
                // Update existing relationship
                response = await axios.put(`${baseUrl}/practitioner-organizations/${relationshipId}`, requestData);
                toast.success("Relationship updated successfully!");
                if (onRelationshipUpdated) {
                    onRelationshipUpdated(response.data);
                }
            } else {
                // Create new relationship
                const createData: CreatePractitionerOrganizationRequest = {
                    practitioner_id: relationship.practitioner_id!,
                    organization_id: relationship.organization_id!,
                    role: relationship.role,
                    start_date: requestData.start_date,
                    end_date: requestData.end_date,
                    is_primary: relationship.is_primary!,
                };
                response = await axios.post(`${baseUrl}/practitioner-organizations`, createData);
                toast.success("Relationship created successfully!");

                if (onRelationshipCreated) {
                    onRelationshipCreated(response.data);
                }
            }

            // Reset form if creating new
            if (!isEditing) {
                setRelationship({
                    practitioner_id: practitionerId || "",
                    organization_id: organizationId || "",
                    role: "",
                    start_date: "",
                    end_date: "",
                    is_primary: false,
                });
            }

        } catch (error) {
            console.error("Failed to save relationship:", error);
            toast.error("Failed to save relationship. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border rounded-lg p-4 mb-4 bg-gray-50">
            <h4 className="font-semibold text-md mb-4">
                {isEditing ? "Update Practitioner-Organization Relationship" : "Add New Relationship"}
            </h4>

            <form onSubmit={(e) => { e.preventDefault(); saveRelationship(); }} className="space-y-4">
                <Input
                    label="Practitioner ID"
                    type="text"
                    name="practitioner_id"
                    value={relationship.practitioner_id || ""}
                    onChange={handleInputChange}
                    placeholder="Enter practitioner ID"
                    wrapperClass="mb-4"
                    required
                    disabled={!!practitionerId} // Disable if passed as prop
                />

                <div className="mb-4">
                    <label htmlFor="organization_id" className="block mb-1 font-medium">
                        Organization <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="organization_id"
                        name="organization_id"
                        value={relationship.organization_id || ""}
                        onChange={handleInputChange}
                        className="select w-full border px-4 py-2 rounded"
                        required
                        disabled={!!organizationId} // Disable if passed as prop
                    >
                        <option value="">Select an organization</option>
                        {organizations.map(org => (
                            <option key={org.id} value={org.id}>
                                {org.name} ({org.organization_type})
                            </option>
                        ))}
                    </select>
                </div>

                <Input
                    label="Role"
                    type="text"
                    name="role"
                    value={relationship.role || ""}
                    onChange={handleInputChange}
                    placeholder="e.g., Physician, Consultant, Medical Director"
                    wrapperClass="mb-4"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Start Date"
                        type="datetime-local"
                        name="start_date"
                        value={relationship.start_date || ""}
                        onChange={handleInputChange}
                        wrapperClass="mb-4"
                    />

                    <Input
                        label="End Date"
                        type="datetime-local"
                        name="end_date"
                        value={relationship.end_date || ""}
                        onChange={handleInputChange}
                        wrapperClass="mb-4"
                    />
                </div>

                <div className="mb-4 flex items-center">
                    <label htmlFor="is_primary" className="font-medium flex-grow cursor-pointer">
                        Primary Organization
                    </label>
                    <input
                        id="is_primary"
                        type="checkbox"
                        name="is_primary"
                        checked={relationship.is_primary || false}
                        onChange={handleInputChange}
                        className="checkbox"
                    />
                </div>

                <div className="flex gap-2 pt-4">
                    <button
                        type="submit"
                        className={`btn btn-primary ${loading ? "loading" : ""}`}
                        disabled={loading}
                    >
                        {isEditing ? "Update Relationship" : "Add Relationship"}
                    </button>
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="btn btn-secondary"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
