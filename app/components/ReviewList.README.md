# ReviewList Component

A reusable React component for displaying reviews for any reviewee (person being reviewed) in the telehealth platform.

## Features

- 🔄 **Automatic Data Fetching** - Fetches reviews using the review API
- 📊 **Statistics Display** - Shows total reviews and average rating
- 🎨 **Card-based Layout** - Clean, modern design using Card components
- ⭐ **Star Ratings** - Visual star ratings with labels
- 📅 **Date Formatting** - Human-readable date formatting ("2 days ago", etc.)
- 🏷️ **Recent Badge** - Shows "New" badge for recent reviews
- 📱 **Responsive Design** - Works on all screen sizes
- 🔄 **Loading States** - Loading spinners and error handling
- 📄 **Pagination** - Configurable review count with "View All" option

## Usage

### Basic Usage

```tsx
import { ReviewList } from "~/components/ReviewList";

// Basic usage - show reviews for a practitioner
<ReviewList revieweeId="practitioner-123" />
```

### Advanced Usage

```tsx
import { ReviewList } from "~/components/ReviewList";

function PractitionerProfile({ practitionerId }: { practitionerId: string }) {
  const handleViewAllReviews = () => {
    // Navigate to full reviews page or open modal
    navigate(`/reviews/${practitionerId}`);
  };

  return (
    <div>
      {/* Other profile content */}
      
      <ReviewList 
        revieweeId={practitionerId}
        title="Patient Reviews"
        maxReviews={3}
        showHeader={true}
        className="border-t pt-6"
        onViewAll={handleViewAllReviews}
      />
    </div>
  );
}
```

### Without Header

```tsx
// Just show the reviews list without title/stats
<ReviewList 
  revieweeId="practitioner-123"
  showHeader={false}
  maxReviews={10}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `revieweeId` | `string` | **Required** | ID of the person being reviewed |
| `maxReviews` | `number` | `5` | Maximum number of reviews to display initially |
| `showHeader` | `boolean` | `true` | Show the header with title and statistics |
| `title` | `string` | `"Reviews"` | Custom title for the reviews section |
| `className` | `string` | `""` | Additional CSS classes |
| `onViewAll` | `() => void` | `undefined` | Callback when "View All Reviews" is clicked |

## API Integration

The component automatically:
- Fetches reviews using `reviewApi.getReviewsByReviewee(revieweeId)`
- Calculates statistics using `reviewUtils.getReviewStats(reviews)`
- Formats dates using `reviewUtils.formatReviewDate()`
- Displays star ratings and labels

## States

### Loading State
Shows a loading spinner while fetching reviews:
```tsx
<Card>
  <div className="flex items-center justify-center py-8">
    <span className="loading loading-spinner loading-md"></span>
    <span className="ml-2">Loading reviews...</span>
  </div>
</Card>
```

### Error State
Shows error message if fetch fails:
```tsx
<Card>
  <div className="text-center py-8 text-error">
    <p>Failed to load reviews</p>
  </div>
</Card>
```

### Empty State
Shows message when no reviews exist:
```tsx
<Card>
  <div className="text-center py-8 opacity-60">
    <p>No reviews yet.</p>
  </div>
</Card>
```

### Reviews Display
Shows individual review cards with:
- Star rating and rating label
- "New" badge for recent reviews
- Formatted date
- Review comment
- Encounter ID (if applicable)

## Review Card Structure

Each review is displayed in a Card with:

```tsx
<Card key={review.id} hasBorder>
  <div className="flex items-start justify-between mb-2">
    <div className="flex items-center gap-2">
      <StarRating rating={review.rating} />
      <span className="text-sm font-medium">Excellent</span>
      <span className="badge badge-primary badge-sm">New</span>
    </div>
    <span className="text-sm opacity-60">2 days ago</span>
  </div>
  <p className="text-base-content/80">Great service!</p>
  <span className="text-xs opacity-50 mt-2 block">
    Related to encounter: encounter-123
  </span>
</Card>
```

## Statistics Header

When `showHeader={true}`, shows:
- Title with review count: "Reviews (12)"
- Average rating with stars: ⭐⭐⭐⭐⭐ 4.8 average

## Pagination

When there are more reviews than `maxReviews`:
- Shows "Showing X of Y reviews" 
- Displays "View All Reviews" button
- Calls `onViewAll` callback when clicked

## Use Cases

### Practitioner Profiles
```tsx
<ReviewList 
  revieweeId={practitioner.id} 
  title="Patient Reviews"
  maxReviews={5}
/>
```

### Pharmacy Reviews
```tsx
<ReviewList 
  revieweeId={pharmacy.id} 
  title="Customer Reviews"
  maxReviews={3}
/>
```

### Organization Reviews
```tsx
<ReviewList 
  revieweeId={organization.id} 
  title="Organization Reviews"
  showHeader={false}
/>
```

### Dashboard Widget
```tsx
<ReviewList 
  revieweeId={currentUser.id} 
  title="My Recent Reviews"
  maxReviews={3}
  className="bg-base-200 p-4 rounded-lg"
/>
```

## Dependencies

- `~/api/review` - Review API client
- `~/components/common/Card` - Card component
- `~/components/RatingStar` - Star rating component
- React hooks (useState, useEffect)

## Styling

Uses DaisyUI/Tailwind classes:
- `loading loading-spinner` - Loading states
- `text-error` - Error styling
- `badge badge-primary` - New review badges
- `text-base-content` - Theme-aware text colors
- `opacity-60`, `opacity-50` - Subtle text

## Error Handling

- Network errors are caught and displayed
- Loading states prevent UI confusion
- Empty states provide helpful messaging
- Console logging for debugging

## Accessibility

- Semantic HTML structure
- Proper ARIA labels on interactive elements
- Keyboard navigation support
- High contrast semantic colors
- Screen reader friendly text

## Performance

- Automatic cleanup of async operations
- Efficient re-rendering with proper dependencies
- Slicing for pagination without full data loading
- Memoized calculations where beneficial

The component is designed to be production-ready with proper error handling, loading states, and accessibility considerations.
