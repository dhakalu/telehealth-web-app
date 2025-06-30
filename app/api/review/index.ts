/**
 * Review API Module
 * 
 * This module exports the review API client and related utilities.
 * It provides a centralized access point for all review-related API operations.
 * 
 * @example
 * ```typescript
 * import { reviewApi, reviewUtils } from '~/api/review';
 * 
 * // Create a review
 * const review = await reviewApi.createReview({
 *   reviewerId: 'user-123',
 *   revieweeId: 'provider-456',
 *   rating: 5,
 *   comment: 'Excellent service!'
 * });
 * 
 * // Calculate statistics
 * const stats = reviewUtils.getReviewStats(reviews);
 * ```
 */

export {
    RATING_LABELS, RATING_MAX, RATING_MIN, reviewApi, reviewQueries, reviewUtils
} from './requests';

export type {
    CreateReviewData, Review, ReviewFilter,
    ReviewStats, ReviewWithReviewer
} from './requests';

// Default export for convenience
export { default } from './requests';

