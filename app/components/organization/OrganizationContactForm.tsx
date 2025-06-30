import axios from "axios";
import { useEffect, useState } from "react";
import { Input } from "~/components/common/Input";
import { useToast } from "~/hooks/useToast";
import Card from "../common/Card";
import {
    CONTACT_TYPES,
    CreateOrganizationContactRequest,
    OrganizationContact
} from "./types";

interface OrganizationContactFormProps {
    baseUrl: string;
    organizationId: string;
    contactId?: string; // Optional, if editing an existing contact
    onContactCreated?: (contact: OrganizationContact) => void;
    onContactUpdated?: (contact: OrganizationContact) => void;
    onCancel?: () => void;
}

export default function OrganizationContactForm({
    baseUrl,
    organizationId,
    contactId,
    onContactCreated,
    onContactUpdated,
    onCancel,
}: OrganizationContactFormProps) {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(!!contactId);

    const [contact, setContact] = useState<Partial<OrganizationContact>>({
        organization_id: organizationId,
        contact_type: "phone",
        value: "",
        is_primary: false,
        description: "",
    });

    // Fetch contact details when contactId is provided
    useEffect(() => {
        if (contactId) {
            fetchContactDetails();
        }
    }, [contactId]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchContactDetails = async () => {
        if (!contactId) return;

        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/organization-contacts/${contactId}`);
            setContact(response.data);
            setIsEditing(true);
        } catch (error) {
            console.error("Failed to fetch contact details:", error);
            toast.error("Failed to load contact details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setContact(prev => ({
            ...prev,
            [name]: type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : value === "" ? undefined : value
        }));
    };

    const saveContact = async () => {
        try {
            setLoading(true);

            let response;
            if (isEditing && contactId) {
                // Update existing contact
                const updateData = { ...contact };
                response = await axios.put(`${baseUrl}/organization-contacts/${contactId}`, updateData);
                toast.success("Contact updated successfully!");
                if (onContactUpdated) {
                    onContactUpdated(response.data);
                }
            } else {
                // Create new contact
                const createData: CreateOrganizationContactRequest = {
                    organization_id: organizationId,
                    contact_type: contact.contact_type!,
                    value: contact.value!,
                    is_primary: contact.is_primary!,
                    description: contact.description,
                };
                response = await axios.post(`${baseUrl}/organization-contacts`, createData);
                toast.success("Contact created successfully!");

                if (onContactCreated) {
                    onContactCreated(response.data);
                }
            }

            // Reset form if creating new
            if (!isEditing) {
                setContact({
                    organization_id: organizationId,
                    contact_type: "phone",
                    value: "",
                    is_primary: false,
                    description: "",
                });
            }

        } catch (error) {
            console.error("Failed to save contact:", error);
            toast.error("Failed to save contact. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getPlaceholder = () => {
        switch (contact.contact_type) {
            case "phone":
                return "+1 (555) 123-4567";
            case "email":
                return "contact@organization.com";
            case "fax":
                return "+1 (555) 123-4568";
            case "website":
                return "https://organization.com";
            case "emergency":
                return "+1 (555) 911-0000";
            default:
                return "Enter contact value";
        }
    };

    const getInputType = () => {
        switch (contact.contact_type) {
            case "email":
                return "email";
            case "website":
                return "url";
            case "phone":
            case "fax":
            case "emergency":
                return "tel";
            default:
                return "text";
        }
    };

    return (
        <Card>
            <h4 className="font-semibold text-md mb-4">
                {isEditing ? "Update Contact" : "Add New Contact"}
            </h4>

            <form onSubmit={(e) => { e.preventDefault(); saveContact(); }} className="space-y-4">
                <div className="mb-4">
                    <label htmlFor="contact_type" className="block mb-1 font-medium">
                        Contact Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="contact_type"
                        name="contact_type"
                        value={contact.contact_type || "phone"}
                        onChange={handleInputChange}
                        className="select w-full border px-4 py-2 rounded"
                        required
                    >
                        {CONTACT_TYPES.map(type => (
                            <option key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <Input
                    label="Contact Value"
                    type={getInputType()}
                    name="value"
                    value={contact.value || ""}
                    onChange={handleInputChange}
                    placeholder={getPlaceholder()}
                    wrapperClass="mb-4"
                    required
                />

                <div className="mb-4">
                    <label htmlFor="description" className="block mb-1 font-medium">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={contact.description || ""}
                        onChange={handleInputChange}
                        placeholder="Additional details about this contact"
                        className="textarea w-full border px-4 py-2 rounded"
                        rows={2}
                    />
                </div>

                <div className="mb-4 flex items-center">
                    <label htmlFor="is_primary" className="font-medium flex-grow cursor-pointer">
                        Primary Contact
                    </label>
                    <input
                        id="is_primary"
                        type="checkbox"
                        name="is_primary"
                        checked={contact.is_primary || false}
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
                        {isEditing ? "Update Contact" : "Add Contact"}
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
