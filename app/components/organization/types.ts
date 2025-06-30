// Organization types based on Go models

export interface Organization {
    id: string;
    name: string;
    organization_type: string;
    status: string;
    description?: string;
    tax_id?: string;
    founded_date?: string;
    website?: string;
    created_at: string;
    updated_at: string;
}

export interface OrganizationAddress {
    id: string;
    organization_id: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    is_primary: boolean;
    created_at: string;
    updated_at: string;
}

export interface OrganizationContact {
    id: string;
    organization_id: string;
    contact_type: string;
    value: string;
    is_primary: boolean;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface OrganizationLicense {
    id: string;
    organization_id: string;
    license_type: string;
    license_number: string;
    issuing_authority: string;
    issue_date?: string;
    expiration_date?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface PractitionerOrganization {
    id: string;
    practitioner_id: string;
    organization_id: string;
    role?: string;
    start_date?: string;
    end_date?: string;
    is_primary: boolean;
    created_at: string;
    updated_at: string;
}

export interface OrganizationRelationship {
    id: string;
    parent_organization_id: string;
    child_organization_id: string;
    relationship_type: string;
    created_at: string;
    updated_at: string;
}

export interface OrganizationPharmacist {
    id: string;
    organization_id: string;
    pharmacist_id: string;
    supervisor_id?: string;
    role?: string;
    employment_type: string;
    start_date?: string;
    end_date?: string;
    is_primary: boolean;
    active: boolean;
    created_at: string;
    updated_at: string;
}

// Request types for API calls
export interface CreateOrganizationRequest {
    name: string;
    organization_type: string;
    description?: string;
    tax_id?: string;
    founded_date?: string;
    website?: string;
}

export interface UpdateOrganizationRequest {
    name?: string;
    organization_type?: string;
    status?: string;
    description?: string;
    tax_id?: string;
    founded_date?: string;
    website?: string;
}

export interface CreateOrganizationAddressRequest {
    organization_id: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    is_primary: boolean;
}

export interface CreateOrganizationContactRequest {
    organization_id: string;
    contact_type: string;
    value: string;
    is_primary: boolean;
    description?: string;
}

export interface CreateOrganizationLicenseRequest {
    organization_id: string;
    license_type: string;
    license_number: string;
    issuing_authority: string;
    issue_date?: string;
    expiration_date?: string;
}

export interface CreatePractitionerOrganizationRequest {
    practitioner_id: string;
    organization_id: string;
    role?: string;
    start_date?: string;
    end_date?: string;
    is_primary: boolean;
}

export interface CreateOrganizationRelationshipRequest {
    parent_organization_id: string;
    child_organization_id: string;
    relationship_type: string;
}

export interface CreateOrganizationPharmacistRequest {
    pharmacist_id: string;
    organization_id: string;
    supervisor_id?: string;
    role?: string;
    employment_type?: string;
    start_date?: string;
    end_date?: string;
    is_primary?: boolean;
}

// Constants for dropdowns
export const ORGANIZATION_TYPES = [
    "hospital",
    "clinic",
    "pharmacy",
    "laboratory",
    "imaging_center",
    "specialist_center",
    "urgent_care",
    "telehealth_provider",
    "insurance_provider",
    "other"
] as const;

export const ORGANIZATION_STATUSES = [
    "active",
    "inactive",
    "pending",
    "suspended"
] as const;

export const CONTACT_TYPES = [
    "phone",
    "email",
    "fax",
    "website",
    "emergency"
] as const;

export const LICENSE_TYPES = [
    "medical",
    "pharmacy",
    "laboratory",
    "facility",
    "business",
    "other"
] as const;

export const RELATIONSHIP_TYPES = [
    "subsidiary",
    "branch",
    "affiliate",
    "department",
    "division"
] as const;

export const EMPLOYMENT_TYPES = [
    "full_time",
    "part_time",
    "relief",
    "contractor"
] as const;
