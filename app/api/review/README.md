# Review API Client

A comprehensive TypeScript API client for review-related operations in the telehealth platform.

## Overview

This module provides a full-featured API client for managing reviews, including creating reviews and fetching reviews by reviewee or reviewer. It's built with Axios, TypeScript, and includes extensive utility functions for review management.

## Features

- 🔧 **Full TypeScript Support** - Complete type safety with proper interfaces
- 🌐 **Axios-based HTTP Client** - Reliable HTTP requests with error handling
- 🛠️ **Utility Functions** - Helper functions for common review operations
- 📊 **Statistics & Analytics** - Calculate ratings, distributions, and metrics
- ✅ **Validation** - Built-in data validation before API calls
- 🎨 **UI Helpers** - Functions for formatting and displaying reviews
- 🔍 **Filtering & Sorting** - Client-side review manipulation tools
- 📱 **React Query Ready** - Query helpers for modern React data fetching

## API Endpoints

Based on the Go backend handler, the API supports:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/review` | Create a new review |
| `GET` | `/review/reviewee/{revieweeId}` | Get reviews for a specific reviewee |
| `GET` | `/review/reviewer/{reviewerId}` | Get reviews written by a specific reviewer |

## Quick Start

```typescript
import { reviewApi, reviewUtils } from '~/api/review';

// Create a new review
const review = await reviewApi.createReview({
  reviewerId: 'user-123',
  revieweeId: 'provider-456',
  rating: 5,
  comment: 'Excellent service!',
  encounterId: 'encounter-789' // optional
});

// Get reviews for a provider
const reviews = await reviewApi.getReviewsByReviewee('provider-456');

// Get reviews written by a user
const myReviews = await reviewApi.getReviewsByReviewer('user-123');

// Calculate statistics
const stats = reviewUtils.getReviewStats(reviews);
console.log(`Average rating: ${stats.averageRating}`);
```

## API Reference

### `reviewApi`

#### `createReview(reviewData: CreateReviewData): Promise<Review>`

Creates a new review.

```typescript
const review = await reviewApi.createReview({
  reviewerId: 'user-123',
  revieweeId: 'provider-456',
  rating: 5, // 1-5 scale
  comment: 'Great service!',
  encounterId: 'encounter-789' // optional
});
```

**Validation:**
- Rating must be between 1 and 5
- All required fields validated
- Automatic error handling

#### `getReviewsByReviewee(revieweeId: string): Promise<Review[]>`

Fetches all reviews for a specific reviewee (person being reviewed).

```typescript
const reviews = await reviewApi.getReviewsByReviewee('provider-456');
```

#### `getReviewsByReviewer(reviewerId: string): Promise<Review[]>`

Fetches all reviews written by a specific reviewer.

```typescript
const myReviews = await reviewApi.getReviewsByReviewer('user-123');
```

### `reviewUtils`

Utility functions for working with review data:

#### Statistics & Analytics

```typescript
// Calculate average rating
const avgRating = reviewUtils.calculateAverageRating(reviews);

// Get rating distribution (how many 1-star, 2-star, etc.)
const distribution = reviewUtils.getRatingDistribution(reviews);

// Get comprehensive statistics
const stats = reviewUtils.getReviewStats(reviews);
// Returns: { totalReviews, averageRating, ratingDistribution }
```

#### Formatting & Display

```typescript
// Format date for display
const formattedDate = reviewUtils.formatReviewDate(review.created_at);
// Returns: "2 days ago", "Last week", "Dec 15, 2024", etc.

// Get star display string
const stars = reviewUtils.getStarDisplay(4.5);
// Returns: "★★★★☆"

// Get rating label
const label = reviewUtils.getRatingLabel(4);
// Returns: "Very Good"

// Get color class for rating
const colorClass = reviewUtils.getRatingColorClass(4.5);
// Returns: "text-green-600"

// Truncate long comments
const preview = reviewUtils.truncateComment(longComment, 100);
```

#### Validation

```typescript
const validation = reviewUtils.validateReviewData({
  reviewerId: 'user-123',
  revieweeId: 'provider-456',
  rating: 5,
  comment: 'Great service!'
});

