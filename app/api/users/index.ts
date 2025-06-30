/**
 * User API Module
 * 
 * This module exports all user-related API functions and utilities.
 * It provides a convenient way to import user API functionality across the application.
 */

// Main API client
export { default as userApi } from './requests';

// Named exports for convenience
export {
    AccountStatus, AccountType, userApi as default, userQueries, userUtils
} from './requests';

// Re-export types for easy access
export type {
    CreateUserData, LoginRequest, UpdateUserData, User
} from './requests';

// Re-export all types from types file
export type * from '~/components/user/types';

