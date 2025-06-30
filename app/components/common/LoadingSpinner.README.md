# LoadingSpinner Component

A reusable loading spinner component that can be used throughout the application for indicating loading states.

## Usage

```tsx
import { LoadingSpinner } from "~/components/common";

// Basic usage
<LoadingSpinner />

// With custom message
<LoadingSpinner message="Loading data..." />

// Different sizes
<LoadingSpinner size="sm" />
<LoadingSpinner size="md" />
<LoadingSpinner size="lg" />
<LoadingSpinner size="xl" />

// Full screen loading
<LoadingSpinner 
  message="Loading application..." 
  fullScreen={true}
  size="lg"
/>

// With additional content
<LoadingSpinner message="Processing...">
  <p className="text-sm">This may take a few moments</p>
</LoadingSpinner>

// Custom styling
<LoadingSpinner 
  message="Loading..."
  className="my-8"
  size="md"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `string` | `"Loading..."` | Text message to display below the spinner |
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `"lg"` | Size of the spinner |
| `fullScreen` | `boolean` | `false` | Whether to render as a full-screen overlay |
| `className` | `string` | `""` | Additional CSS classes to apply |
| `children` | `ReactNode` | `undefined` | Additional content to render below the message |

## Sizes

- **sm**: 32x32px (h-8 w-8)
- **md**: 64x64px (h-16 w-16) 
- **lg**: 128x128px (h-32 w-32)
- **xl**: 192x192px (h-48 w-48)

## Styling

The component uses semantic DaisyUI/Tailwind classes:
- `border-primary` for the spinner color
- `text-base-content/60` for the message text
- `bg-base-100` for full-screen background

## Examples

### Page Loading
```tsx
function MyPage() {
  const [loading, setLoading] = useState(true);
  
  if (loading) {
    return <LoadingSpinner fullScreen message="Loading page..." />;
  }
  
  return <div>Page content</div>;
}
```

### Section Loading
```tsx
function DataSection() {
  const [loading, setLoading] = useState(false);
  
  return (
    <div className="card">
      {loading ? (
        <LoadingSpinner 
          size="md" 
          message="Loading data..."
          className="p-8"
        />
      ) : (
        <div>Data content</div>
      )}
    </div>
  );
}
```

### Button Loading State
```tsx
function SubmitButton() {
  const [submitting, setSubmitting] = useState(false);
  
  return (
    <button disabled={submitting}>
      {submitting ? (
        <LoadingSpinner size="sm" message="" />
      ) : (
        "Submit"
      )}
    </button>
  );
}
```