if (!validation.isValid) {
  console.log('Errors:', validation.errors);
}
```

#### Filtering & Sorting

```typescript
// Filter reviews
const filteredReviews = reviewUtils.filterReviews(reviews, {
  minRating: 4,
  maxRating: 5,
  encounterId: 'specific-encounter',
  limit: 10,
  offset: 0
});

// Sort reviews
const sortedReviews = reviewUtils.sortReviews(reviews, 'rating-desc');
// Options: 'date', 'rating', 'rating-desc'

// Format for display with metadata
const formattedReviews = reviews.map(review => 
  reviewUtils.formatReviewForDisplay(review)
);
```

### `reviewQueries`

React Query helpers for modern data fetching:

```typescript
import { useQuery } from '@tanstack/react-query';
import { reviewQueries } from '~/api/review';

// Query keys for cache management
const queryKey = reviewQueries.keys.byReviewee('provider-456');

// Query functions
const { data: reviews } = useQuery({
  queryKey: reviewQueries.keys.byReviewee(providerId),
  queryFn: () => reviewQueries.fetchReviewsByReviewee(providerId)
});
```

## Types

All TypeScript types are exported for use in your components:

```typescript
import type { 
  Review, 
  CreateReviewData, 
  ReviewFilter, 
  ReviewStats,
  ReviewWithMetadata,
  RatingValue 
} from '~/api/review';
```

### Key Types

```typescript
interface Review {
  id: string;
  reviewerId: string;
  revieweeId: string;
  rating: number; // 1-5
  comment: string;
  encounterId?: string;
  created_at: string;
}

interface CreateReviewData {
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  encounterId?: string;
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}
```

## Error Handling

The API client includes comprehensive error handling:

```typescript
try {
  const review = await reviewApi.createReview(reviewData);
} catch (error) {
  // Errors are automatically formatted with helpful messages
  console.error('Review creation failed:', error.message);
}
```

Common error scenarios:
- Network connectivity issues
- Validation failures (invalid rating, missing fields)
- Server errors
- Missing or invalid IDs

## Integration Examples

### React Component

```typescript
import React, { useState, useEffect } from 'react';
import { reviewApi, reviewUtils } from '~/api/review';

function ProviderReviews({ providerId }: { providerId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reviewApi.getReviewsByReviewee(providerId)
      .then(setReviews)
      .finally(() => setLoading(false));
  }, [providerId]);

  const stats = reviewUtils.getReviewStats(reviews);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Reviews ({stats.totalReviews})</h2>
      <p>Average Rating: {stats.averageRating} ⭐</p>
      
      {reviews.map(review => (
        <div key={review.id}>
          <div>{reviewUtils.getStarDisplay(review.rating)}</div>
          <p>{review.comment}</p>
          <small>{reviewUtils.formatReviewDate(review.created_at)}</small>
        </div>
      ))}
    </div>
  );
}
```

### With React Query

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewApi, reviewQueries } from '~/api/review';

function useProviderReviews(providerId: string) {
  return useQuery({
    queryKey: reviewQueries.keys.byReviewee(providerId),
    queryFn: () => reviewQueries.fetchReviewsByReviewee(providerId),
    enabled: !!providerId
  });
}

function useCreateReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reviewApi.createReview,
    onSuccess: (data) => {
      // Invalidate and refetch reviews
      queryClient.invalidateQueries({
        queryKey: reviewQueries.keys.byReviewee(data.revieweeId)
      });
    }
  });
}
```

## Constants

```typescript
import { RATING_MIN, RATING_MAX, RATING_LABELS } from '~/api/review';

// RATING_MIN = 1
// RATING_MAX = 5
// RATING_LABELS = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' }
```

## Best Practices

1. **Use React Query** for data fetching in React components
2. **Validate data** with `reviewUtils.validateReviewData()` before submission
3. **Handle errors** gracefully with try-catch blocks
4. **Use utility functions** for consistent formatting and display
5. **Cache query keys** with `reviewQueries.keys` for efficient cache management
6. **Show loading states** during API operations
7. **Display meaningful error messages** to users

## Dependencies

- `axios` - HTTP client
- `~/api` - Base API configuration
- `~/components/review/types` - TypeScript type definitions

## Backend Compatibility

This client is designed to work with the Go backend review handler that supports:
- Rating validation (1-5 scale)
- JSON request/response format
- RESTful URL patterns
- Proper HTTP status codes
- Error message responses
