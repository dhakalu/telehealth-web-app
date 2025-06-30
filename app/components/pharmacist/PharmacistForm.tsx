import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "~/hooks/useToast";
import Button from "../common/Button";
import { CheckboxGroup } from "../common/CheckboxGroup";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import TypeAHeadSearch from "../common/TypeAHeadSearch";
import {
    CreatePharmacistRequest,
    PHARMACIST_CERTIFICATIONS,
    PHARMACIST_POSITIONS,
    PHARMACIST_SPECIALIZATIONS,
    PharmacistWithUser,
    UpdatePharmacistRequest,
    US_STATES
} from "./types";

interface PharmacistFormData {
    user_id: string;
    organization_id?: string;
    employee_id?: string;
    license_number: string;
    license_state: string;
    license_expiry_date?: string;
    npi_number?: string;
    dea_number?: string;
    position?: string;
    hire_date?: string;
    years_experience?: number;
    specializations?: string[];
    certifications?: string[];
    can_dispense_controlled?: boolean;
    can_counsel_patients?: boolean;
    can_verify_prescriptions?: boolean;
    active?: boolean;
    verified?: boolean;
}

interface PharmacistFormProps {
    baseUrl: string;
    userId: string; // For creating new pharmacist
    pharmacistId?: string; // For editing existing pharmacist
    onPharmacistCreated?: (pharmacist: PharmacistWithUser) => void;
    onPharmacistUpdated?: (pharmacist: PharmacistWithUser) => void;
}

