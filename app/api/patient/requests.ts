/**
 * Patient API Client
 * 
 * This module provides a comprehensive API client for patient-related operations.
 * It includes functions for managing patient data and all related health information.
 * 
 * Features:
 * - Full TypeScript support with proper types
 * - Axios-based HTTP client
 * - Utility functions for common operations
 * - Support for all patient endpoints
 * 
 * @example
 * ```typescript
 * import { patientApi } from '~/api/patient';
 * 
 * // Get patient data
 * const patient = await patientApi.getPatient('patient-123');
 * 
 * // Add medication
 * const medication = await patientApi.addMedication('patient-123', {
 *   name: 'Aspirin',
 *   dosage: '81mg',
 *   frequency: 'daily'
 * });
 * 
 * // Get health conditions
 * const conditions = await patientApi.getHealthConditions('patient-123');
 * ```
 */

import axios, { AxiosResponse } from 'axios';
import { API_BASE_URL } from "~/api";
import type {
    Address,
    Allergy,
    CreateAllergyData,
    CreateFamilyHealthConditionData,
    CreateHealthConditionData,
    CreateImmunizationData,
    CreateMedicationData,
    CreatePersonalHealthConditionData,
    CreateProcedureData,
    CreateResultData,
    CreateVitalData,
    FamilyHealthCondition,
    HealthCondition,
    Immunization,
    Medication,
    Patient,
    PersonalHealthCondition,
    PractitionerSummary,
    Procedure,
    Result,
    Vital,
} from './types';

/**
 * Patient API operations
 */
