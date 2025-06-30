# Pharmacist API Client

This module provides TypeScript API client functions for all pharmacist-related endpoints in the telehealth application.

## Installation

```typescript
import { 
    createPharmacist, 
    getPharmacistById, 
    searchPharmacists 
} from '~/api/pharmacist';

// Or import everything
import pharmacistApi from '~/api/pharmacist';
```

## API Functions

### Individual Pharmacist Operations

#### `createPharmacist(data: CreatePharmacistRequest)`
Creates a new pharmacist record.

```typescript
const newPharmacist = await createPharmacist({
    user_id: "user-uuid",
    license_number: "PH123456",
    license_state: "CA",
    position: "Staff Pharmacist",
    specializations: ["Clinical", "Retail"],
    certifications: ["BCPS"]
});
```

#### `getPharmacistById(id: string)`
Retrieves a pharmacist by their ID.

```typescript
const pharmacist = await getPharmacistById("pharmacist-uuid");
```

#### `getPharmacistByUserId(userId: string)`
Retrieves a pharmacist by their user ID.

```typescript
const pharmacist = await getPharmacistByUserId("user-uuid");
```

#### `getPharmacistByLicenseNumber(licenseNumber: string)`
Retrieves a pharmacist by their license number.

```typescript
const pharmacist = await getPharmacistByLicenseNumber("PH123456");
```

#### `updatePharmacist(id: string, data: UpdatePharmacistRequest)`
Updates an existing pharmacist record.

```typescript
const updatedPharmacist = await updatePharmacist("pharmacist-uuid", {
    position: "Senior Pharmacist",
    years_experience: 10
});
```

#### `deletePharmacist(id: string)`
Deletes a pharmacist record.

```typescript
await deletePharmacist("pharmacist-uuid");
```

#### `searchPharmacists(filter?, limit?, offset?)`
Searches pharmacists with optional filters and pagination.

```typescript
const results = await searchPharmacists({
    organization_id: "org-uuid",
    license_state: "CA",
    active: true,
    verified: true
}, 20, 0);

console.log(results.data.pharmacists);
console.log(results.data.total_count);
```

### Organization-Pharmacist Relationships

#### `createOrganizationPharmacist(organizationId: string, data: CreateOrganizationPharmacistRequest)`
Creates a relationship between an organization and pharmacist.

```typescript
const relationship = await createOrganizationPharmacist("org-uuid", {
    organization_id: "org-uuid",
    pharmacist_id: "pharmacist-uuid",
    role: "Staff Pharmacist",
    employment_type: "Full-time",
    is_primary: true
});
```

#### `getOrganizationPharmacists(organizationId: string)`
Gets all pharmacists for an organization.

```typescript
const pharmacists = await getOrganizationPharmacists("org-uuid");
```

#### `getPharmacistOrganizations(pharmacistId: string)`
Gets all organizations for a pharmacist.

```typescript
const organizations = await getPharmacistOrganizations("pharmacist-uuid");
```

#### `updateOrganizationPharmacist(relationshipId: string, data: UpdateOrganizationPharmacistRequest)`
Updates an organization-pharmacist relationship.

```typescript
const updatedRelationship = await updateOrganizationPharmacist("relationship-uuid", {
    role: "Lead Pharmacist",
    active: true
});
```

#### `deleteOrganizationPharmacist(relationshipId: string)`
Deletes an organization-pharmacist relationship.

```typescript
await deleteOrganizationPharmacist("relationship-uuid");
```

### Utility Functions

#### `getActivePharmacistsForOrganization(organizationId: string, limit?, offset?)`
Gets active pharmacists for a specific organization.

```typescript
const activePharmacists = await getActivePharmacistsForOrganization("org-uuid", 50, 0);
```

#### `getVerifiedPharmacistsByState(licenseState: string, limit?, offset?)`
Gets verified pharmacists in a specific state.

```typescript
const verifiedPharmacists = await getVerifiedPharmacistsByState("CA", 50, 0);
```

#### `searchPharmacistsByName(name: string, limit?, offset?)`
Searches pharmacists by name.

```typescript
const results = await searchPharmacistsByName("John Smith", 20, 0);
```

#### `getPharmacistsByPosition(position: string, organizationId?, limit?, offset?)`
Gets pharmacists by position, optionally filtered by organization.

```typescript
const managers = await getPharmacistsByPosition("Pharmacy Manager", "org-uuid", 20, 0);
```

### Error Handling

Use the `withErrorHandling` wrapper for automatic error handling:

```typescript
const { data, error } = await withErrorHandling(() => 
    getPharmacistById("pharmacist-uuid")
);

if (error) {
    console.error("API Error:", error);
} else {
    console.log("Pharmacist:", data);
}
```

## TypeScript Types

All functions use proper TypeScript types imported from `~/components/pharmacist/types`:

- `Pharmacist` - Core pharmacist data
- `PharmacistWithUser` - Pharmacist with user information
- `CreatePharmacistRequest` - Data for creating pharmacists
- `UpdatePharmacistRequest` - Data for updating pharmacists
- `PharmacistFilter` - Search filter options
- `PharmacistSearchResponse` - Search results format
- `OrganizationPharmacist` - Organization-pharmacist relationship
- `CreateOrganizationPharmacistRequest` - Data for creating relationships
- `UpdateOrganizationPharmacistRequest` - Data for updating relationships

## API Response Format

All functions return Axios responses with proper typing:

```typescript
interface AxiosResponse<T> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: any;
}
```

## Error Handling

API functions throw axios errors that can be caught and handled:

```typescript
try {
    const response = await createPharmacist(data);
    console.log(response.data);
} catch (error) {
    if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data);
    }
}
```

## Environment Configuration

The API base URL is configured through the `API_BASE_URL` environment variable or defaults to `http://localhost:8090/api`.
