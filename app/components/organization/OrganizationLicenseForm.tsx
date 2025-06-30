import axios from "axios";
import { useEffect, useState } from "react";
import { Input } from "~/components/common/Input";
import { useToast } from "~/hooks/useToast";
import Card from "../common/Card";
import {
    CreateOrganizationLicenseRequest,
    LICENSE_TYPES,
    ORGANIZATION_STATUSES,
    OrganizationLicense
} from "./types";

interface OrganizationLicenseFormProps {
    baseUrl: string;
    organizationId: string;
    licenseId?: string; // Optional, if editing an existing license
    onLicenseCreated?: (license: OrganizationLicense) => void;
    onLicenseUpdated?: (license: OrganizationLicense) => void;
    onCancel?: () => void;
}

export default function OrganizationLicenseForm({
    baseUrl,
    organizationId,
    licenseId,
    onLicenseCreated,
    onLicenseUpdated,
    onCancel,
}: OrganizationLicenseFormProps) {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(!!licenseId);

    const [license, setLicense] = useState<Partial<OrganizationLicense>>({
        organization_id: organizationId,
        license_type: "medical",
        license_number: "",
        issuing_authority: "",
        issue_date: "",
        expiration_date: "",
        status: "active",
    });

    // Fetch license details when licenseId is provided
    useEffect(() => {
        if (licenseId) {
            fetchLicenseDetails();
        }
    }, [licenseId]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchLicenseDetails = async () => {
        if (!licenseId) return;

        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/organization-licenses/${licenseId}`);
            const licenseData = response.data;

            // Format dates for datetime-local input
            if (licenseData.issue_date) {
                licenseData.issue_date = new Date(licenseData.issue_date).toISOString().slice(0, 16);
            }
            if (licenseData.expiration_date) {
                licenseData.expiration_date = new Date(licenseData.expiration_date).toISOString().slice(0, 16);
            }

            setLicense(licenseData);
            setIsEditing(true);
        } catch (error) {
            console.error("Failed to fetch license details:", error);
            toast.error("Failed to load license details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setLicense(prev => ({
            ...prev,
            [name]: value === "" ? undefined : value
        }));
    };

    const saveLicense = async () => {
        try {
            setLoading(true);

            // Prepare request data
            const requestData = { ...license };

            // Convert dates to ISO strings if provided
            if (requestData.issue_date) {
                requestData.issue_date = new Date(requestData.issue_date).toISOString();
            }
            if (requestData.expiration_date) {
                requestData.expiration_date = new Date(requestData.expiration_date).toISOString();
            }

            let response;
            if (isEditing && licenseId) {
                // Update existing license
                response = await axios.put(`${baseUrl}/organization-licenses/${licenseId}`, requestData);
                toast.success("License updated successfully!");
                if (onLicenseUpdated) {
                    onLicenseUpdated(response.data);
                }
            } else {
                // Create new license
                const createData: CreateOrganizationLicenseRequest = {
                    organization_id: organizationId,
                    license_type: license.license_type!,
                    license_number: license.license_number!,
                    issuing_authority: license.issuing_authority!,
                    issue_date: requestData.issue_date,
                    expiration_date: requestData.expiration_date,
                };
                response = await axios.post(`${baseUrl}/organization-licenses`, createData);
                toast.success("License created successfully!");

                if (onLicenseCreated) {
                    onLicenseCreated(response.data);
                }
            }

            // Reset form if creating new
            if (!isEditing) {
                setLicense({
                    organization_id: organizationId,
                    license_type: "medical",
                    license_number: "",
                    issuing_authority: "",
                    issue_date: "",
                    expiration_date: "",
                    status: "active",
                });
            }

        } catch (error) {
            console.error("Failed to save license:", error);
            toast.error("Failed to save license. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <h4 className="font-semibold text-md mb-4">
                {isEditing ? "Update License" : "Add New License"}
            </h4>

            <form onSubmit={(e) => { e.preventDefault(); saveLicense(); }} className="space-y-4">
                <div className="mb-4">
                    <label htmlFor="license_type" className="block mb-1 font-medium">
                        License Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="license_type"
                        name="license_type"
                        value={license.license_type || "medical"}
                        onChange={handleInputChange}
                        className="select w-full border px-4 py-2 rounded"
                        required
                    >
                        {LICENSE_TYPES.map(type => (
                            <option key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <Input
                    label="License Number"
                    type="text"
                    name="license_number"
                    value={license.license_number || ""}
                    onChange={handleInputChange}
                    placeholder="Enter license number"
                    wrapperClass="mb-4"
                    required
                />

                <Input
                    label="Issuing Authority"
                    type="text"
                    name="issuing_authority"
                    value={license.issuing_authority || ""}
                    onChange={handleInputChange}
                    placeholder="State Medical Board, FDA, etc."
                    wrapperClass="mb-4"
                    required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Issue Date"
                        type="datetime-local"
                        name="issue_date"
                        value={license.issue_date || ""}
                        onChange={handleInputChange}
                        wrapperClass="mb-4"
                    />

                    <Input
                        label="Expiration Date"
                        type="datetime-local"
                        name="expiration_date"
                        value={license.expiration_date || ""}
                        onChange={handleInputChange}
                        wrapperClass="mb-4"
                    />
                </div>

                {isEditing && (
                    <div className="mb-4">
                        <label htmlFor="status" className="block mb-1 font-medium">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={license.status || "active"}
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

                <div className="flex gap-2 pt-4">
                    <button
                        type="submit"
                        className={`btn btn-primary ${loading ? "loading" : ""}`}
                        disabled={loading}
                    >
                        {isEditing ? "Update License" : "Add License"}
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
