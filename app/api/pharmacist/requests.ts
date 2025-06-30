import axios, { AxiosResponse } from "axios";
import { API_BASE_URL } from "~/api";
import {
    CreateOrganizationPharmacistRequest,
    CreatePharmacistRequest,
    OrganizationPharmacist,
    Pharmacist,
    PharmacistFilter,
    PharmacistSearchResponse,
    UpdateOrganizationPharmacistRequest,
    UpdatePharmacistRequest,
} from "~/components/pharmacist/types";

// Base URL for pharmacist endpoints
const PHARMACIST_API_URL = `${API_BASE_URL}/pharmacists`;
const ORGANIZATION_API_URL = `${API_BASE_URL}/organizations`;
const ORG_PHARMACIST_API_URL = `${API_BASE_URL}/organization-pharmacists`;

// Pharmacist CRUD operations

/**
 * Create a new pharmacist
 */
const createPharmacist = async (
    data: CreatePharmacistRequest
): Promise<AxiosResponse<Pharmacist>> => {
    return axios.post<Pharmacist>(`${PHARMACIST_API_URL}`, data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/**
 * Get a pharmacist by ID
 */
const getPharmacistById = async (
    id: string
): Promise<AxiosResponse<Pharmacist>> => {
    return axios.get<Pharmacist>(`${PHARMACIST_API_URL}/${id}`);
};

/**
 * Get a pharmacist by user ID
 */
const getPharmacistByUserId = async (
    userId: string
): Promise<AxiosResponse<Pharmacist>> => {
    return axios.get<Pharmacist>(`${PHARMACIST_API_URL}/user/${userId}`);
};

/**
 * Get a pharmacist by license number
 */
const getPharmacistByLicenseNumber = async (
    licenseNumber: string
): Promise<AxiosResponse<Pharmacist>> => {
    return axios.get<Pharmacist>(`${PHARMACIST_API_URL}/license/${licenseNumber}`);
};

/**
 * Update a pharmacist
 */
const updatePharmacist = async (
    id: string,
    data: UpdatePharmacistRequest
): Promise<AxiosResponse<Pharmacist>> => {
    return axios.put<Pharmacist>(`${PHARMACIST_API_URL}/${id}`, data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
};

/**
 * Delete a pharmacist
 */
const deletePharmacist = async (id: string): Promise<AxiosResponse<void>> => {
    return axios.delete<void>(`${PHARMACIST_API_URL}/${id}`);
};

/**
 * Search pharmacists with filters and pagination
 */
const searchPharmacists = async (
    filter: PharmacistFilter = {},
    limit: number = 20,
    offset: number = 0
): Promise<AxiosResponse<PharmacistSearchResponse>> => {
    const params = new URLSearchParams();

    // Add filter parameters
    if (filter.organization_id) {
        params.append("organization_id", filter.organization_id);
    }
    if (filter.license_state) {
        params.append("license_state", filter.license_state);
    }
    if (filter.position) {
        params.append("position", filter.position);
    }
    if (filter.active !== undefined) {
        params.append("active", filter.active.toString());
    }
    if (filter.verified !== undefined) {
        params.append("verified", filter.verified.toString());
    }
    if (filter.name) {
        params.append("name", filter.name);
    }

    // Add pagination parameters
    params.append("limit", limit.toString());
    params.append("offset", offset.toString());

    return axios.get<PharmacistSearchResponse>(`${PHARMACIST_API_URL}?${params.toString()}`);
};

// Organization-Pharmacist relationship operations

/**
 * Create an organization-pharmacist relationship
 */
const createOrganizationPharmacist = async (
    organizationId: string,
    data: CreateOrganizationPharmacistRequest
): Promise<AxiosResponse<OrganizationPharmacist>> => {
    return axios.post<OrganizationPharmacist>(
        `${ORGANIZATION_API_URL}/${organizationId}/pharmacists`,
        data,
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
};

/**
 * Get all pharmacists for an organization
 */
const getOrganizationPharmacists = async (
    organizationId: string
): Promise<AxiosResponse<OrganizationPharmacist[]>> => {
    return axios.get<OrganizationPharmacist[]>(
        `${ORGANIZATION_API_URL}/${organizationId}/pharmacists`
    );
};

/**
 * Get all organizations for a pharmacist
 */
const getPharmacistOrganizations = async (
    pharmacistId: string
): Promise<AxiosResponse<OrganizationPharmacist[]>> => {
    return axios.get<OrganizationPharmacist[]>(
        `${PHARMACIST_API_URL}/${pharmacistId}/organizations`
    );
};

/**
 * Update an organization-pharmacist relationship
 */
const updateOrganizationPharmacist = async (
    relationshipId: string,
    data: UpdateOrganizationPharmacistRequest
): Promise<AxiosResponse<OrganizationPharmacist>> => {
    return axios.put<OrganizationPharmacist>(
        `${ORG_PHARMACIST_API_URL}/${relationshipId}`,
        data,
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
};

/**
 * Delete an organization-pharmacist relationship
 */
const deleteOrganizationPharmacist = async (
    relationshipId: string
): Promise<AxiosResponse<void>> => {
    return axios.delete<void>(`${ORG_PHARMACIST_API_URL}/${relationshipId}`);
};

// Utility functions for common operations

/**
 * Get active pharmacists for an organization
 */
const getActivePharmacistsForOrganization = async (
    organizationId: string,
    limit: number = 50,
    offset: number = 0
): Promise<AxiosResponse<PharmacistSearchResponse>> => {
    return searchPharmacists(
        {
            organization_id: organizationId,
            active: true,
        },
        limit,
        offset
    );
};

/**
 * Get verified pharmacists by state
 */
const getVerifiedPharmacistsByState = async (
    licenseState: string,
    limit: number = 50,
    offset: number = 0
): Promise<AxiosResponse<PharmacistSearchResponse>> => {
    return searchPharmacists(
        {
            license_state: licenseState,
            verified: true,
            active: true,
        },
        limit,
        offset
    );
};

/**
 * Search pharmacists by name
 */
const searchPharmacistsByName = async (
    name: string,
    limit: number = 20,
    offset: number = 0
): Promise<AxiosResponse<PharmacistSearchResponse>> => {
    return searchPharmacists(
        {
            name: name,
            active: true,
        },
        limit,
        offset
    );
};

/**
 * Get pharmacists by position
 */
const getPharmacistsByPosition = async (
    position: string,
    organizationId?: string,
    limit: number = 50,
    offset: number = 0
): Promise<AxiosResponse<PharmacistSearchResponse>> => {
    const filter: PharmacistFilter = {
        position: position,
        active: true,
    };

    if (organizationId) {
        filter.organization_id = organizationId;
    }

    return searchPharmacists(filter, limit, offset);
};

// Error handling wrapper
const withErrorHandling = async <T>(
    apiCall: () => Promise<AxiosResponse<T>>
): Promise<{ data: T | null; error: string | null }> => {
    try {
        const response = await apiCall();
        return { data: response.data, error: null };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || error.message;
            return { data: null, error: message };
        }
        return { data: null, error: "An unexpected error occurred" };
    }
};

// Default export with all functions grouped
export default {
    // Individual pharmacist operations
    createPharmacist,
    getPharmacistById,
    getPharmacistByUserId,
    getPharmacistByLicenseNumber,
    updatePharmacist,
    deletePharmacist,
    searchPharmacists,

    // Organization-pharmacist relationship operations
    createOrganizationPharmacist,
    getOrganizationPharmacists,
    getPharmacistOrganizations,
    updateOrganizationPharmacist,
    deleteOrganizationPharmacist,

    // Utility functions
    getActivePharmacistsForOrganization,
    getVerifiedPharmacistsByState,
    searchPharmacistsByName,
    getPharmacistsByPosition,
    withErrorHandling,
};

// Named exports
export {
    createOrganizationPharmacist, createPharmacist, deleteOrganizationPharmacist, deletePharmacist, getActivePharmacistsForOrganization, getOrganizationPharmacists, getPharmacistById, getPharmacistByLicenseNumber, getPharmacistByUserId, getPharmacistOrganizations, getPharmacistsByPosition, getVerifiedPharmacistsByState, searchPharmacists, searchPharmacistsByName, updateOrganizationPharmacist, updatePharmacist, withErrorHandling
};

