import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "~/hooks/useToast";
import Card from "../common/Card";
import {
    CreateOrganizationRelationshipRequest,
    Organization,
    OrganizationRelationship,
    RELATIONSHIP_TYPES
} from "./types";

interface OrganizationRelationshipFormProps {
    baseUrl: string;
    parentOrganizationId?: string;
    childOrganizationId?: string;
    relationshipId?: string; // Optional, if editing an existing relationship
    onRelationshipCreated?: (relationship: OrganizationRelationship) => void;
    onRelationshipUpdated?: (relationship: OrganizationRelationship) => void;
    onCancel?: () => void;
}

export default function OrganizationRelationshipForm({
    baseUrl,
    parentOrganizationId,
    childOrganizationId,
    relationshipId,
    onRelationshipCreated,
    onRelationshipUpdated,
    onCancel,
}: OrganizationRelationshipFormProps) {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(!!relationshipId);
    const [organizations, setOrganizations] = useState<Organization[]>([]);

    const [relationship, setRelationship] = useState<Partial<OrganizationRelationship>>({
        parent_organization_id: parentOrganizationId || "",
        child_organization_id: childOrganizationId || "",
        relationship_type: "subsidiary",
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
                const response = await axios.get(`${baseUrl}/organization-relationships/${relationshipId}`);
                setRelationship(response.data);
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
        const { name, value } = e.target;
        setRelationship(prev => ({
            ...prev,
            [name]: value === "" ? undefined : value
        }));
    };

    const saveRelationship = async () => {
        try {
            setLoading(true);

            // Validate that parent and child are different
            if (relationship.parent_organization_id === relationship.child_organization_id) {
                toast.error("Parent and child organizations must be different.");
                return;
            }

            let response;
            if (isEditing && relationshipId) {
                // Update existing relationship
                response = await axios.put(`${baseUrl}/organization-relationships/${relationshipId}`, relationship);
                toast.success("Relationship updated successfully!");
                if (onRelationshipUpdated) {
                    onRelationshipUpdated(response.data);
                }
            } else {
                // Create new relationship
                const createData: CreateOrganizationRelationshipRequest = {
                    parent_organization_id: relationship.parent_organization_id!,
                    child_organization_id: relationship.child_organization_id!,
                    relationship_type: relationship.relationship_type!,
                };
                response = await axios.post(`${baseUrl}/organization-relationships`, createData);
                toast.success("Relationship created successfully!");

                if (onRelationshipCreated) {
                    onRelationshipCreated(response.data);
                }
            }

            // Reset form if creating new
            if (!isEditing) {
                setRelationship({
                    parent_organization_id: parentOrganizationId || "",
                    child_organization_id: childOrganizationId || "",
                    relationship_type: "subsidiary",
                });
            }

        } catch (error) {
            console.error("Failed to save relationship:", error);
            toast.error("Failed to save relationship. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getOrganizationName = (orgId: string) => {
        const org = organizations.find(o => o.id === orgId);
        return org ? `${org.name} (${org.organization_type})` : orgId;
    };

    return (
        <Card>
            <h4 className="font-semibold text-md mb-4">
                {isEditing ? "Update Organization Relationship" : "Add New Organization Relationship"}
            </h4>

            <form onSubmit={(e) => { e.preventDefault(); saveRelationship(); }} className="space-y-4">
                <div className="mb-4">
                    <label htmlFor="parent_organization_id" className="block mb-1 font-medium">
                        Parent Organization <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="parent_organization_id"
                        name="parent_organization_id"
                        value={relationship.parent_organization_id || ""}
                        onChange={handleInputChange}
                        className="select w-full border px-4 py-2 rounded"
                        required
                        disabled={!!parentOrganizationId} // Disable if passed as prop
                    >
                        <option value="">Select parent organization</option>
                        {organizations.map(org => (
                            <option key={org.id} value={org.id}>
                                {org.name} ({org.organization_type})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="child_organization_id" className="block mb-1 font-medium">
                        Child Organization <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="child_organization_id"
                        name="child_organization_id"
                        value={relationship.child_organization_id || ""}
                        onChange={handleInputChange}
                        className="select w-full border px-4 py-2 rounded"
                        required
                        disabled={!!childOrganizationId} // Disable if passed as prop
                    >
                        <option value="">Select child organization</option>
                        {organizations
                            .filter(org => org.id !== relationship.parent_organization_id) // Exclude parent from child options
                            .map(org => (
                                <option key={org.id} value={org.id}>
                                    {org.name} ({org.organization_type})
                                </option>
                            ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="relationship_type" className="block mb-1 font-medium">
                        Relationship Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="relationship_type"
                        name="relationship_type"
                        value={relationship.relationship_type || "subsidiary"}
                        onChange={handleInputChange}
                        className="select w-full border px-4 py-2 rounded"
                        required
                    >
                        {RELATIONSHIP_TYPES.map(type => (
                            <option key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Preview of relationship */}
                {relationship.parent_organization_id && relationship.child_organization_id && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                        <h5 className="font-medium text-sm text-blue-800 mb-2">Relationship Preview:</h5>
                        <p className="text-sm text-blue-700">
                            <strong>{getOrganizationName(relationship.parent_organization_id)}</strong>
                            {" → "}
                            <em>{relationship.relationship_type}</em>
                            {" → "}
                            <strong>{getOrganizationName(relationship.child_organization_id)}</strong>
                        </p>
                    </div>
                )}

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
        </Card>
    );
}
