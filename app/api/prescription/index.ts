/**
 * Prescription API Module
 * 
 * This module exports all prescription-related types and API functions.
 */

// Export all types
export type {
  Prescription,
  PrescriptionStatus,
  PrescriptionType,
  PrescriptionFulfillment,
  DrugDatabase,
  CreatePrescriptionRequest,
  UpdatePrescriptionRequest,
  CreateFulfillmentRequest,
  PrescriptionWithDetails,
  PrescriptionFilter,
  PrescriptionListResponse,
  PrescriptionQueryParams,
} from './types';

// Export API functions and utilities
export { prescriptionApi, prescriptionUtils } from './requests';

// Default export
export { default } from './requests';
