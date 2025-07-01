/**
 * Patient API Types
 * 
 * This file contains all TypeScript types and interfaces for patient-related data structures.
 * These types correspond to the Go backend patient models.
 */

// Base Patient interface - matches Go Patient struct
export interface Patient {
    /** Unique identifier for the patient */
    id: string;
    /** Resource type - always "Patient" */
    resourceType: string;
    /** Whether the patient record is active */
    active: boolean;
    /** Patient's names */
    name: HumanName[];
    /** Patient's gender */
    gender: string;
    /** Patient's birth date */
    birthDate: string;
    /** Contact information */
    telecom: ContactPoint[];
    /** Addresses */
    address: Address[];
}

// Human Name interface
export interface HumanName {
    /** Use of the name (e.g., "official", "usual") */
    use: string;
    /** Family name/surname */
    family: string;
    /** Given names */
    given: string[];
}

// Contact Point interface
export interface ContactPoint {
    /** Contact system (e.g., "phone", "email") */
    system: string;
    /** Contact value */
    value: string;
    /** Use of the contact (e.g., "home", "work") */
    use: string;
}

// Address interface
export interface Address {
    /** Use of the address (e.g., "home", "work") */
    use: string;
    /** Type of address */
    type: string;
    /** Full address as text */
    text: string;
    /** Address lines */
    line: string[];
    /** City */
    city: string;
    /** District */
    district: string;
    /** State/province */
    state: string;
    /** Postal code */
    postalCode: string;
    /** Country */
    country: string;
}

// Medication interface - matches Go Medication struct
export interface Medication {
    /** Unique identifier */
    id: string;
    /** Medication name */
    name: string;
    /** Directions for use */
    direction: string;
    /** Who prescribed the medication */
    prescribed_by: string;
    /** Dosage information */
    dosage: string;
    /** Frequency of administration */
    frequency: string;
    /** Current status */
    status: string;
    /** Additional notes */
    notes: string;
    /** Start date */
    start_date?: string;
    /** End date */
    end_date?: string;
}

// Health Condition interface - matches Go HealthCondition struct
export interface HealthCondition {
    /** Unique identifier */
    id: string;
    /** Condition name */
    name: string;
    /** Source ID */
    source_id: string;
    /** Date diagnosed */
    diagnosed_on: string;
    /** Additional notes */
    notes: string;
    /** Current status */
    status: string;
    /** Creation timestamp */
    created_at?: string;
    /** Deletion timestamp */
    deleted_at?: string;
}

// Immunization interface - matches Go Immunization struct
export interface Immunization {
    /** Unique identifier */
    id: string;
    /** Vaccine name */
    vaccine: string;
    /** Date administered */
    date_administered: string;
    /** Additional notes */
    notes: string;
    /** Creation timestamp */
    created_at?: string;
    /** Deletion timestamp */
    deleted_at?: string;
}

// Vital interface - matches Go Vital struct
export interface Vital {
    /** Unique identifier */
    id: string;
    /** Type of vital sign */
    type: string;
    /** Measured value */
    value: string;
    /** Unit of measurement */
    unit: string;
    /** When the vital was measured */
    measured_at?: string;
    /** Creation timestamp */
    created_at?: string;
    /** Deletion timestamp */
    deleted_at?: string;
}

// Personal Health Condition interface - matches Go PersonalHealthCondition struct
export interface PersonalHealthCondition {
    /** Unique identifier */
    id: string;
    /** Type of condition */
    type: string;
    /** Value/description */
    value: string;
    /** Additional notes */
    notes: string;
    /** Current status */
    status: string;
    /** Creation timestamp */
    created_at?: string;
    /** Deletion timestamp */
    deleted_at?: string;
}

// Family Health Condition interface - matches Go FamilyHealthCondition struct
export interface FamilyHealthCondition {
    /** Unique identifier */
    id: string;
    /** Family relation */
    relation: string;
    /** Health condition */
    condition: string;
    /** Additional notes */
    notes: string;
    /** Current status */
    status: string;
    /** Creation timestamp */
    created_at?: string;
    /** Deletion timestamp */
    deleted_at?: string;
}

// Procedure interface - matches Go Procedure struct
export interface Procedure {
    /** Unique identifier */
    id?: string;
    /** Procedure name */
    name: string;
    /** Date performed */
    performed_on: string;
    /** Location where performed */
    location: string;
    /** Outcome of the procedure */
    outcome: string;
    /** Additional notes */
    notes: string;
    /** Source ID */
    source_id: string;
    /** Creation timestamp */
    created_at?: string;
    /** Deletion timestamp */
    deleted_at?: string;
}

// Allergy interface - matches Go Allergy struct
export interface Allergy {
    /** Unique identifier */
    id: string;
    /** Allergic substance */
    substance: string;
    /** Reaction description */
    reaction: string;
    /** Current status */
    status: string;
    /** Severity level */
    severity: string;
    /** Additional notes */
    notes: string;
    /** Creation timestamp */
    created_at?: string;
    /** Deletion timestamp */
    deleted_at?: string;
}

// Result interface - matches Go Result struct
export interface Result {
    /** Unique identifier */
    id: string;
    /** Type of result */
    type: string;
    /** Result value */
    value: string;
    /** Unit of measurement */
    unit: string;
    /** Reference range */
    reference_range: string;
    /** Date of the result */
    result_date?: string;
    /** Additional notes */
    notes: string;
    /** Creation timestamp */
    created_at?: string;
    /** Deletion timestamp */
    deleted_at?: string;
}

// Practitioner Summary interface - matches Go PractitionerSummary struct
export interface PractitionerSummary {
    /** Unique identifier */
    id: string;
    /** First name */
    first_name: string;
    /** Last name */
    last_name: string;
    /** Email address */
    email: string;
}

// Create types for API input (without generated fields)
export type CreateMedicationData = Omit<Medication, 'id'>;
export type CreateHealthConditionData = Omit<HealthCondition, 'id' | 'created_at' | 'deleted_at'>;
export type CreateImmunizationData = Omit<Immunization, 'id' | 'created_at' | 'deleted_at'>;
export type CreateVitalData = Omit<Vital, 'id' | 'created_at' | 'deleted_at'>;
export type CreatePersonalHealthConditionData = Omit<PersonalHealthCondition, 'id' | 'created_at' | 'deleted_at'>;
export type CreateFamilyHealthConditionData = Omit<FamilyHealthCondition, 'id' | 'created_at' | 'deleted_at'>;
export type CreateProcedureData = Omit<Procedure, 'id' | 'created_at' | 'deleted_at'>;
export type CreateAllergyData = Omit<Allergy, 'id' | 'created_at' | 'deleted_at'>;
export type CreateResultData = Omit<Result, 'id' | 'created_at' | 'deleted_at'>;

// API Response types
export interface ApiResponse<T> {
    data: T;
    message?: string;
    error?: string;
}

// Common status values
export const MEDICATION_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    COMPLETED: 'completed',
    DISCONTINUED: 'discontinued'
} as const;

export const CONDITION_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    RESOLVED: 'resolved',
    REMISSION: 'remission'
} as const;

export const ALLERGY_SEVERITY = {
    MILD: 'mild',
    MODERATE: 'moderate',
    SEVERE: 'severe',
    LIFE_THREATENING: 'life-threatening'
} as const;

export type MedicationStatus = typeof MEDICATION_STATUS[keyof typeof MEDICATION_STATUS];
export type ConditionStatus = typeof CONDITION_STATUS[keyof typeof CONDITION_STATUS];
export type AllergySeverity = typeof ALLERGY_SEVERITY[keyof typeof ALLERGY_SEVERITY];
