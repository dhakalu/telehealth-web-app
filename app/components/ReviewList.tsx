import React, { useEffect, useState } from "react";
import type { ReviewWithReviewer } from "~/api/review";
import { reviewApi, reviewUtils } from "~/api/review";
import Card from "./common/Card";
import { StarRating } from "./RatingStar";

export interface ReviewListProps {
    /** ID of the person being reviewed (reviewee) */
    revieweeId: string;
    /** Maximum number of reviews to display initially */
    maxReviews?: number;
    /** Show the header with title and statistics */
    showHeader?: boolean;
    /** Custom title for the reviews section */
    title?: string;
    /** Additional CSS classes */
    className?: string;
    /** Callback when "View All Reviews" is clicked */
    onViewAll?: () => void;
}

export const ReviewList: React.FC<ReviewListProps> = ({
    revieweeId,
    maxReviews = 5,
    showHeader = true,
    title = "Reviews",
    className = "",
    onViewAll
}) => {
    const [reviews, setReviews] = useState<ReviewWithReviewer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch reviews for the reviewee
    useEffect(() => {
        const fetchReviews = async () => {
            if (!revieweeId) return;

            try {
                setLoading(true);
                const revieweeReviews = await reviewApi.getReviewsByReviewee(revieweeId);
                setReviews(revieweeReviews);
                setError(null);
            } catch (err) {
                console.error('Error fetching reviews:', err);
                setError('Failed to load reviews');
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [revieweeId]);

    // Calculate review statistics
    const reviewStats = reviewUtils.getReviewStats(reviews);
    const displayedReviews = reviews.slice(0, maxReviews);
    const hasMoreReviews = reviews.length > maxReviews;

    return (
        <div className={`mt-6 ${className}`}>
            {/* Header with title and statistics */}
            {showHeader && (
                <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold">
                        {title} ({reviewStats.totalReviews})
                    </span>
                    {reviewStats.totalReviews > 0 && (
                        <div className="flex items-center gap-2">
                            <StarRating rating={reviewStats.averageRating} />
                            <span className="text-sm opacity-70">
                                {reviewStats.averageRating.toFixed(1)} average
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Loading state */}
            {loading && (
                <Card>
                    <div className="flex items-center justify-center py-8">
                        <span className="loading loading-spinner loading-md"></span>
                        <span className="ml-2">Loading reviews...</span>
                    </div>
                </Card>
            )}

            {/* Error state */}
            {error && (
                <Card>
                    <div className="text-center py-8 text-error">
                        <p>{error}</p>
                    </div>
                </Card>
            )}

            {/* Empty state */}
            {!loading && !error && reviews.length === 0 && (
                <Card>
                    <div className="text-center py-8 opacity-60">
                        <p>No reviews yet.</p>
                    </div>
                </Card>
            )}

            {/* Reviews list */}
            {!loading && !error && reviews.length > 0 && (
                <div className="space-y-4">
                    {displayedReviews.map((review) => {
                        const formattedReview = reviewUtils.formatReviewForDisplay(review);
                        return (
                            <Card key={review.id} hasBorder>
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <StarRating rating={review.rating} />
                                        <span className="text-sm font-medium">
                                            {reviewUtils.getRatingLabel(review.rating)}
                                        </span>
                                        {formattedReview.isRecent && (
                                            <span className="badge badge-primary badge-sm">New</span>
                                        )}
                                    </div>
                                    <span className="text-sm opacity-60">
                                        {formattedReview.formattedDate}
                                    </span>
                                </div>
                                <p className="text-base-content/80">
                                    {review.comment}
                                </p>
                                {review.encounterId && (
                                    <span className="text-xs opacity-50 mt-2 block">
                                        Rated by: {review.reviewerName || 'Anonymous'} <br />
                                    </span>
                                )}
                            </Card>
                        );
                    })}

                    {/* Show more button */}
                    {hasMoreReviews && (
                        <Card>
                            <div className="text-center py-4">
                                <p className="text-sm opacity-70">
                                    Showing {maxReviews} of {reviews.length} reviews
                                </p>
                                <button
                                    className="btn btn-outline btn-sm mt-2"
                                    onClick={onViewAll}
                                >
                                    View All Reviews
                                </button>
                            </div>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReviewList;
