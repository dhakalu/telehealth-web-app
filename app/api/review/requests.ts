/**
 * Review API Client
 * 
 * This module provides a comprehensive API client for review-related operations.
 * It includes functions for creating reviews and fetching reviews by reviewee or reviewer.
 * 
 * Features:
 * - Full TypeScript support with proper types
 * - Axios-based HTTP client
 * - Utility functions for common operations
 * - Support for all review endpoints
 * 
 * @example
 * ```typescript
 * import { reviewApi } from '~/api/review';
 * 
 * // Create a new review
 * const review = await reviewApi.createReview({
 *   reviewerId: 'user-123',
 *   revieweeId: 'provider-456',
 *   rating: 5,
 *   comment: 'Excellent service!',
 *   encounterId: 'encounter-789'
 * });
 * 
 * // Get reviews for a provider
 * const reviews = await reviewApi.getReviewsByReviewee('provider-456');
 * 
 * // Get reviews written by a user
 * const myReviews = await reviewApi.getReviewsByReviewer('user-123');
 * ```
 */

import axios, { AxiosResponse } from 'axios';
import { API_BASE_URL } from "~/api";
import type {
    CreateReviewData,
    RatingValue,
    Review,
    ReviewFilter,
    ReviewStats,
    ReviewWithMetadata,
    ReviewWithReviewer,
} from '~/components/review/types';

import {
    RATING_LABELS,
    RATING_MAX,
    RATING_MIN,
} from '~/components/review/types';

/**
 * Review API operations
 */
export const reviewApi = {
    /**
     * Create a new review
     * POST /review
     */
    async createReview(reviewData: CreateReviewData): Promise<Review> {
        try {
            // Validate rating before sending
            const { isValid, errors } = reviewUtils.validateReviewData(reviewData);
            if (!isValid) {
                throw new Error(`Invalid review data: ${errors.join(', ')}`);
            }
            const response: AxiosResponse<Review> = await axios.post(
                `${API_BASE_URL}/review`,
                reviewData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error creating review:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data
                    ? error.response.data
                    : 'Failed to create review'
            );
        }
    },

    /**
     * Get reviews for a specific reviewee (person being reviewed)
     * GET /review/reviewee/{revieweeId}
     */
    async getReviewsByReviewee(revieweeId: string): Promise<ReviewWithReviewer[]> {
        try {
            if (!revieweeId) {
                throw new Error('Reviewee ID is required');
            }

            const response: AxiosResponse<ReviewWithReviewer[]> = await axios.get(
                `${API_BASE_URL}/review/reviewee/${encodeURIComponent(revieweeId)}`
            );
            return response.data || [];
        } catch (error) {
            console.error('Error fetching reviews by reviewee:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data
                    ? error.response.data
                    : 'Failed to fetch reviews'
            );
        }
    },

    /**
     * Get reviews written by a specific reviewer
     * GET /review/reviewer/{reviewerId}
     */
    async getReviewsByReviewer(reviewerId: string): Promise<ReviewWithReviewer[]> {
        try {
            if (!reviewerId) {
                throw new Error('Reviewer ID is required');
            }

            const response: AxiosResponse<ReviewWithReviewer[]> = await axios.get(
                `${API_BASE_URL}/review/reviewer/${encodeURIComponent(reviewerId)}`
            );
            return response.data || [];
        } catch (error) {
            console.error('Error fetching reviews by reviewer:', error);
            throw new Error(
                axios.isAxiosError(error) && error.response?.data
                    ? error.response.data
                    : 'Failed to fetch reviews'
            );
        }
    },
};

/**
 * Utility functions for review operations
 */
