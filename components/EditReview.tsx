"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Review {
  UX_star: number;
  comment: string;
}

const EditReview: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('profile')
        .select('UX_star, comment')
        .not('UX_star', 'is', null)

      if (error) {
        console.error('Error fetching reviews:', error);
      } else {
        console.log('Fetched data:', data); // Debugging line
        setReviews(data || []);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div>
      {reviews.map((review, index) => (
        <div key={index} className="review-box">
          <div className="star-box">Rating: {review.UX_star}</div>
          <div className="comment-box">Comment: {review.comment}</div>
        </div>
      ))}
    </div>
  );
};

export default EditReview;
