/**
 * Prescription API Client
 * 
 * This module provides a comprehensive API client for prescription-related operations.
 * It includes functions for managing prescriptions, fulfillments, and drug database operations.
 * 
 * Features:
 * - Full TypeScript support with proper types
 * - Axios-based HTTP client
 * - Support for all prescription endpoints from handler.go
 * - Error handling and validation
 * 
 * @example
 * ```typescript
 * import { prescriptionApi } from '~/api/prescription';
 * 
 * // Create a prescription
 * const prescription = await prescriptionApi.createPrescription({
 *   patient_id: 'patient-123',
 *   medication_name: 'Aspirin',
 *   quantity: 30,
 *   directions_for_use: 'Take 1 tablet daily',
 *   prescription_type: 'new',
 *   refills_authorized: 2,
 *   is_controlled_substance: false
 * });
 * 
 * // Get prescriptions for a patient
 * const prescriptions = await prescriptionApi.getPrescriptions({
 *   patient_id: 'patient-123',
 *   limit: 10,
 *   offset: 0
 * });
 * 
 * // Search drugs
 * const drugs = await prescriptionApi.searchDrugs('aspirin');
 * ```
 */

import axios, { AxiosResponse } from 'axios';
import { API_BASE_URL } from "~/api";
import type {
    CreateFulfillmentRequest,
    CreatePrescriptionRequest,
    DrugDatabase,
    Prescription,
    PrescriptionFulfillment,
    PrescriptionListResponse,
    PrescriptionQueryParams,
    UpdatePrescriptionRequest,
} from './types';

/**
 * Prescription API operations based on handler.go definitions
 */
