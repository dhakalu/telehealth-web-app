// Prescription types based on Go models

export type PrescriptionStatus = 
  | "pending"
  | "sent"
  | "filled"
  | "cancelled"
  | "rejected"
  | "expired";

export type PrescriptionType = 
  | "new"
  | "refill"
  | "renewal"
  | "substitution";

export interface Prescription {
  id: string;
  prescription_number: string;
  patient_id: string;
  practitioner_id: string;
  pharmacy_id?: string;
  medication_name: string;
  generic_name?: string;
  strength?: string;
  dosage_form?: string;
  quantity: number;
  days_supply?: number;
  directions_for_use: string;
  frequency?: string;
  prescription_type: PrescriptionType;
  status: PrescriptionStatus;
  refills_authorized: number;
  refills_remaining: number;
  prescribed_date: string;
  expiry_date?: string;
  last_filled_date?: string;
  dea_number?: string;
  is_controlled_substance: boolean;
  schedule_class?: string;
  indication?: string;
  notes?: string;
  electronic_signature?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface PrescriptionFulfillment {
  id: string;
  prescription_id: string;
  pharmacy_id: string;
  filled_quantity: number;
  unit_price?: number;
  total_price?: number;
  insurance_covered?: number;
  patient_copay?: number;
  dispensed_medication_name?: string;
  dispensed_generic_name?: string;
  lot_number?: string;
  expiry_date?: string;
  manufacturer?: string;
  dispensed_by_pharmacist_id?: string;
  pharmacist_license_number?: string;
  filled_date: string;
  pickup_date?: string;
  created_at: string;
}

export interface DrugDatabase {
  id: string;
  generic_name: string;
  brand_names: string[];
  strength_options: string[];
  dosage_forms: string[];
  is_controlled_substance: boolean;
  schedule_class?: string;
  typical_dosage_range?: string;
  contraindications?: string;
  drug_interactions: string[];
  side_effects: string[];
  created_at: string;
  updated_at: string;
}

export interface CreatePrescriptionRequest {
  patient_id: string;
  pharmacy_id?: string;
  medication_name: string;
  generic_name?: string;
  strength?: string;
  dosage_form?: string;
  quantity: number;
  days_supply?: number;
  directions_for_use: string;
  frequency?: string;
  prescription_type: PrescriptionType;
  refills_authorized: number;
  expiry_date?: string;
  is_controlled_substance: boolean;
  schedule_class?: string;
  indication?: string;
  notes?: string;
}

export interface UpdatePrescriptionRequest {
  pharmacy_id?: string;
  medication_name?: string;
  generic_name?: string;
  strength?: string;
  dosage_form?: string;
  quantity?: number;
  days_supply?: number;
  directions_for_use?: string;
  frequency?: string;
  status?: PrescriptionStatus;
  refills_authorized?: number;
  expiry_date?: string;
  is_controlled_substance?: boolean;
  schedule_class?: string;
  indication?: string;
  notes?: string;
}

export interface CreateFulfillmentRequest {
  prescription_id: string;
  pharmacy_id: string;
  filled_quantity: number;
  unit_price?: number;
  total_price?: number;
  insurance_covered?: number;
  patient_copay?: number;
  dispensed_medication_name?: string;
  dispensed_generic_name?: string;
  lot_number?: string;
  expiry_date?: string;
  manufacturer?: string;
  dispensed_by_pharmacist_id?: string;
  pharmacist_license_number?: string;
  pickup_date?: string;
}

export interface PrescriptionWithDetails extends Prescription {
  patient_name?: string;
  practitioner_name?: string;
  pharmacy_name?: string;
  fulfillments?: PrescriptionFulfillment[];
}

export interface PrescriptionFilter {
  patient_id?: string;
  practitioner_id?: string;
  pharmacy_id?: string;
  status?: PrescriptionStatus;
  medication_name?: string;
  date_from?: string;
  date_to?: string;
}
