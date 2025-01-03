import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

interface Review {
  time: string;
  user: string;
  review: number;
  comment: string;
  profile_photo?: string;
  customer_name?: string;
}

interface SinglePBPCProductReviewsProps {
  productId: string;
}

const Star: React.FC<{
  color?: string;
  fill?: string;
  strokeWidth?: number;
  className?: string;
}> = ({
  color = "#fa9302",
  fill = "none",
  strokeWidth = 1,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke={color}
    fill={fill}
    strokeWidth={strokeWidth}
    className={className}
  >
    <polygon points="12,2 15,8 22,9 17,14 18,21 12,17 6,21 7,14 2,9 9,8" />
  </svg>
);

const SinglePBPCProductReviews: React.FC<SinglePBPCProductReviewsProps> = ({
  productId,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  // Fetch reviews and their associated user profiles
  useEffect(() => {
    const fetchReviewsWithProfiles = async () => {
      setLoading(true);
      try {
        const { data: productData, error: productError } = await supabase
          .from("pre_build")
          .select("user_rating")
          .eq("id", productId)
          .single();

        if (productError) {
          setError("Error fetching reviews");
          return;
        }

        if (productData?.user_rating) {
          const reviewsWithProfiles: Review[] = await Promise.all(
            productData.user_rating.map(async (review: Review) => {
              const { data: profileData } = await supabase
                .from("profile")
                .select("customer_name, profile_photo")
                .eq("id", review.user)
                .single();

              return {
                ...review,
                customer_name: profileData?.customer_name || "Non-Verified User",
                profile_photo: profileData?.profile_photo || null,
              };
            })
          );

          setReviews(reviewsWithProfiles);
          setFilteredReviews(reviewsWithProfiles);
        }
      } catch {
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviewsWithProfiles();
  }, [productId]);

  // Filter reviews based on selected rating
  const filterReviews = useCallback(() => {
    setFilteredReviews(
      selectedRating !== null
        ? reviews.filter((review) => review.review === selectedRating)
        : reviews
    );
  }, [reviews, selectedRating]);

  useEffect(() => {
    filterReviews();
  }, [filterReviews]);

  // Render stars based on rating value
  const renderStars = (rating: number) => (
    <div className="stars flex">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          color={index < rating ? "#fa9302" : "#ccc"}
          fill={index < rating ? "#fa9302" : "none"}
          strokeWidth={1}
          className="cursor-pointer"
        />
      ))}
    </div>
  );

  // Display relative time in a user-friendly way
  const renderRelativeTime = (reviewTime: string) => {
    const now = new Date();
    const reviewDate = new Date(reviewTime);
    const timeDiff = now.getTime() - reviewDate.getTime();

    const minutes = Math.floor(timeDiff / (1000 * 60));
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  // Handle loading and error states
  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="reviews-container">
      <div className="filter-options">
        <p>Filter by Rating:</p>
        <div className="stars-filter flex">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              onClick={() =>
                setSelectedRating(selectedRating === index + 1 ? null : index + 1)
              }
              className="cursor-pointer"
            >
              <Star
                color="#fa9302"
                fill={selectedRating === index + 1 ? "#fa9302" : "none"}
                strokeWidth={1}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="reviews-list">
        {filteredReviews.length === 0 ? (
          <p>No reviews available for this rating.</p>
        ) : (
          filteredReviews.map((review, index) => (
            <div key={index} className="review-card flex items-start gap-4">
              <div className="profile-photo">
                {review.profile_photo ? (
                  <Image
                    src={review.profile_photo}
                    alt={`${review.customer_name}'s Profile`}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="default-avatar bg-gray-300 rounded-full w-10 h-10"></div>
                )}
              </div>
              <div className="review-content">
                <p className="customer-name font-bold">
                  {review.customer_name}
                </p>
                <div className="review-stars">{renderStars(review.review)}</div>
                <p className="review-comment">{review.comment}</p>
                <p className="review-time text-gray-500 text-sm">
                  {renderRelativeTime(review.time)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SinglePBPCProductReviews;
