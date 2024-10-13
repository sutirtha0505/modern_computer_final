import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Review {
  time: string;
  user: string; // user ID from review
  review: number;
  comment: string;
  profile_photo?: string; // Profile photo fetched from the profile table
  customer_name?: string; // Customer name fetched from the profile table
}

interface SingleProductReviewsProps {
  productId: string;
}

// Dummy Star component (You can replace this with an actual SVG or custom component)
const Star = ({
  color = "#fa9302",
  fill = "none",
  strokeWidth = 1,
  className = "",
}: {
  color: string;
  fill: string;
  strokeWidth: number;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke={color}
    fill={fill}
    strokeWidth={strokeWidth}
    className={className}
  >
    <polygon points="12,2 15,8 22,9 17,14 18,21 12,17 6,21 7,14 2,9 9,8" />
  </svg>
);

const SingleProductReviews: React.FC<SingleProductReviewsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviewsWithProfiles = async () => {
      setLoading(true);
      try {
        // Fetch reviews from the products table
        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("user_rating")
          .eq("product_id", productId)
          .single();

        if (productError) {
          setError("Error fetching reviews");
          setLoading(false);
          return;
        }

        if (productData && productData.user_rating) {
          const reviewsWithProfiles: Review[] = await Promise.all(
            productData.user_rating.map(async (review: Review) => {
              // Fetch the user profile for each review
              const { data: profileData, error: profileError } = await supabase
                .from("profile")
                .select("customer_name, profile_photo")
                .eq("id", review.user) // Match the user field from the review with the profile id
                .single();

              if (profileError) {
                console.error("Error fetching user profile", profileError);
              }

              return {
                ...review,
                customer_name: profileData?.customer_name || "Unknown User",
                profile_photo: profileData?.profile_photo || null,
              };
            })
          );

          setReviews(reviewsWithProfiles);
        }
      } catch (error) {
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviewsWithProfiles();
  }, [productId]);

  // Function to render stars with dynamic color and fill based on the rating
  const renderStars = (rating: number) => {
    return (
      <div className="stars flex">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            color={index < rating ? "#fa9302" : "#fa9302"}
            fill={index < rating ? "#fa9302" : "none"}
            strokeWidth={1}
            className="cursor-pointer"
          />
        ))}
      </div>
    );
  };

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Reviews</h2>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div key={index} className="review mb-4">
            {/* Render the profile photo */}
            {review.profile_photo && (
              <img
                src={review.profile_photo}
                alt={`${review.customer_name}'s profile photo`}
                className="w-12 h-12 rounded-full"
              />
            )}
            <p><strong>User:</strong> {review.customer_name}</p>
            <p><strong>Time:</strong> {new Date(review.time).toLocaleString()}</p>
            <p><strong>Rating:</strong> {renderStars(review.review)}</p>
            <p><strong>Comment:</strong> {review.comment}</p>
          </div>
        ))
      ) : (
        <p>No reviews available.</p>
      )}
    </div>
  );
};

export default SingleProductReviews;