export const prescriptionApi = {
    /**
     * Create a new prescription
     * POST /prescriptions
     */
    async createPrescription(practitionerId: string, prescriptionData: CreatePrescriptionRequest): Promise<Prescription> {
        try {
            const response: AxiosResponse<Prescription> = await axios.post(
                `${API_BASE_URL}/prescriptions`,
                prescriptionData,
                {
                    headers: {
                        'X-Practitioner-ID': practitionerId, // Include practitioner ID in headers
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error creating prescription:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to create prescription'
            );
        }
    },

    /**
     * Get prescription by ID
     * GET /prescriptions/{id}
     */
    async getPrescription(prescriptionId: string): Promise<Prescription> {
        try {
            if (!prescriptionId) {
                throw new Error('Prescription ID is required');
            }

            const response: AxiosResponse<Prescription> = await axios.get(
                `${API_BASE_URL}/prescriptions/${encodeURIComponent(prescriptionId)}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching prescription:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to fetch prescription'
            );
        }
    },

    /**
     * Get prescription by prescription number
     * GET /prescriptions/number/{number}
     */
    async getPrescriptionByNumber(prescriptionNumber: string): Promise<Prescription> {
        try {
            if (!prescriptionNumber) {
                throw new Error('Prescription number is required');
            }

            const response: AxiosResponse<Prescription> = await axios.get(
                `${API_BASE_URL}/prescriptions/number/${encodeURIComponent(prescriptionNumber)}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching prescription by number:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to fetch prescription by number'
            );
        }
    },

    /**
     * Get prescriptions with optional filtering and pagination
     * GET /prescriptions
     */
    async getPrescriptions(params?: PrescriptionQueryParams): Promise<PrescriptionListResponse> {
        try {
            const queryParams = new URLSearchParams();

            if (params?.patient_id) {
                queryParams.append('patient_id', params.patient_id);
            }
            if (params?.practitioner_id) {
                queryParams.append('practitioner_id', params.practitioner_id);
            }
            if (params?.pharmacy_id) {
                queryParams.append('pharmacy_id', params.pharmacy_id);
            }
            if (params?.status) {
                queryParams.append('status', params.status);
            }
            if (params?.medication_name) {
                queryParams.append('medication_name', params.medication_name);
            }
            if (params?.date_from) {
                queryParams.append('date_from', params.date_from);
            }
            if (params?.date_to) {
                queryParams.append('date_to', params.date_to);
            }
            if (params?.limit !== undefined) {
                queryParams.append('limit', params.limit.toString());
            }
            if (params?.offset !== undefined) {
                queryParams.append('offset', params.offset.toString());
            }

            const url = `${API_BASE_URL}/prescriptions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
            const response: AxiosResponse<PrescriptionListResponse> = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to fetch prescriptions'
            );
        }
    },

    /**
     * Update a prescription
     * PUT /prescriptions/{id}
     */
    async updatePrescription(prescriptionId: string, updates: UpdatePrescriptionRequest, practitionerId: string): Promise<Prescription> {
        try {
            if (!prescriptionId) {
                throw new Error('Prescription ID is required');
            }

            const response: AxiosResponse<Prescription> = await axios.put(
                `${API_BASE_URL}/prescriptions/${encodeURIComponent(prescriptionId)}`,
                updates,
                {
                    headers: {
                        'X-Practitioner-ID': practitionerId, // Include practitioner ID in headers
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating prescription:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to update prescription'
            );
        }
    },

    /**
     * Cancel a prescription
     * DELETE /prescriptions/{id}
     */
    async cancelPrescription(prescriptionId: string, practitionerId: string): Promise<void> {
        try {
            if (!prescriptionId) {
                throw new Error('Prescription ID is required');
            }

            await axios.delete(
                `${API_BASE_URL}/prescriptions/${encodeURIComponent(prescriptionId)}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-Practitioner-ID": practitionerId,
                    },
                }
            );
        } catch (error) {
            console.error('Error cancelling prescription:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to cancel prescription'
            );
        }
    },

    /**
     * Fill a prescription (create fulfillment)
     * POST /prescriptions/{id}/fulfillments
     */
    async fillPrescription(fulfillmentData: CreateFulfillmentRequest): Promise<PrescriptionFulfillment> {
        try {
            const response: AxiosResponse<PrescriptionFulfillment> = await axios.post(
                `${API_BASE_URL}/prescriptions/${encodeURIComponent(fulfillmentData.prescription_id)}/fulfillments`,
                fulfillmentData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error filling prescription:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to fill prescription'
            );
        }
    },

    /**
     * Get fulfillments for a prescription
     * GET /prescriptions/{id}/fulfillments
     */
    async getPrescriptionFulfillments(prescriptionId: string): Promise<PrescriptionFulfillment[]> {
        try {
            if (!prescriptionId) {
                throw new Error('Prescription ID is required');
            }

            const response: AxiosResponse<PrescriptionFulfillment[]> = await axios.get(
                `${API_BASE_URL}/prescriptions/${encodeURIComponent(prescriptionId)}/fulfillments`
            );
            return response.data || [];
        } catch (error) {
            console.error('Error fetching prescription fulfillments:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to fetch prescription fulfillments'
            );
        }
    },

    /**
     * Search drugs in the database
     * GET /drugs/search?q={query}
     */
    async searchDrugs(query: string): Promise<DrugDatabase[]> {
        try {
            if (!query || query.trim() === '') {
                throw new Error('Search query is required');
            }

            const response: AxiosResponse<DrugDatabase[]> = await axios.get(
                `${API_BASE_URL}/drugs/search?q=${encodeURIComponent(query.trim())}`
            );
            return response.data || [];
        } catch (error) {
            console.error('Error searching drugs:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to search drugs'
            );
        }
    },

    /**
     * Get drug information by generic name
     * GET /drugs/{genericName}
     */
    async getDrugInfo(genericName: string): Promise<DrugDatabase> {
        try {
            if (!genericName) {
                throw new Error('Generic name is required');
            }

            const response: AxiosResponse<DrugDatabase> = await axios.get(
                `${API_BASE_URL}/drugs/${encodeURIComponent(genericName)}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching drug info:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to fetch drug information'
            );
        }
    },

    /**
     * Get all drugs in the database
     * GET /drugs
     */
    async getAllDrugs(): Promise<DrugDatabase[]> {
        try {
            const response: AxiosResponse<DrugDatabase[]> = await axios.get(
                `${API_BASE_URL}/drugs`
            );
            return response.data || [];
        } catch (error) {
            console.error('Error fetching all drugs:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : 'Failed to fetch drugs'
            );
        }
    },
};

/**
 * Utility functions for prescription operations
 */
export const prescriptionUtils = {
    /**
     * Check if a prescription is active (not cancelled, expired, or filled)
     */
    isActivePrescription(prescription: Prescription): boolean {
        return !['cancelled', 'expired', 'filled'].includes(prescription.status);
    },

    /**
     * Check if a prescription can be refilled
     */
    canRefill(prescription: Prescription): boolean {
        return prescription.refills_remaining > 0 &&
            prescription.status !== 'cancelled' &&
            prescription.status !== 'expired' &&
            (!prescription.expiry_date || new Date(prescription.expiry_date) > new Date());
    },

    /**
     * Get prescription status color for UI
     */
    getStatusColor(status: string): string {
        const statusColors = {
            pending: 'text-yellow-600',
            sent: 'text-blue-600',
            filled: 'text-green-600',
            cancelled: 'text-red-600',
            rejected: 'text-red-600',
            expired: 'text-gray-600',
        };
        return statusColors[status as keyof typeof statusColors] || 'text-gray-600';
    },

    /**
     * Format prescription type for display
     */
    formatPrescriptionType(type: string): string {
        const typeLabels = {
            new: 'New',
            refill: 'Refill',
            renewal: 'Renewal',
            substitution: 'Substitution',
        };
        return typeLabels[type as keyof typeof typeLabels] || type;
    },

    /**
     * Format date for display
     */
    formatDate(dateString: string): string {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return dateString;
        }
    },

    /**
     * Check if a prescription is expired
     */
    isExpired(prescription: Prescription): boolean {
        if (!prescription.expiry_date) return false;
        return new Date(prescription.expiry_date) < new Date();
    },

    /**
     * Get days until expiry
     */
    getDaysUntilExpiry(prescription: Prescription): number | null {
        if (!prescription.expiry_date) return null;

        const expiryDate = new Date(prescription.expiry_date);
        const today = new Date();
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    },
};

export default prescriptionApi;
