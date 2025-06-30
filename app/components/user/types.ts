/**
 * User Types and Interfaces
 * 
 * This file contains all TypeScript types and interfaces for user-related data structures.
 * These types correspond to the Go backend user models and DTOs.
 */

// Base User interface - matches Go User struct
export interface User {
    /** Identifier for the End-User at the Issuer */
    sub: string;
    /** End-User's full name */
    name?: string;
    /** End-User's given name(s) */
    given_name?: string;
    /** End-User's surname(s) */
    family_name?: string;
    /** End-User's middle name(s) */
    middle_name?: string;
    /** End-User's email address */
    email?: string;
    /** Account type (e.g., "patient", "provider", "pharmacist", "support") */
    account_type?: string;
    /** Account Status (e.g., "active", "pending", "suspended") */
    status?: string;
    /** Email verification token */
    verification_token?: string;
}

// User Registration - extends User with password for registration
export interface UserRegistration {
    /** User information */
    user: User;
    /** Password for registration (not returned in API responses) */
    password: string;
}

// Login Request
export interface LoginRequest {
    /** User's email address */
    email: string;
    /** User's password */
    password: string;
    /** Account type (e.g., "patient", "provider") */
    account_type: string;
}

// Login Response
export interface LoginResponse {
    /** User information */
    user: User;
    /** Authentication token (if applicable) */
    token?: string;
}

// Status Update Request
export interface UserStatusUpdate {
    /** New status value */
    status: string;
}

// Email Verification Response
export interface EmailVerificationResponse {
    /** Success message */
    message: string;
}

// User Creation Request (for API)
export interface CreateUserRequest {
    /** User registration data */
    user: User;
    /** Password for the new user */
    password: string;
}

// User Update Request
export interface UpdateUserRequest extends Partial<User> {
    /** User ID (sub) - required for updates */
    sub: string;
}

// API Response wrapper for user operations
export interface UserApiResponse<T = User> {
    /** Response data */
    data?: T;
    /** Error message if operation failed */
    error?: string;
    /** Success indicator */
    success?: boolean;
}

// List Users Response
export interface ListUsersResponse {
    /** Array of users */
    users: User[];
    /** Total count (if paginated) */
    total?: number;
}

// Account Types enum for type safety
export enum AccountType {
    PATIENT = 'patient',
    PROVIDER = 'provider',
    PHARMACIST = 'pharmacist',
    SUPPORT = 'support',
}

// Account Status enum for type safety
export enum AccountStatus {
    ACTIVE = 'active',
    PENDING = 'pending',
    SUSPENDED = 'suspended',
    COMPLETE = 'complete',
    INCOMPLETE = 'incomplete',
    REJECTED = 'rejected',
}

// Utility type for creating new users
export type CreateUserData = Omit<User, 'sub' | 'verification_token'> & {
    password: string;
};

// Utility type for updating user profile
export type UpdateUserData = Partial<Omit<User, 'sub' | 'verification_token'>>;

// Extended User interface with computed properties for UI
export interface UserWithMetadata extends User {
    /** Computed full name */
    full_name?: string;
    /** Computed display name */
    display_name?: string;
    /** Whether email is verified */
    is_verified?: boolean;
}

export default User;
