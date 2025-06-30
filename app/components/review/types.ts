/**
 * Review Types and Interfaces
 * 
 * This file contains all TypeScript types and interfaces for review-related data structures.
 * These types correspond to the Go backend review models.
 */

// Base Review interface - matches Go Review struct
export interface Review {
    /** Unique identifier for the review */
    id: string;
    /** ID of the user who wrote the review */
    reviewerId: string;
    /** ID of the user being reviewed */
    revieweeId: string;
    /** Rating from 1 to 5 */
    rating: number;
    /** Review comment/text */
    comment: string;
    /** Optional encounter ID if review is related to a specific encounter */
    encounterId?: string;
    /** Timestamp when the review was created */
    created_at: string;
}

// Review with Reviewer Name - matches Go ReviewWithReviewer struct
export interface ReviewWithReviewer extends Review {
    /** Full name of the reviewer (first + middle + last name) */
    reviewerName: string;
}

// Review Creation Request - for creating new reviews
export interface CreateReviewRequest {
    /** ID of the user who wrote the review */
    reviewerId: string;
    /** ID of the user being reviewed */
    revieweeId: string;
    /** Rating from 1 to 5 */
    rating: number;
    /** Review comment/text */
    comment: string;
    /** Optional encounter ID if review is related to a specific encounter */
    encounterId?: string;
}

// Review Creation Data - for API input (without generated fields)
export type CreateReviewData = Omit<Review, 'id' | 'created_at'>;

// Review Update Request - for updating existing reviews (if needed in future)
export interface UpdateReviewRequest extends Partial<Omit<Review, 'id' | 'reviewerId' | 'revieweeId' | 'created_at'>> {
    /** Review ID - required for updates */
    id: string;
}

// Review Filter Options - for potential future filtering
export interface ReviewFilter {
    /** Filter by minimum rating */
    minRating?: number;
    /** Filter by maximum rating */
    maxRating?: number;
    /** Filter by encounter ID */
    encounterId?: string;
    /** Limit number of results */
    limit?: number;
    /** Offset for pagination */
    offset?: number;
}

// Review Statistics - for aggregated review data
export interface ReviewStats {
    /** Total number of reviews */
    totalReviews: number;
    /** Average rating */
    averageRating: number;
    /** Rating distribution (1-5 stars) */
    ratingDistribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
}

// Review with additional metadata for UI display
export interface ReviewWithMetadata extends Review {
    /** Reviewer display name */
    reviewerName?: string;
    /** Reviewee display name */
    revieweeName?: string;
    /** Formatted creation date */
    formattedDate?: string;
    /** Is this review recent (within last 30 days) */
    isRecent?: boolean;
}

// API Response wrapper for review operations
export interface ReviewApiResponse<T = Review> {
    /** Response data */
    data?: T;
    /** Error message if operation failed */
    error?: string;
    /** Success indicator */
    success?: boolean;
}

// List Reviews Response
export interface ListReviewsResponse {
    /** Array of reviews */
    reviews: Review[];
    /** Total count (if paginated) */
    total?: number;
    /** Average rating for the reviewee */
    averageRating?: number;
}

// Rating validation constants
export const RATING_MIN = 1;
export const RATING_MAX = 5;

// Rating labels for UI display
export const RATING_LABELS = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
} as const;

// Type for rating values
export type RatingValue = 1 | 2 | 3 | 4 | 5;

// Utility type for rating label keys
export type RatingLabel = typeof RATING_LABELS[RatingValue];

export default Review;
