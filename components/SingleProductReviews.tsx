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

const SingleProductReviews: React.FC<SingleProductReviewsProps> = ({
  productId,
}) => {
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
                customer_name: profileData?.customer_name || "Non-Verified User",
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

  // Function to calculate and format the time difference
  const renderRelativeTime = (reviewTime: string) => {
    const now = new Date();
    const reviewDate = new Date(reviewTime);
    const timeDiff = now.getTime() - reviewDate.getTime(); // Difference in milliseconds

    const minutes = Math.floor(timeDiff / (1000 * 60));
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (minutes < 1) {
      return "Just now";
    } else if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col items-start justify-start w-full px-4 py-0 md:px-24">
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div
            key={index}
            className="flex flex-col items-start justify-start mb-4 w-full bg-gray-700 rounded-md p-4"
          >
            {/* Render the profile photo */}
            <div className="flex justify-start items-center gap-4">
              {review.profile_photo && (
                <img
                  src={review.profile_photo}
                  alt={`${review.customer_name}'s profile photo`}
                  className="w-12 h-12 rounded-full"
                />
              )}
              <p className="text-sm">
                <span className="text-indigo-500 font-bold">
                  {review.customer_name}
                </span>
              </p>
            </div>
            <div className="flex gap-4 justify-start items-center">
              <div className="mt-2">{renderStars(review.review)}</div>
              <p className="text-xs">
                <span className="font-bold text-indigo-500">Commented: </span>{" "}
                {renderRelativeTime(review.time)}
              </p>
            </div>

            <p className="text-sm mt-2">{review.comment}</p>
          </div>
        ))
      ) : (
        <div className="w-full px-20 py-0 justify-center items-center flex gap-2">
          <img
            src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/Logo_Social/no-comment.png"
            alt=""
            className="w-20 h-20 opacity-85"
          />

          <p className="text-sm text-center">
            No reviews found for this product.
          </p>
        </div>
      )}
    </div>
  );
};

export default SingleProductReviews;
