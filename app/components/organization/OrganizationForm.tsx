import axios from "axios";
import { useEffect, useState } from "react";
import { Input } from "~/components/common/Input";
import { useToast } from "~/hooks/useToast";
import {
    CreateOrganizationRequest,
    Organization,
    ORGANIZATION_STATUSES,
    ORGANIZATION_TYPES,
    UpdateOrganizationRequest
} from "./types";

interface OrganizationFormProps {
    baseUrl: string;
    organizationId?: string; // Optional, if editing an existing organization
    onOrganizationCreated?: (organization: Organization) => void;
    onOrganizationUpdated?: (organization: Organization) => void;
}

export default function OrganizationForm({
    baseUrl,
    organizationId,
    onOrganizationCreated,
    onOrganizationUpdated,
}: OrganizationFormProps) {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(!!organizationId);

    const [organization, setOrganization] = useState<Partial<Organization>>({
        name: "",
        organization_type: "clinic",
        status: "pending",
        description: "",
        tax_id: "",
        founded_date: undefined,
        website: "",
    });

    // Fetch organization details when organizationId is provided
    useEffect(() => {
        if (organizationId) {
            fetchOrganizationDetails();
        }
    }, [organizationId]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchOrganizationDetails = async () => {
        if (!organizationId) return;

        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/organizations/${organizationId}`);
            const orgData = response.data;

            // Format dates for datetime-local input
            if (orgData.founded_date) {
                orgData.founded_date = new Date(orgData.founded_date).toISOString().slice(0, 16);
            }

            setOrganization(orgData);
            setIsEditing(true);
        } catch (error) {
            console.error("Failed to fetch organization details:", error);
            toast.error("Failed to load organization details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setOrganization(prev => ({
            ...prev,
            [name]: value === "" ? undefined : value
        }));
    };

    const saveOrganization = async () => {
        try {
            setLoading(true);

            // Prepare request data
            const requestData = { ...organization };

            // Convert date to ISO string if provided
            if (requestData.founded_date) {
                requestData.founded_date = new Date(requestData.founded_date).toISOString();
            }

            let response;
            if (isEditing && organizationId) {
                // Update existing organization
                const updateData: UpdateOrganizationRequest = {
                    name: requestData.name,
                    organization_type: requestData.organization_type,
                    status: requestData.status,
                    description: requestData.description,
                    tax_id: requestData.tax_id,
                    founded_date: requestData.founded_date,
                    website: requestData.website,
                };
                response = await axios.put(`${baseUrl}/organizations/${organizationId}`, updateData);
                toast.success("Organization updated successfully!");
                if (onOrganizationUpdated) {
                    onOrganizationUpdated(response.data);
                }
            } else {
                // Create new organization
                const createData: CreateOrganizationRequest = {
                    name: requestData.name!,
                    organization_type: requestData.organization_type!,
                    description: requestData.description,
                    tax_id: requestData.tax_id,
                    founded_date: requestData.founded_date,
                    website: requestData.website,
                };
                response = await axios.post(`${baseUrl}/organizations`, createData);
                toast.success("Organization created successfully!");

                // Update local state with the created organization
                setOrganization(response.data);
                setIsEditing(true);

                if (onOrganizationCreated) {
                    onOrganizationCreated(response.data);
                }
            }

        } catch (error) {
            console.error("Failed to save organization:", error);
            toast.error("Failed to save organization. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="max-w-2xl">
                <h3 className="font-bold text-lg mb-4">
                    {isEditing ? "Update Organization" : "Create Organization"}
                </h3>

                <form onSubmit={(e) => { e.preventDefault(); saveOrganization(); }} className="space-y-4">
                    <Input
                        label="Organization Name"
                        type="text"
                        name="name"
                        value={organization.name || ""}
                        onChange={handleInputChange}
                        placeholder="Enter organization name"
                        wrapperClass="mb-4"
                        required
                    />

                    <div className="mb-4">
                        <label htmlFor="organization_type" className="block mb-1 font-medium">
                            Organization Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="organization_type"
                            name="organization_type"
                            value={organization.organization_type || "clinic"}
                            onChange={handleInputChange}
                            className="select w-full border px-4 py-2 rounded"
                            required
                        >
                            {ORGANIZATION_TYPES.map(type => (
                                <option key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                    </div>

                    {isEditing && (
                        <div className="mb-4">
                            <label htmlFor="status" className="block mb-1 font-medium">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={organization.status || "pending"}
                                onChange={handleInputChange}
                                className="select w-full border px-4 py-2 rounded"
                            >
                                {ORGANIZATION_STATUSES.map(status => (
                                    <option key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="mb-4">
                        <label htmlFor="description" className="block mb-1 font-medium">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={organization.description || ""}
                            onChange={handleInputChange}
                            placeholder="Enter organization description"
                            className="textarea w-full border px-4 py-2 rounded"
                            rows={3}
                        />
                    </div>

                    <Input
                        label="Tax ID"
                        type="text"
                        name="tax_id"
                        value={organization.tax_id || ""}
                        onChange={handleInputChange}
                        placeholder="Enter tax identification number"
                        wrapperClass="mb-4"
                    />

                    <Input
                        label="Founded Date"
                        type="datetime-local"
                        name="founded_date"
                        value={organization.founded_date || ""}
                        onChange={handleInputChange}
                        wrapperClass="mb-4"
                    />

                    <Input
                        label="Website"
                        type="url"
                        name="website"
                        value={organization.website || ""}
                        onChange={handleInputChange}
                        placeholder="https://example.com"
                        wrapperClass="mb-4"
                    />

                    <div className="form-control mt-6">
                        <button
                            type="submit"
                            className={`btn btn-primary ${loading ? "loading" : ""}`}
                            disabled={loading}
                        >
                            {isEditing ? "Update Organization" : "Create Organization"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
