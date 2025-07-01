/**
 * Prescription API Types
 * 
 * This file contains all TypeScript types and interfaces for prescription-related data structures.
 * These types correspond to the Go backend prescription models and handler definitions.
 */

// Prescription Status enum
export type PrescriptionStatus = 
  | 'pending'
  | 'sent'
  | 'filled'
  | 'cancelled'
  | 'rejected'
  | 'expired';

// Prescription Type enum
export type PrescriptionType = 
  | 'new'
  | 'refill'
  | 'renewal'
  | 'substitution';

// Base Prescription interface - matches Go Prescription struct
export interface Prescription {
  /** Unique identifier */
  id: string;
  /** Prescription number */
  prescription_number: string;
  /** Patient ID */
  patient_id: string;
  /** Practitioner ID */
  practitioner_id: string;
  /** Pharmacy ID */
  pharmacy_id?: string;
  /** Medication name */
  medication_name: string;
  /** Generic name */
  generic_name?: string;
  /** Strength */
  strength?: string;
  /** Dosage form */
  dosage_form?: string;
  /** Quantity */
  quantity: number;
  /** Days supply */
  days_supply?: number;
  /** Directions for use */
  directions_for_use: string;
  /** Frequency */
  frequency?: string;
  /** Prescription type */
  prescription_type: PrescriptionType;
  /** Status */
  status: PrescriptionStatus;
  /** Refills authorized */
  refills_authorized: number;
  /** Refills remaining */
  refills_remaining: number;
  /** Prescribed date */
  prescribed_date: string;
  /** Expiry date */
  expiry_date?: string;
  /** Last filled date */
  last_filled_date?: string;
  /** DEA number */
  dea_number?: string;
  /** Is controlled substance */
  is_controlled_substance: boolean;
  /** Schedule class */
  schedule_class?: string;
  /** Indication */
  indication?: string;
  /** Notes */
  notes?: string;
  /** Electronic signature */
  electronic_signature?: string;
  /** Creation timestamp */
  created_at?: string;
  /** Update timestamp */
  updated_at?: string;
  /** Deletion timestamp */
  deleted_at?: string;
}

// Prescription Fulfillment interface - matches Go PrescriptionFulfillment struct
export interface PrescriptionFulfillment {
  /** Unique identifier */
  id: string;
  /** Prescription ID */
  prescription_id: string;
  /** Pharmacy ID */
  pharmacy_id: string;
  /** Filled quantity */
  filled_quantity: number;
  /** Unit price */
  unit_price?: number;
  /** Total price */
  total_price?: number;
  /** Insurance covered */
  insurance_covered?: number;
  /** Patient copay */
  patient_copay?: number;
  /** Dispensed medication name */
  dispensed_medication_name?: string;
  /** Dispensed generic name */
  dispensed_generic_name?: string;
  /** Lot number */
  lot_number?: string;
  /** Expiry date */
  expiry_date?: string;
  /** Manufacturer */
  manufacturer?: string;
  /** Dispensed by pharmacist ID */
  dispensed_by_pharmacist_id?: string;
  /** Pharmacist license number */
  pharmacist_license_number?: string;
  /** Filled date */
  filled_date: string;
  /** Pickup date */
  pickup_date?: string;
  /** Creation timestamp */
  created_at?: string;
}

// Drug Database interface - matches Go DrugDatabase struct
export interface DrugDatabase {
  /** Unique identifier */
  id: string;
  /** Generic name */
  generic_name: string;
  /** Brand names */
  brand_names: string[];
  /** Strength options */
  strength_options: string[];
  /** Dosage forms */
  dosage_forms: string[];
  /** Is controlled substance */
  is_controlled_substance: boolean;
  /** Schedule class */
  schedule_class?: string;
  /** Typical dosage range */
  typical_dosage_range?: string;
  /** Contraindications */
  contraindications?: string;
  /** Drug interactions */
  drug_interactions: string[];
  /** Side effects */
  side_effects: string[];
  /** Creation timestamp */
  created_at?: string;
  /** Update timestamp */
  updated_at?: string;
}

