# PharmacyPrescriptions Component

A React component that displays a list of prescriptions for a specific pharmacy organization in a card-based layout.

## Features

- **Card-based Layout**: Each prescription is displayed in an attractive card format
- **Filtering & Search**: Filter by status, date range, and search by medication name
- **Pagination**: Handles large datasets with pagination controls
- **Semantic Coloring**: Uses DaisyUI semantic color classes for consistent theming
- **Priority Indicators**: Shows badges for controlled substances and expiring prescriptions
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Loading States**: Shows loading spinners and handles error states
- **Action Buttons**: Direct links to view details and fill prescriptions

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `pharmacyId` | `string` | Yes | The UUID of the pharmacy organization |
| `className` | `string` | No | Additional CSS classes to apply to the container |

## API Integration

The component integrates with the prescription API endpoints based on the Go handler:

- **GET /prescriptions**: Fetches prescriptions with filtering support
- Query parameters supported:
  - `pharmacy_id`: Filter by pharmacy (automatically set)
  - `status`: Filter by prescription status
  - `medication_name`: Search by medication name
  - `date_from` / `date_to`: Date range filtering
  - `limit` / `offset`: Pagination

## Usage

```tsx
import { PharmacyPrescriptions } from "~/components/prescription";

// Basic usage
<PharmacyPrescriptions pharmacyId="123e4567-e89b-12d3-a456-426614174000" />

// With custom styling
<PharmacyPrescriptions 
  pharmacyId="pharmacy-uuid"
  className="max-w-6xl mx-auto"
/>
```

## Data Types

The component uses TypeScript interfaces defined in `types.ts`:

- `PrescriptionWithDetails`: Extended prescription with patient/practitioner names
- `PrescriptionStatus`: Union type for prescription statuses
- `PrescriptionFilter`: Filter options for the API

## Semantic Colors

The component uses DaisyUI semantic color classes:

- **Status Badges**:
  - `badge-warning`: Pending prescriptions
  - `badge-info`: Sent prescriptions  
  - `badge-success`: Filled prescriptions
  - `badge-error`: Cancelled/rejected prescriptions
  - `badge-neutral`: Expired prescriptions

- **Priority Indicators**:
  - `badge-error`: Controlled substances
  - `badge-warning`: Expiring soon

- **UI Elements**:
  - `text-base-content`: Primary text
  - `text-base-content/70`: Secondary text
  - `bg-base-200`: Card backgrounds
  - `btn-primary` / `btn-success`: Action buttons

## Responsive Breakpoints

- **Mobile**: Single column layout
- **Tablet** (`md:`): 2 columns
- **Desktop** (`lg:`): 3 columns
- **Filters**: Stack vertically on mobile, grid layout on larger screens

## Error Handling

- Network errors display user-friendly error messages
- Loading states prevent UI confusion
- Empty states guide users when no data is available
- Graceful fallbacks for missing optional data

## Accessibility

- Semantic HTML structure
- Proper ARIA labels on interactive elements
- Keyboard navigation support
- High contrast semantic colors
- Screen reader friendly status indicators

## Dependencies

- React Router (for navigation links)
- DaisyUI (for semantic styling)
- Tailwind CSS (for utility classes)
- TypeScript (for type safety)

The component is designed to be production-ready with proper error handling, loading states, and accessibility considerations.