export const reviewUtils = {
    /**
     * Calculate average rating from an array of reviews
     */
    calculateAverageRating(reviews: (Review | ReviewWithReviewer)[]): number {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return Math.round((sum / reviews.length) * 10) / 10; // Round to 1 decimal place
    },

    /**
     * Get rating distribution for an array of reviews
     */
    getRatingDistribution(reviews: (Review | ReviewWithReviewer)[]): ReviewStats['ratingDistribution'] {
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach(review => {
            if (review.rating >= 1 && review.rating <= 5) {
                distribution[review.rating as RatingValue]++;
            }
        });
        return distribution;
    },

    /**
     * Get review statistics for an array of reviews
     */
    getReviewStats(reviews: (Review | ReviewWithReviewer)[]): ReviewStats {
        return {
            totalReviews: reviews.length,
            averageRating: this.calculateAverageRating(reviews),
            ratingDistribution: this.getRatingDistribution(reviews),
        };
    },

    /**
     * Get rating label for a numeric rating
     */
    getRatingLabel(rating: number): string {
        const roundedRating = Math.round(rating) as RatingValue;
        return RATING_LABELS[roundedRating] || 'Unknown';
    },

    /**
     * Generate star display string for rating
     */
    getStarDisplay(rating: number): string {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return '★'.repeat(fullStars) +
            (hasHalfStar ? '☆' : '') +
            '☆'.repeat(emptyStars);
    },

    /**
     * Format review date for display
     */
    formatReviewDate(dateString: string): string {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - date.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) return 'Yesterday';
            if (diffDays < 7) return `${diffDays} days ago`;
            if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
            if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;

            return date.toLocaleDateString();
        } catch {
            return dateString;
        }
    },

    /**
     * Check if review is recent (within last 30 days)
     */
    isRecentReview(dateString: string): boolean {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - date.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 30;
        } catch {
            return false;
        }
    },

    /**
     * Validate review data before submission
     */
    validateReviewData(reviewData: CreateReviewData): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!reviewData.reviewerId) {
            errors.push('Reviewer ID is required');
        }
        if (!reviewData.revieweeId) {
            errors.push('Reviewee ID is required');
        }
        if (reviewData.reviewerId === reviewData.revieweeId) {
            errors.push('Cannot review yourself');
        }
        if (!reviewData.rating || reviewData.rating < RATING_MIN || reviewData.rating > RATING_MAX) {
            errors.push(`Rating must be between ${RATING_MIN} and ${RATING_MAX}`);
        }
        if (!reviewData.comment || reviewData.comment.trim().length === 0) {
            errors.push('Comment is required');
        }
        if (reviewData.comment && reviewData.comment.length > 1000) {
            errors.push('Comment must be less than 1000 characters');
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    },

    /**
     * Filter reviews based on criteria
     */
    filterReviews(reviews: (Review | ReviewWithReviewer)[], filter: ReviewFilter): (Review | ReviewWithReviewer)[] {
        return reviews.filter(review => {
            if (filter.minRating && review.rating < filter.minRating) return false;
            if (filter.maxRating && review.rating > filter.maxRating) return false;
            if (filter.encounterId && review.encounterId !== filter.encounterId) return false;
            return true;
        }).slice(filter.offset || 0, (filter.offset || 0) + (filter.limit || reviews.length));
    },

    /**
     * Sort reviews by various criteria
     */
    sortReviews(reviews: (Review | ReviewWithReviewer)[], sortBy: 'date' | 'rating' | 'rating-desc' = 'date'): (Review | ReviewWithReviewer)[] {
        const sorted = [...reviews];

        switch (sortBy) {
            case 'date':
                return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            case 'rating':
                return sorted.sort((a, b) => a.rating - b.rating);
            case 'rating-desc':
                return sorted.sort((a, b) => b.rating - a.rating);
            default:
                return sorted;
        }
    },

    /**
     * Format review for display with additional metadata
     */
    formatReviewForDisplay(review: Review | ReviewWithReviewer): ReviewWithMetadata {
        return {
            ...review,
            formattedDate: this.formatReviewDate(review.created_at),
            isRecent: this.isRecentReview(review.created_at),
        };
    },

    /**
     * Get color class for rating display
     */
    getRatingColorClass(rating: number): string {
        if (rating >= 4.5) return 'text-green-600';
        if (rating >= 3.5) return 'text-yellow-600';
        if (rating >= 2.5) return 'text-orange-600';
        return 'text-red-600';
    },

    /**
     * Truncate comment for preview display
     */
    truncateComment(comment: string, maxLength: number = 150): string {
        if (comment.length <= maxLength) return comment;
        return comment.substring(0, maxLength) + '...';
    },
};

/**
 * Review API hooks for React components
 * These can be used with React Query or SWR for better data management
 */
export const reviewQueries = {
    /**
     * Query key factory for review-related queries
     */
    keys: {
        all: ['reviews'] as const,
        lists: () => [...reviewQueries.keys.all, 'list'] as const,
        byReviewee: (revieweeId: string) => [...reviewQueries.keys.lists(), 'reviewee', revieweeId] as const,
        byReviewer: (reviewerId: string) => [...reviewQueries.keys.lists(), 'reviewer', reviewerId] as const,
    },

    /**
     * Query function for fetching reviews by reviewee
     */
    fetchReviewsByReviewee: (revieweeId: string) => reviewApi.getReviewsByReviewee(revieweeId),

    /**
     * Query function for fetching reviews by reviewer
     */
    fetchReviewsByReviewer: (reviewerId: string) => reviewApi.getReviewsByReviewer(reviewerId),
};

// Export types for convenience
export { RATING_LABELS, RATING_MAX, RATING_MIN };
export type { CreateReviewData, Review, ReviewFilter, ReviewStats, ReviewWithReviewer };

export default reviewApi;
