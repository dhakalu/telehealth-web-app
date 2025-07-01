/**
 * Patient API Module
 * 
 * This module exports the patient API client and related utilities.
 * It provides a centralized access point for all patient-related API operations.
 * 
 * @example
 * ```typescript
 * import { patientApi, patientUtils } from '~/api/patient';
 * 
 * // Get patient data
 * const patient = await patientApi.getPatient('patient-123');
 * 
 * // Add medication
 * const medication = await patientApi.addMedication('patient-123', {
 *   name: 'Aspirin',
 *   dosage: '81mg',
 *   frequency: 'daily',
 *   direction: 'Take with food',
 *   prescribed_by: 'Dr. Smith',
 *   status: 'active',
 *   notes: ''
 * });
 * 
 * // Format patient name
 * const displayName = patientUtils.formatPatientName(patient);
 * ```
 */

export { patientApi, patientQueries, patientUtils } from './requests';

export type {
    Address, Allergy, AllergySeverity, ConditionStatus, ContactPoint, CreateAllergyData, CreateFamilyHealthConditionData, CreateHealthConditionData,
    CreateImmunizationData, CreateMedicationData, CreatePersonalHealthConditionData, CreateProcedureData, CreateResultData, CreateVitalData, FamilyHealthCondition, HealthCondition, HumanName, Immunization, Medication, MedicationStatus, Patient, PersonalHealthCondition, PractitionerSummary, Procedure, Result, Vital
} from './types';

export {
    ALLERGY_SEVERITY, CONDITION_STATUS, MEDICATION_STATUS
} from './types';

// Default export for convenience
export { default } from './requests';

