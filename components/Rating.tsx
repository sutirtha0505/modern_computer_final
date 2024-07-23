import React, { useState } from "react";
import { Star } from "lucide-react";

interface RatingProps {
  onRatingChange: (rating: number) => void;
}

const Rating: React.FC<RatingProps> = ({ onRatingChange }) => {
  const [rating, setRating] = useState<number>(0);

  const handleClick = (index: number) => {
    const newRating = index + 1;
    setRating(newRating);
    onRatingChange(newRating);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-sm font-bold">
          Rate your <span className="text-indigo-600">Experience</span>
        </h1>
        <div className="flex justify-center items-center">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              onClick={() => handleClick(index)}
              color={index < rating ? "yellow" : "yellow"}
              fill={index < rating ? "yellow" : "none"}
              strokeWidth={1}
              className="cursor-pointer"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rating;