// Create Prescription Request - matches Go CreatePrescriptionRequest struct
export interface CreatePrescriptionRequest {
  /** Patient ID */
  patient_id: string;
  /** Pharmacy ID */
  pharmacy_id?: string;
  /** Medication name */
  medication_name: string;
  /** Generic name */
  generic_name?: string;
  /** Strength */
  strength?: string;
  /** Dosage form */
  dosage_form?: string;
  /** Quantity */
  quantity: number;
  /** Days supply */
  days_supply?: number;
  /** Directions for use */
  directions_for_use: string;
  /** Frequency */
  frequency?: string;
  /** Prescription type */
  prescription_type: PrescriptionType;
  /** Refills authorized */
  refills_authorized: number;
  /** Expiry date */
  expiry_date?: string;
  /** Is controlled substance */
  is_controlled_substance: boolean;
  /** Schedule class */
  schedule_class?: string;
  /** Indication */
  indication?: string;
  /** Notes */
  notes?: string;
}

// Update Prescription Request - matches Go UpdatePrescriptionRequest struct
export interface UpdatePrescriptionRequest {
  /** Pharmacy ID */
  pharmacy_id?: string;
  /** Medication name */
  medication_name?: string;
  /** Generic name */
  generic_name?: string;
  /** Strength */
  strength?: string;
  /** Dosage form */
  dosage_form?: string;
  /** Quantity */
  quantity?: number;
  /** Days supply */
  days_supply?: number;
  /** Directions for use */
  directions_for_use?: string;
  /** Frequency */
  frequency?: string;
  /** Status */
  status?: PrescriptionStatus;
  /** Refills authorized */
  refills_authorized?: number;
  /** Expiry date */
  expiry_date?: string;
  /** Is controlled substance */
  is_controlled_substance?: boolean;
  /** Schedule class */
  schedule_class?: string;
  /** Indication */
  indication?: string;
  /** Notes */
  notes?: string;
}

// Create Fulfillment Request - matches Go CreateFulfillmentRequest struct
export interface CreateFulfillmentRequest {
  /** Prescription ID */
  prescription_id: string;
  /** Pharmacy ID */
  pharmacy_id: string;
  /** Filled quantity */
  filled_quantity: number;
  /** Unit price */
  unit_price?: number;
  /** Total price */
  total_price?: number;
  /** Insurance covered */
  insurance_covered?: number;
  /** Patient copay */
  patient_copay?: number;
  /** Dispensed medication name */
  dispensed_medication_name?: string;
  /** Dispensed generic name */
  dispensed_generic_name?: string;
  /** Lot number */
  lot_number?: string;
  /** Expiry date */
  expiry_date?: string;
  /** Manufacturer */
  manufacturer?: string;
  /** Dispensed by pharmacist ID */
  dispensed_by_pharmacist_id?: string;
  /** Pharmacist license number */
  pharmacist_license_number?: string;
  /** Pickup date */
  pickup_date?: string;
}

// Prescription with details - matches Go PrescriptionWithDetails struct
export interface PrescriptionWithDetails extends Prescription {
  /** Patient name */
  patient_name?: string;
  /** Practitioner name */
  practitioner_name?: string;
  /** Pharmacy name */
  pharmacy_name?: string;
  /** Fulfillments */
  fulfillments?: PrescriptionFulfillment[];
}

// Prescription Filter - matches Go PrescriptionFilter struct
export interface PrescriptionFilter {
  /** Patient ID */
  patient_id?: string;
  /** Practitioner ID */
  practitioner_id?: string;
  /** Pharmacy ID */
  pharmacy_id?: string;
  /** Status */
  status?: PrescriptionStatus;
  /** Medication name */
  medication_name?: string;
  /** Date from */
  date_from?: string;
  /** Date to */
  date_to?: string;
}

// Prescription list response
export interface PrescriptionListResponse {
  /** Prescriptions */
  prescriptions: PrescriptionWithDetails[];
  /** Total count */
  total_count: number;
  /** Limit */
  limit: number;
  /** Offset */
  offset: number;
}

// Query parameters for getting prescriptions
export interface PrescriptionQueryParams extends PrescriptionFilter {
  /** Limit */
  limit?: number;
  /** Offset */
  offset?: number;
}
