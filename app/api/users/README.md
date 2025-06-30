# User API Client

A comprehensive TypeScript API client for user management operations in the telehealth application.

## Features

- **Full TypeScript Support**: Complete type safety with proper interfaces and types
- **Axios-based HTTP Client**: Robust HTTP handling with interceptors for auth and error management
- **Comprehensive CRUD Operations**: Create, read, update, and delete user accounts
- **Authentication Support**: Login and email verification endpoints
- **Utility Functions**: Helper functions for common user operations
- **React Query Integration**: Query key factories for React Query integration
- **Error Handling**: Comprehensive error handling with meaningful error messages

## Quick Start

```typescript
import { userApi, userUtils, AccountType, AccountStatus } from '~/api/users';

// Create a new user
const newUser = await userApi.createUser({
  name: 'John Doe',
  email: 'john@example.com',
  account_type: AccountType.PATIENT,
  password: 'securePassword123'
});

// Login user
const user = await userApi.login({
  email: 'john@example.com',
  password: 'securePassword123',
  account_type: AccountType.PATIENT
});

// Get user by ID
const user = await userApi.getUserById('user-id');

// Update user status
await userApi.updateUserStatus('user-id', AccountStatus.ACTIVE);
```

## API Reference

### Core API Functions

#### `userApi.createUser(userData: CreateUserData): Promise<User>`
Creates a new user account with the provided data.

**Parameters:**
- `userData`: User data including name, email, account_type, and password

**Returns:** Promise resolving to the created User object

**Example:**
```typescript
const user = await userApi.createUser({
  name: 'Jane Smith',
  email: 'jane@example.com',
  account_type: 'provider',
  password: 'securePassword123'
});
```

#### `userApi.getUserById(id: string): Promise<User>`
Retrieves a user by their ID (sub).

**Parameters:**
- `id`: User ID (sub)

**Returns:** Promise resolving to the User object

#### `userApi.listUsers(): Promise<User[]>`
Retrieves all users in the system.

**Returns:** Promise resolving to an array of User objects

#### `userApi.updateUser(id: string, userData: UpdateUserData): Promise<User>`
Updates user information.

**Parameters:**
- `id`: User ID (sub)
- `userData`: Partial user data to update

**Returns:** Promise resolving to the updated User object

#### `userApi.deleteUser(id: string): Promise<void>`
Deletes a user account.

**Parameters:**
- `id`: User ID (sub)

#### `userApi.updateUserStatus(id: string, status: AccountStatus | string): Promise<User>`
Updates only the user's status.

**Parameters:**
- `id`: User ID (sub)
- `status`: New status value

**Returns:** Promise resolving to the updated User object

#### `userApi.login(credentials: LoginRequest): Promise<User>`
Authenticates a user with email and password.

**Parameters:**
- `credentials`: Object containing email, password, and account_type

**Returns:** Promise resolving to the authenticated User object

#### `userApi.verifyEmail(token: string): Promise<EmailVerificationResponse>`
Verifies a user's email with the provided token.

**Parameters:**
- `token`: Email verification token

**Returns:** Promise resolving to verification response

### Utility Functions

#### `userUtils.getFullName(user: User): string`
Returns the user's full name, falling back to email if name parts aren't available.

#### `userUtils.getDisplayName(user: User): string`
Returns a shorter display name for the user.

#### `userUtils.isEmailVerified(user: User): boolean`
Checks if the user's email has been verified.

#### `userUtils.getStatusInfo(status: string)`
Returns display information for a user status including label, color, and description.

#### `userUtils.getAccountTypeInfo(accountType: string)`
Returns display information for an account type including label, icon, and description.

#### `userUtils.isValidEmail(email: string): boolean`
Validates email format.

#### `userUtils.validatePassword(password: string)`
Validates password strength and returns validation results.

#### `userUtils.formatUserForDisplay(user: User)`
Formats user data for display in tables or lists.

### React Query Integration

The module provides query key factories for use with React Query:

```typescript
import { userQueries } from '~/api/users';

// Query keys
const allUsersKey = userQueries.keys.all;
const userListKey = userQueries.keys.lists();
const userDetailKey = userQueries.keys.detail('user-id');

// Query functions
const queryUsers = userQueries.fetchUsers;
const queryUser = userQueries.fetchUser;
```

## Types

### Core Types

- **`User`**: Main user interface matching the backend model
- **`CreateUserData`**: Data required to create a new user
- **`UpdateUserData`**: Partial user data for updates
- **`LoginRequest`**: Login credentials interface
- **`AccountType`**: Enum for account types (PATIENT, PROVIDER, PHARMACIST, SUPPORT)
- **`AccountStatus`**: Enum for account statuses (ACTIVE, PENDING, SUSPENDED, etc.)

### Example User Object

```typescript
interface User {
  sub: string;                    // User ID
  name?: string;                  // Full name
  given_name?: string;            // First name
  family_name?: string;           // Last name
  middle_name?: string;           // Middle name
  email?: string;                 // Email address
  account_type?: string;          // Account type
  status?: string;                // Account status
  verification_token?: string;    // Email verification token
}
```

## Error Handling

All API functions include comprehensive error handling:

```typescript
try {
  const user = await userApi.getUserById('invalid-id');
} catch (error) {
  console.error('Error:', error.message);
  // Error message will be either from the API response or a generic fallback
}
```

## Authentication

The API client automatically handles authentication:

- **Request Interceptor**: Automatically adds auth tokens from localStorage
- **Response Interceptor**: Handles 401 errors by redirecting to login
- **Token Management**: Stores and manages authentication tokens

## Configuration

The API client uses environment variables for configuration:

- `API_BASE_URL`: Base URL for the API (defaults to 'http://localhost:8080')

## Best Practices

1. **Type Safety**: Always use the provided TypeScript types
2. **Error Handling**: Wrap API calls in try-catch blocks
3. **React Query**: Use the provided query keys and functions for consistent caching
4. **Validation**: Use utility functions for email and password validation
5. **Display**: Use utility functions for consistent user data display

## Examples

### User Registration Flow

```typescript
import { userApi, userUtils, AccountType } from '~/api/users';

// Validate input
const isValidEmail = userUtils.isValidEmail(email);
const passwordValidation = userUtils.validatePassword(password);

if (!isValidEmail || !passwordValidation.isValid) {
  // Handle validation errors
  return;
}

// Create user
try {
  const user = await userApi.createUser({
    name: 'John Doe',
    email: 'john@example.com',
    account_type: AccountType.PATIENT,
    password: 'securePassword123'
  });
  
  console.log('User created:', userUtils.getDisplayName(user));
} catch (error) {
  console.error('Registration failed:', error.message);
}
```

### User Management Dashboard

```typescript
import { userApi, userUtils } from '~/api/users';

// Fetch all users
const users = await userApi.listUsers();

// Format for display
const displayUsers = users.map(user => ({
  ...userUtils.formatUserForDisplay(user),
  statusInfo: userUtils.getStatusInfo(user.status || ''),
  typeInfo: userUtils.getAccountTypeInfo(user.account_type || '')
}));

// Update user status
await userApi.updateUserStatus(userId, 'active');
```

## Dependencies

- `axios`: HTTP client
- `~/components/user/types`: User type definitions

## Related Files

- `~/components/user/types.ts`: Type definitions
- `~/api/users/requests.ts`: Main API implementation
- `~/api/users/index.ts`: Module exports
