"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Star } from 'lucide-react'; // Importing the Star icon

interface Review {
  UX_star: number;
  comment: string;
  email: string; // Assuming email is unique for each user
}

const EditReview: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [expandedReviewIndex, setExpandedReviewIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('profile')
        .select('UX_star, comment, email')
        .not('UX_star', 'is', null);

      if (error) {
        console.error('Error fetching reviews:', error);
      } else {
        console.log('Fetched data:', data); // Debugging line
        setReviews(data || []);
      }
    };

    fetchReviews();
  }, []);

  const toggleExpand = (index: number) => {
    setExpandedReviewIndex(expandedReviewIndex === index ? null : index);
  };

  const renderStars = (starCount: number) => {
    const totalStars = 5; // Assuming a 5-star rating system
    return (
      <>
        {[...Array(starCount)].map((_, index) => (
          <Star key={index} className="text-yellow-500 fill-current" />
        ))}
        {[...Array(totalStars - starCount)].map((_, index) => (
          <Star key={index} className="text-gray-300 fill-current" />
        ))}
      </>
    );
  };

  return (
    <div>
      {reviews.map((review, index) => (
        <div key={index} className="review-box">
          <div className="star-box">
            {renderStars(review.UX_star)}
          </div>
          <div className="email-box">Email: {review.email}</div>
          <div className="comment-box">
            {expandedReviewIndex === index ? (
              <span>{review.comment}</span>
            ) : (
              <span>
                {review.comment.substring(0, 50)}
                {review.comment.length > 50 && (
                  <>
                    ...{' '}
                    <button
                      onClick={() => toggleExpand(index)}
                      className="read-more-btn"
                    >
                      Read more
                    </button>
                  </>
                )}
              </span>
            )}
            {expandedReviewIndex === index && (
              <button
                onClick={() => toggleExpand(index)}
                className="read-less-btn"
              >
                Show less
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EditReview;