export default function PharmacistForm({
    userId,
    baseUrl,
    pharmacistId,
    onPharmacistCreated,
    onPharmacistUpdated,
}: PharmacistFormProps) {
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<PharmacistFormData>({
        user_id: "",
        organization_id: "",
        employee_id: "",
        license_number: "",
        license_state: "",
        license_expiry_date: "",
        npi_number: "",
        dea_number: "",
        position: "",
        hire_date: "",
        years_experience: undefined,
        specializations: [],
        certifications: [],
        can_dispense_controlled: true,
        can_counsel_patients: true,
        can_verify_prescriptions: true,
    });

    // Prepare options for Select components
    const stateOptions = US_STATES.map(state => ({
        value: state,
        label: state
    }));

    const positionOptions = PHARMACIST_POSITIONS.map(position => ({
        value: position,
        label: position
    }));

    const specializationOptions = PHARMACIST_SPECIALIZATIONS.map(spec => ({
        value: spec,
        label: spec
    }));

    const certificationOptions = PHARMACIST_CERTIFICATIONS.map(cert => ({
        value: cert,
        label: cert
    }));

    // Load existing pharmacist data when editing
    useEffect(() => {
        const fetchPharmacistData = async () => {
            if (!pharmacistId) return;

            setIsLoading(true);
            try {
                const response = await axios.get(`${baseUrl}/pharmacists/${pharmacistId}`);
                const pharmacist = response.data;

                setFormData({
                    user_id: pharmacist.user_id,
                    organization_id: pharmacist.organization_id || "",
                    employee_id: pharmacist.employee_id || "",
                    license_number: pharmacist.license_number,
                    license_state: pharmacist.license_state,
                    license_expiry_date: pharmacist.license_expiry_date ? pharmacist.license_expiry_date.split('T')[0] : "",
                    npi_number: pharmacist.npi_number || "",
                    dea_number: pharmacist.dea_number || "",
                    position: pharmacist.position || "",
                    hire_date: pharmacist.hire_date ? pharmacist.hire_date.split('T')[0] : "",
                    years_experience: pharmacist.years_experience,
                    specializations: pharmacist.specializations || [],
                    certifications: pharmacist.certifications || [],
                    can_dispense_controlled: pharmacist.can_dispense_controlled,
                    can_counsel_patients: pharmacist.can_counsel_patients,
                    can_verify_prescriptions: pharmacist.can_verify_prescriptions,
                });
            } catch (error) {
                console.error("Failed to fetch pharmacist data:", error);
                toast.error("Failed to load pharmacist data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        if (pharmacistId) {
            fetchPharmacistData();
        }
    }, [pharmacistId, baseUrl, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let response;
            if (pharmacistId) {
                // Update existing pharmacist - exclude user_id and prepare UpdatePharmacistRequest
                const updateData: UpdatePharmacistRequest = {
                    organization_id: formData.organization_id || undefined,
                    employee_id: formData.employee_id || undefined,
                    license_number: formData.license_number || undefined,
                    license_state: formData.license_state || undefined,
                    license_expiry_date: formData.license_expiry_date || undefined,
                    npi_number: formData.npi_number || undefined,
                    dea_number: formData.dea_number || undefined,
                    position: formData.position || undefined,
                    hire_date: formData.hire_date || undefined,
                    years_experience: formData.years_experience || undefined,
                    specializations: formData.specializations?.length ? formData.specializations : undefined,
                    certifications: formData.certifications?.length ? formData.certifications : undefined,
                    can_dispense_controlled: formData.can_dispense_controlled,
                    can_counsel_patients: formData.can_counsel_patients,
                    can_verify_prescriptions: formData.can_verify_prescriptions,
                    active: formData.active,
                    verified: formData.verified,
                };

                response = await axios.put(`${baseUrl}/pharmacists/${pharmacistId}`, updateData);
                onPharmacistUpdated?.(response.data);
                toast.success("Pharmacist updated successfully!");
            } else {
                // Create new pharmacist - prepare CreatePharmacistRequest
                const createData: CreatePharmacistRequest = {
                    user_id: userId,
                    organization_id: formData.organization_id || undefined,
                    employee_id: formData.employee_id || undefined,
                    license_number: formData.license_number,
                    license_state: formData.license_state,
                    license_expiry_date: formData.license_expiry_date || undefined,
                    npi_number: formData.npi_number || undefined,
                    dea_number: formData.dea_number || undefined,
                    position: formData.position || undefined,
                    hire_date: formData.hire_date || undefined,
                    years_experience: formData.years_experience || undefined,
                    specializations: formData.specializations?.length ? formData.specializations : undefined,
                    certifications: formData.certifications?.length ? formData.certifications : undefined,
                    can_dispense_controlled: formData.can_dispense_controlled,
                    can_counsel_patients: formData.can_counsel_patients,
                    can_verify_prescriptions: formData.can_verify_prescriptions,
                };

                response = await axios.post(`${baseUrl}/pharmacists`, createData);
                onPharmacistCreated?.(response.data);
                toast.success("Pharmacist created successfully!");

                // Reset form for new creation
                setFormData({
                    user_id: "",
                    organization_id: "",
                    employee_id: "",
                    license_number: "",
                    license_state: "",
                    license_expiry_date: "",
                    npi_number: "",
                    dea_number: "",
                    position: "",
                    hire_date: "",
                    years_experience: undefined,
                    specializations: [],
                    certifications: [],
                    can_dispense_controlled: true,
                    can_counsel_patients: true,
                    can_verify_prescriptions: true,
                });
            }
        } catch (error) {
            console.error("Failed to save pharmacist:", error);
            let errorMessage = `Failed to ${pharmacistId ? 'update' : 'create'} pharmacist. Please try again.`;
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
        } else if (type === "number") {
            const numValue = value === "" ? undefined : parseInt(value, 10);
            setFormData(prev => ({ ...prev, [name]: numValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSpecializationsChange = (values: string[]) => {
        setFormData(prev => ({ ...prev, specializations: values }));
    };

    const handleCertificationsChange = (values: string[]) => {
        setFormData(prev => ({ ...prev, certifications: values }));
    };

    if (isLoading) {
        return (
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="flex justify-center items-center h-64">
                        <span className="loading loading-spinner loading-lg"></span>
                        <span className="ml-4">Loading pharmacist data...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">
                    {pharmacistId ? "Edit Pharmacist" : "Create New Pharmacist"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <TypeAHeadSearch
                                label="Organization(Optional)"
                                url={`${baseUrl}/organizations`}
                                // name="organization_id"
                                labelKey="name"
                                resultKey="id"
                                value={formData.organization_id || ""}
                                onSelect={(orgId) => setFormData(prev => ({ ...prev, organization_id: orgId }))}
                            />

                            <Input
                                label="Employee ID"
                                name="employee_id"
                                value={formData.employee_id || ""}
                                onChange={handleInputChange}
                                placeholder="Enter employee ID (optional)"
                            />

                            <Select
                                label="Position"
                                name="position"
                                value={formData.position || ""}
                                onChange={handleInputChange}
                                options={positionOptions}
                            />
                        </div>
                    </div>

                    {/* License Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">License Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="License Number"
                                name="license_number"
                                value={formData.license_number}
                                onChange={handleInputChange}
                                placeholder="Enter license number"
                                required
                            />

                            <Select
                                label="License State"
                                name="license_state"
                                value={formData.license_state}
                                onChange={handleInputChange}
                                options={stateOptions}
                                required
                            />

                            <Input
                                label="License Expiry Date"
                                name="license_expiry_date"
                                type="date"
                                value={formData.license_expiry_date || ""}
                                onChange={handleInputChange}
                            />

                            <Input
                                label="NPI Number"
                                name="npi_number"
                                value={formData.npi_number || ""}
                                onChange={handleInputChange}
                                placeholder="Enter NPI number (optional)"
                            />

                            <Input
                                label="DEA Number"
                                name="dea_number"
                                value={formData.dea_number || ""}
                                onChange={handleInputChange}
                                placeholder="Enter DEA number (optional)"
                            />
                        </div>
                    </div>

                    {/* Employment Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Employment Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Hire Date"
                                name="hire_date"
                                type="date"
                                value={formData.hire_date || ""}
                                onChange={handleInputChange}
                            />

                            <Input
                                label="Years of Experience"
                                name="years_experience"
                                type="number"
                                value={formData.years_experience || ""}
                                onChange={handleInputChange}
                                placeholder="Enter years of experience"
                                min="0"
                            />
                        </div>
                    </div>

                    {/* Specializations and Certifications */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Professional Qualifications</h3>

                        <CheckboxGroup
                            label="Specializations"
                            name="specializations"
                            options={specializationOptions}
                            value={formData.specializations || []}
                            onChange={handleSpecializationsChange}
                        />

                        <CheckboxGroup
                            label="Certifications"
                            name="certifications"
                            options={certificationOptions}
                            value={formData.certifications || []}
                            onChange={handleCertificationsChange}
                        />
                    </div>

                    {/* Permissions */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Permissions</h3>
                        <div className="space-y-2">
                            <div className="form-control">
                                <label className="label cursor-pointer justify-start">
                                    <input
                                        type="checkbox"
                                        name="can_dispense_controlled"
                                        checked={formData.can_dispense_controlled || false}
                                        onChange={handleInputChange}
                                        className="checkbox checkbox-primary mr-3"
                                    />
                                    <span className="label-text font-medium">Can dispense controlled substances</span>
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer justify-start">
                                    <input
                                        type="checkbox"
                                        name="can_counsel_patients"
                                        checked={formData.can_counsel_patients || false}
                                        onChange={handleInputChange}
                                        className="checkbox checkbox-primary mr-3"
                                    />
                                    <span className="label-text font-medium">Can counsel patients</span>
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer justify-start">
                                    <input
                                        type="checkbox"
                                        name="can_verify_prescriptions"
                                        checked={formData.can_verify_prescriptions || false}
                                        onChange={handleInputChange}
                                        className="checkbox checkbox-primary mr-3"
                                    />
                                    <span className="label-text font-medium">Can verify prescriptions</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="card-actions justify-end">
                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? (pharmacistId ? 'Updating...' : 'Creating...')
                                : (pharmacistId ? 'Update Pharmacist' : 'Create Pharmacist')
                            }
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
