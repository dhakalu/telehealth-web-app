// Pharmacist types based on Go models

export interface Pharmacist {
    id: string;
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
    specializations: string[];
    certifications: string[];
    can_dispense_controlled: boolean;
    can_counsel_patients: boolean;
    can_verify_prescriptions: boolean;
    active: boolean;
    verified: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}

export interface PharmacistWithUser {
    id: string;
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
    specializations: string[];
    certifications: string[];
    can_dispense_controlled: boolean;
    can_counsel_patients: boolean;
    can_verify_prescriptions: boolean;
    active: boolean;
    verified: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    given_name?: string;
    family_name?: string;
    middle_name?: string;
    email?: string;
    phone_number?: string;
}

export interface CreatePharmacistRequest {
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
}

export interface UpdatePharmacistRequest {
    organization_id?: string;
    employee_id?: string;
    license_number?: string;
    license_state?: string;
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

export interface PharmacistFilter {
    organization_id?: string;
    license_state?: string;
    position?: string;
    active?: boolean;
    verified?: boolean;
    name?: string;
}

// Constants for dropdowns
export const US_STATES = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
] as const;

export const PHARMACIST_POSITIONS = [
    "Staff Pharmacist",
    "Pharmacy Manager",
    "Clinical Pharmacist",
    "Hospital Pharmacist",
    "Retail Pharmacist",
    "Consultant Pharmacist",
    "Industrial Pharmacist",
    "Nuclear Pharmacist",
    "Ambulatory Care Pharmacist",
    "Emergency Medicine Pharmacist",
    "Geriatric Pharmacist",
    "Infectious Diseases Pharmacist",
    "Oncology Pharmacist",
    "Pediatric Pharmacist",
    "Pharmacotherapy Specialist",
    "Psychiatric Pharmacist",
    "Relief Pharmacist",
    "Other"
] as const;

export const PHARMACIST_SPECIALIZATIONS = [
    "Ambulatory Care",
    "Cardiology",
    "Critical Care",
    "Emergency Medicine",
    "Endocrinology",
    "Geriatrics",
    "Hematology/Oncology",
    "Infectious Diseases",
    "Internal Medicine",
    "Mental Health/Psychiatry",
    "Nephrology",
    "Neurology",
    "Nuclear Pharmacy",
    "Nutrition Support",
    "Pain Management",
    "Pediatrics",
    "Pharmacogenomics",
    "Pharmacokinetics",
    "Solid Organ Transplantation",
    "Toxicology",
    "Other"
] as const;

export const PHARMACIST_CERTIFICATIONS = [
    "Board Certified Pharmacotherapy Specialist (BCPS)",
    "Board Certified Ambulatory Care Pharmacist (BCACP)",
    "Board Certified Critical Care Pharmacist (BCCCP)",
    "Board Certified Emergency Medicine Pharmacist (BCEMP)",
    "Board Certified Geriatric Pharmacist (BCGP)",
    "Board Certified Infectious Diseases Pharmacist (BCIDP)",
    "Board Certified Nuclear Pharmacist (BCNP)",
    "Board Certified Nutrition Support Pharmacist (BCNSP)",
    "Board Certified Oncology Pharmacist (BCOP)",
    "Board Certified Pediatric Pharmacy Specialist (BCPPS)",
    "Board Certified Psychiatric Pharmacist (BCPP)",
    "Certified Diabetes Care and Education Specialist (CDCES)",
    "Certified Geriatric Pharmacist (CGP)",
    "Certified Immunizing Pharmacist",
    "Certified Medication Therapy Management",
    "Certified Poison Information Specialist (CPIS)",
    "Compounded Sterile Preparation Technician (CSPT)",
    "Other"
] as const;