export const patientApi = {
    /**
     * Create a new patient
     * POST /patient
     */
    async createPatient(patientData: Patient): Promise<Patient> {
        try {
            const response: AxiosResponse<Patient> = await axios.post(
                `${API_BASE_URL}/patient`,
                patientData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error creating patient:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to create patient'
            );
        }
    },

    /**
     * Get patient by ID
     * GET /patient/{id}
     */
    async getPatient(patientId: string): Promise<Patient> {
        try {
            if (!patientId) {
                throw new Error('Patient ID is required');
            }

            const response: AxiosResponse<Patient> = await axios.get(
                `${API_BASE_URL}/patient/${encodeURIComponent(patientId)}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching patient:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to fetch patient'
            );
        }
    },

    /**
     * Add medication for a patient
     * POST /patient/{id}/medication
     */
    async addMedication(patientId: string, medicationData: CreateMedicationData): Promise<Medication> {
        try {
            if (!patientId) {
                throw new Error('Patient ID is required');
            }

            const response: AxiosResponse<Medication> = await axios.post(
                `${API_BASE_URL}/patient/${encodeURIComponent(patientId)}/medication`,
                medicationData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error adding medication:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to add medication'
            );
        }
    },

    /**
     * Get medications for a patient
     * GET /patient/{id}/medication
     */
    async getMedications(patientId: string): Promise<Medication[]> {
        try {
            if (!patientId) {
                throw new Error('Patient ID is required');
            }

            const response: AxiosResponse<Medication[]> = await axios.get(
                `${API_BASE_URL}/patient/${encodeURIComponent(patientId)}/medication`
            );
            return response.data || [];
        } catch (error) {
            console.error('Error fetching medications:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to fetch medications'
            );
        }
    },

    /**
     * Add health condition for a patient
     * POST /patient/{id}/health_condition
     */
    async addHealthCondition(patientId: string, conditionData: CreateHealthConditionData): Promise<HealthCondition> {
        try {
            if (!patientId) {
                throw new Error('Patient ID is required');
            }

            const response: AxiosResponse<HealthCondition> = await axios.post(
                `${API_BASE_URL}/patient/${encodeURIComponent(patientId)}/health_condition`,
                conditionData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error adding health condition:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to add health condition'
            );
        }
    },

    /**
     * Get health conditions for a patient
     * GET /patient/{id}/health_condition
     */
    async getHealthConditions(patientId: string): Promise<HealthCondition[]> {
        try {
            if (!patientId) {
                throw new Error('Patient ID is required');
            }

            const response: AxiosResponse<HealthCondition[]> = await axios.get(
                `${API_BASE_URL}/patient/${encodeURIComponent(patientId)}/health-condition`
            );
            return response.data || [];
        } catch (error) {
            console.error('Error fetching health conditions:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to fetch health conditions'
            );
        }
    },

    /**
     * Add immunization for a patient
     * POST /patient/{id}/immunization
     */
    async addImmunization(patientId: string, immunizationData: CreateImmunizationData): Promise<Immunization> {
        try {
            if (!patientId) {
                throw new Error('Patient ID is required');
            }

            const response: AxiosResponse<Immunization> = await axios.post(
                `${API_BASE_URL}/patient/${encodeURIComponent(patientId)}/immunization`,
                immunizationData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error adding immunization:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to add immunization'
            );
        }
    },

    /**
     * Get immunizations for a patient
     * GET /patient/{id}/immunization
     */
    async getImmunizations(patientId: string): Promise<Immunization[]> {
        try {
            if (!patientId) {
                throw new Error('Patient ID is required');
            }

            const response: AxiosResponse<Immunization[]> = await axios.get(
                `${API_BASE_URL}/patient/${encodeURIComponent(patientId)}/immunization`
            );
            return response.data || [];
        } catch (error) {
            console.error('Error fetching immunizations:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to fetch immunizations'
            );
        }
    },

    /**
     * Add vital signs for a patient
     * POST /patient/{id}/vital
     */
    async addVital(patientId: string, vitalData: CreateVitalData): Promise<Vital> {
        try {
            if (!patientId) {
                throw new Error('Patient ID is required');
            }

            const response: AxiosResponse<Vital> = await axios.post(
                `${API_BASE_URL}/patient/${encodeURIComponent(patientId)}/vital`,
                vitalData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error adding vital:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to add vital'
            );
        }
    },

    /**
     * Get vitals for a patient
     * GET /patient/{id}/vital
     */
    async getVitals(patientId: string): Promise<Vital[]> {
        try {
            if (!patientId) {
                throw new Error('Patient ID is required');
            }

            const response: AxiosResponse<Vital[]> = await axios.get(
                `${API_BASE_URL}/patient/${encodeURIComponent(patientId)}/vital`
            );
            return response.data || [];
        } catch (error) {
            console.error('Error fetching vitals:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to fetch vitals'
            );
        }
    },

    /**
     * Add personal health condition for a patient
     * POST /patient/{id}/personal_health_condition
     */
    async addPersonalHealthCondition(patientId: string, conditionData: CreatePersonalHealthConditionData): Promise<PersonalHealthCondition> {
        try {
            if (!patientId) {
                throw new Error('Patient ID is required');
            }

            const response: AxiosResponse<PersonalHealthCondition> = await axios.post(
                `${API_BASE_URL}/patient/${encodeURIComponent(patientId)}/personal_health_condition`,
                conditionData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error adding personal health condition:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to add personal health condition'
            );
        }
    },

    /**
     * Get personal health conditions for a patient
     * GET /patient/{id}/personal_health_condition
     */
    async getPersonalHealthConditions(patientId: string): Promise<PersonalHealthCondition[]> {
        try {
            if (!patientId) {
                throw new Error('Patient ID is required');
            }

            const response: AxiosResponse<PersonalHealthCondition[]> = await axios.get(
                `${API_BASE_URL}/patient/${encodeURIComponent(patientId)}/personal_health_condition`
            );
            return response.data || [];
        } catch (error) {
            console.error('Error fetching personal health conditions:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to fetch personal health conditions'
            );
        }
    },

    /**
     * Add family health condition for a patient
     * POST /patient/{id}/family_health_condition
     */
    async addFamilyHealthCondition(patientId: string, conditionData: CreateFamilyHealthConditionData): Promise<FamilyHealthCondition> {
        try {
            if (!patientId) {
                throw new Error('Patient ID is required');
            }

            const response: AxiosResponse<FamilyHealthCondition> = await axios.post(
                `${API_BASE_URL}/patient/${encodeURIComponent(patientId)}/family_health_condition`,
                conditionData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error adding family health condition:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to add family health condition'
            );
        }
    },

    /**
     * Get family health conditions for a patient
     * GET /patient/{id}/family_health_condition
     */
    async getFamilyHealthConditions(patientId: string): Promise<FamilyHealthCondition[]> {
        try {
            if (!patientId) {
                throw new Error('Patient ID is required');
            }

            const response: AxiosResponse<FamilyHealthCondition[]> = await axios.get(
                `${API_BASE_URL}/patient/${encodeURIComponent(patientId)}/family_health_condition`
            );
            return response.data || [];
        } catch (error) {
            console.error('Error fetching family health conditions:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to fetch family health conditions'
            );
        }
    },

    /**
     * Add procedure for a patient
     * POST /patient/{id}/procedure
     */
    async addProcedure(patientId: string, procedureData: CreateProcedureData): Promise<Procedure> {
        try {
            if (!patientId) {
                throw new Error('Patient ID is required');
            }

            const response: AxiosResponse<Procedure> = await axios.post(
                `${API_BASE_URL}/patient/${encodeURIComponent(patientId)}/procedure`,
                procedureData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error adding procedure:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to add procedure'
            );
        }
    },

    /**
     * Get procedures for a patient
     * GET /patient/{id}/procedure
     */
    async getProcedures(patientId: string): Promise<Procedure[]> {
        try {
            if (!patientId) {
                throw new Error('Patient ID is required');
            }

            const response: AxiosResponse<Procedure[]> = await axios.get(
                `${API_BASE_URL}/patient/${encodeURIComponent(patientId)}/procedure`
            );
            return response.data || [];
        } catch (error) {
            console.error('Error fetching procedures:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to fetch procedures'
            );
        }
    },

    /**
     * Add allergy for a patient
     * POST /patient/{id}/allergy
     */
    async addAllergy(patientId: string, allergyData: CreateAllergyData): Promise<Allergy> {
        try {
            if (!patientId) {
                throw new Error('Patient ID is required');
            }

            const response: AxiosResponse<Allergy> = await axios.post(
                `${API_BASE_URL}/patient/${encodeURIComponent(patientId)}/allergy`,
                allergyData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error adding allergy:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to add allergy'
            );
        }
    },

    /**
     * Get allergies for a patient
     * GET /patient/{id}/allergy
     */
    async getAllergies(patientId: string): Promise<Allergy[]> {
        try {
            if (!patientId) {
                throw new Error('Patient ID is required');
            }

            const response: AxiosResponse<Allergy[]> = await axios.get(
                `${API_BASE_URL}/patient/${encodeURIComponent(patientId)}/allergy`
            );
            return response.data || [];
        } catch (error) {
            console.error('Error fetching allergies:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to fetch allergies'
            );
        }
    },

    /**
     * Add result for a patient
     * POST /patient/{id}/result
     */
    async addResult(patientId: string, resultData: CreateResultData): Promise<Result> {
        try {
            if (!patientId) {
                throw new Error('Patient ID is required');
            }

            const response: AxiosResponse<Result> = await axios.post(
                `${API_BASE_URL}/patient/${encodeURIComponent(patientId)}/result`,
                resultData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error adding result:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to add result'
            );
        }
    },

    /**
     * Get results for a patient
     * GET /patient/{id}/result
     */
    async getResults(patientId: string): Promise<Result[]> {
        try {
            if (!patientId) {
                throw new Error('Patient ID is required');
            }

            const response: AxiosResponse<Result[]> = await axios.get(
                `${API_BASE_URL}/patient/${encodeURIComponent(patientId)}/result`
            );
            return response.data || [];
        } catch (error) {
            console.error('Error fetching results:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to fetch results'
            );
        }
    },

    /**
     * Get practitioners visited by patient
     * GET /patient/{id}/practitioner_summary
     */
    async getPractitionersVisited(patientId: string): Promise<PractitionerSummary[]> {
        try {
            if (!patientId) {
                throw new Error('Patient ID is required');
            }

            const response: AxiosResponse<PractitionerSummary[]> = await axios.get(
                `${API_BASE_URL}/patient/${encodeURIComponent(patientId)}/practitioner_summary`
            );
            return response.data || [];
        } catch (error) {
            console.error('Error fetching practitioners visited:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to fetch practitioners visited'
            );
        }
    },
};

/**
 * Utility functions for patient operations
 */
export const patientUtils = {
    /**
     * Format patient name for display
     */
    formatPatientName(patient: Patient): string {
        if (!patient.name || patient.name.length === 0) return 'Unknown Patient';

        const primaryName = patient.name.find(n => n.use === 'official') || patient.name[0];
        const givenNames = primaryName.given?.join(' ') || '';
        const familyName = primaryName.family || '';

        return `${givenNames} ${familyName}`.trim() || 'Unknown Patient';
    },

    /**
     * Get primary contact information
     */
    getPrimaryContact(patient: Patient, system: 'phone' | 'email'): string | null {
        if (!patient.telecom || patient.telecom.length === 0) return null;

        const contact = patient.telecom.find(t => t.system === system && t.use === 'home') ||
            patient.telecom.find(t => t.system === system);

        return contact?.value || null;
    },

    /**
     * Get primary address
     */
    getPrimaryAddress(patient: Patient): Address | null {
        if (!patient.address || patient.address.length === 0) return null;

        return patient.address.find(a => a.use === 'home') || patient.address[0];
    },

    /**
     * Format address for display
     */
    formatAddress(address: Address): string {
        if (!address) return '';

        const parts = [
            address.line?.join(', '),
            address.city,
            address.state,
            address.postalCode,
            address.country
        ].filter(Boolean);

        return parts.join(', ');
    },

    /**
     * Calculate age from birth date
     */
    calculateAge(birthDate: string): number | null {
        if (!birthDate) return null;

        try {
            const birth = new Date(birthDate);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                age--;
            }

            return age;
        } catch {
            return null;
        }
    },

    /**
     * Format date for display
     */
    formatDate(dateString: string): string {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        } catch {
            return dateString;
        }
    },

    /**
     * Get medication status color class
     */
    getMedicationStatusColor(status: string): string {
        switch (status.toLowerCase()) {
            case 'active':
                return 'text-green-600';
            case 'inactive':
                return 'text-gray-600';
            case 'completed':
                return 'text-blue-600';
            case 'discontinued':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    },

    /**
     * Get allergy severity color class
     */
    getAllergySeverityColor(severity: string): string {
        switch (severity.toLowerCase()) {
            case 'mild':
                return 'text-yellow-600';
            case 'moderate':
                return 'text-orange-600';
            case 'severe':
                return 'text-red-600';
            case 'life-threatening':
                return 'text-red-800';
            default:
                return 'text-gray-600';
        }
    },

    /**
     * Get condition status color class
     */
    getConditionStatusColor(status: string): string {
        switch (status.toLowerCase()) {
            case 'active':
                return 'text-red-600';
            case 'resolved':
                return 'text-green-600';
            case 'inactive':
                return 'text-gray-600';
            case 'remission':
                return 'text-blue-600';
            case 'recurrence':
                return 'text-orange-600';
            default:
                return 'text-gray-600';
        }
    },

    /**
     * Group medications by status
     */
    groupMedicationsByStatus(medications: Medication[]): Record<string, Medication[]> {
        return medications.reduce((groups, med) => {
            const status = med.status || 'unknown';
            if (!groups[status]) {
                groups[status] = [];
            }
            groups[status].push(med);
            return groups;
        }, {} as Record<string, Medication[]>);
    },

    /**
     * Group health conditions by status
     */
    groupHealthConditionsByStatus(conditions: HealthCondition[]): Record<string, HealthCondition[]> {
        return conditions.reduce((groups, condition) => {
            const status = condition.status || 'unknown';
            if (!groups[status]) {
                groups[status] = [];
            }
            groups[status].push(condition);
            return groups;
        }, {} as Record<string, HealthCondition[]>);
    },

    /**
     * Sort health conditions by diagnosis date
     */
    sortConditionsByDate(conditions: HealthCondition[]): HealthCondition[] {
        return [...conditions].sort((a, b) => {
            const dateA = new Date(a.diagnosed_on || 0);
            const dateB = new Date(b.diagnosed_on || 0);
            return dateB.getTime() - dateA.getTime();
        });
    },

    /**
     * Filter active items (not deleted)
     */
    filterActive<T extends { deleted_at?: string }>(items: T[]): T[] {
        return items.filter(item => !item.deleted_at);
    },

    /**
     * Sort immunizations by administration date
     */
    sortImmunizationsByDate(immunizations: Immunization[]): Immunization[] {
        return [...immunizations].sort((a, b) => {
            const dateA = new Date(a.date_administered || 0);
            const dateB = new Date(b.date_administered || 0);
            return dateB.getTime() - dateA.getTime();
        });
    },

    /**
     * Group immunizations by year
     */
    groupImmunizationsByYear(immunizations: Immunization[]): Record<string, Immunization[]> {
        return immunizations.reduce((groups, immunization) => {
            const year = immunization.date_administered
                ? new Date(immunization.date_administered).getFullYear().toString()
                : 'Unknown';
            if (!groups[year]) {
                groups[year] = [];
            }
            groups[year].push(immunization);
            return groups;
        }, {} as Record<string, Immunization[]>);
    },

    /**
     * Sort procedures by date
     */
    sortProceduresByDate(procedures: Procedure[]): Procedure[] {
        return [...procedures].sort((a, b) => {
            const dateA = new Date(a.performed_on || 0);
            const dateB = new Date(b.performed_on || 0);
            return dateB.getTime() - dateA.getTime();
        });
    },

    /**
     * Group procedures by outcome
     */
    groupProceduresByOutcome(procedures: Procedure[]): Record<string, Procedure[]> {
        return procedures.reduce((groups, procedure) => {
            const outcome = procedure.outcome || 'unknown';
            if (!groups[outcome]) {
                groups[outcome] = [];
            }
            groups[outcome].push(procedure);
            return groups;
        }, {} as Record<string, Procedure[]>);
    },

    /**
     * Get procedure outcome color class
     */
    getProcedureOutcomeColor(outcome: string): string {
        switch (outcome.toLowerCase()) {
            case 'successful':
            case 'completed':
                return 'text-green-600';
            case 'partial':
                return 'text-yellow-600';
            case 'unsuccessful':
            case 'failed':
                return 'text-red-600';
            case 'cancelled':
                return 'text-gray-600';
            case 'pending':
                return 'text-blue-600';
            default:
                return 'text-gray-600';
        }
    },

    /**
     * Sort allergies by severity (most severe first)
     */
    sortAllergiesBySeverity(allergies: Allergy[]): Allergy[] {
        const severityOrder = { 'life-threatening': 4, 'severe': 3, 'moderate': 2, 'mild': 1 };
        return [...allergies].sort((a, b) => {
            const severityA = severityOrder[a.severity as keyof typeof severityOrder] || 0;
            const severityB = severityOrder[b.severity as keyof typeof severityOrder] || 0;
            return severityB - severityA;
        });
    },

    /**
     * Group allergies by severity
     */
    groupAllergiesBySeverity(allergies: Allergy[]): Record<string, Allergy[]> {
        return allergies.reduce((groups, allergy) => {
            const severity = allergy.severity || 'unknown';
            if (!groups[severity]) {
                groups[severity] = [];
            }
            groups[severity].push(allergy);
            return groups;
        }, {} as Record<string, Allergy[]>);
    },

    /**
     * Get allergy status color class
     */
    getAllergyStatusColor(status: string): string {
        switch (status.toLowerCase()) {
            case 'active':
                return 'text-red-600';
            case 'resolved':
                return 'text-green-600';
            case 'inactive':
                return 'text-gray-600';
            case 'suspected':
                return 'text-yellow-600';
            default:
                return 'text-gray-600';
        }
    },
};

/**
 * Patient API hooks for React components
 * These can be used with React Query or SWR for better data management
 */
export const patientQueries = {
    /**
     * Query key factory for patient-related queries
     */
    keys: {
        all: ['patients'] as const,
        patient: (patientId: string) => [...patientQueries.keys.all, 'patient', patientId] as const,
        medications: (patientId: string) => [...patientQueries.keys.all, 'medications', patientId] as const,
        healthConditions: (patientId: string) => [...patientQueries.keys.all, 'health-conditions', patientId] as const,
        immunizations: (patientId: string) => [...patientQueries.keys.all, 'immunizations', patientId] as const,
        vitals: (patientId: string) => [...patientQueries.keys.all, 'vitals', patientId] as const,
        personalHealthConditions: (patientId: string) => [...patientQueries.keys.all, 'personal-health-conditions', patientId] as const,
        familyHealthConditions: (patientId: string) => [...patientQueries.keys.all, 'family-health-conditions', patientId] as const,
        procedures: (patientId: string) => [...patientQueries.keys.all, 'procedures', patientId] as const,
        allergies: (patientId: string) => [...patientQueries.keys.all, 'allergies', patientId] as const,
        results: (patientId: string) => [...patientQueries.keys.all, 'results', patientId] as const,
        practitioners: (patientId: string) => [...patientQueries.keys.all, 'practitioners', patientId] as const,
    },

    /**
     * Query functions for fetching patient data
     */
    fetchPatient: (patientId: string) => patientApi.getPatient(patientId),
    fetchMedications: (patientId: string) => patientApi.getMedications(patientId),
    fetchHealthConditions: (patientId: string) => patientApi.getHealthConditions(patientId),
    fetchImmunizations: (patientId: string) => patientApi.getImmunizations(patientId),
    fetchVitals: (patientId: string) => patientApi.getVitals(patientId),
    fetchPersonalHealthConditions: (patientId: string) => patientApi.getPersonalHealthConditions(patientId),
    fetchFamilyHealthConditions: (patientId: string) => patientApi.getFamilyHealthConditions(patientId),
    fetchProcedures: (patientId: string) => patientApi.getProcedures(patientId),
    fetchAllergies: (patientId: string) => patientApi.getAllergies(patientId),
    fetchResults: (patientId: string) => patientApi.getResults(patientId),
    fetchPractitioners: (patientId: string) => patientApi.getPractitionersVisited(patientId),
};

export default patientApi;
