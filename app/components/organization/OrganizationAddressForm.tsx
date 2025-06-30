import axios from "axios";
import { useEffect, useState } from "react";
import { Input } from "~/components/common/Input";
import { useToast } from "~/hooks/useToast";
import Card from "../common/Card";
import {
    CreateOrganizationAddressRequest,
    OrganizationAddress
} from "./types";

interface OrganizationAddressFormProps {
    baseUrl: string;
    organizationId: string;
    addressId?: string; // Optional, if editing an existing address
    onAddressCreated?: (address: OrganizationAddress) => void;
    onAddressUpdated?: (address: OrganizationAddress) => void;
    onCancel?: () => void;
}

export default function OrganizationAddressForm({
    baseUrl,
    organizationId,
    addressId,
    onAddressCreated,
    onAddressUpdated,
    onCancel,
}: OrganizationAddressFormProps) {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(!!addressId);

    const [address, setAddress] = useState<Partial<OrganizationAddress>>({
        organization_id: organizationId,
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "United States",
        is_primary: false,
    });

    // Fetch address details when addressId is provided
    useEffect(() => {
        if (addressId) {
            fetchAddressDetails();
        }
    }, [addressId]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchAddressDetails = async () => {
        if (!addressId) return;

        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/organization-addresses/${addressId}`);
            setAddress(response.data);
            setIsEditing(true);
        } catch (error) {
            console.error("Failed to fetch address details:", error);
            toast.error("Failed to load address details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setAddress(prev => ({
            ...prev,
            [name]: type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : value === "" ? undefined : value
        }));
    };

    const saveAddress = async () => {
        try {
            setLoading(true);

            let response;
            if (isEditing && addressId) {
                // Update existing address
                const updateData = { ...address };
                response = await axios.put(`${baseUrl}/organization-addresses/${addressId}`, updateData);
                toast.success("Address updated successfully!");
                if (onAddressUpdated) {
                    onAddressUpdated(response.data);
                }
            } else {
                // Create new address
                const createData: CreateOrganizationAddressRequest = {
                    organization_id: organizationId,
                    address_line_1: address.address_line_1!,
                    address_line_2: address.address_line_2,
                    city: address.city!,
                    state: address.state!,
                    postal_code: address.postal_code!,
                    country: address.country!,
                    is_primary: address.is_primary!,
                };
                response = await axios.post(`${baseUrl}/organization-addresses`, createData);
                toast.success("Address created successfully!");

                if (onAddressCreated) {
                    onAddressCreated(response.data);
                }
            }

            // Reset form if creating new
            if (!isEditing) {
                setAddress({
                    organization_id: organizationId,
                    address_line_1: "",
                    address_line_2: "",
                    city: "",
                    state: "",
                    postal_code: "",
                    country: "United States",
                    is_primary: false,
                });
            }

        } catch (error) {
            console.error("Failed to save address:", error);
            toast.error("Failed to save address. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <h4 className="font-semibold text-md mb-4">
                {isEditing ? "Update Address" : "Add New Address"}
            </h4>

            <form onSubmit={(e) => { e.preventDefault(); saveAddress(); }} className="space-y-4">
                <Input
                    label="Address Line 1"
                    type="text"
                    name="address_line_1"
                    value={address.address_line_1 || ""}
                    onChange={handleInputChange}
                    placeholder="Street address"
                    wrapperClass="mb-4"
                    required
                />

                <Input
                    label="Address Line 2"
                    type="text"
                    name="address_line_2"
                    value={address.address_line_2 || ""}
                    onChange={handleInputChange}
                    placeholder="Apartment, suite, etc. (optional)"
                    wrapperClass="mb-4"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="City"
                        type="text"
                        name="city"
                        value={address.city || ""}
                        onChange={handleInputChange}
                        placeholder="City"
                        required
                    />

                    <Input
                        label="State/Province"
                        type="text"
                        name="state"
                        value={address.state || ""}
                        onChange={handleInputChange}
                        placeholder="State or Province"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Postal Code"
                        type="text"
                        name="postal_code"
                        value={address.postal_code || ""}
                        onChange={handleInputChange}
                        placeholder="ZIP/Postal Code"
                        required
                    />

                    <div>
                        <label htmlFor="country" className="block mb-1 font-medium">
                            Country <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="country"
                            name="country"
                            value={address.country || "United States"}
                            onChange={handleInputChange}
                            className="select w-full border px-4 py-2 rounded"
                            required
                        >
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Australia">Australia</option>
                            <option value="Germany">Germany</option>
                            <option value="France">France</option>
                            <option value="Japan">Japan</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="mb-4 flex items-center">
                    <label htmlFor="is_primary" className="font-medium flex-grow cursor-pointer">
                        Primary Address
                    </label>
                    <input
                        id="is_primary"
                        type="checkbox"
                        name="is_primary"
                        checked={address.is_primary || false}
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
                        {isEditing ? "Update Address" : "Add Address"}
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
