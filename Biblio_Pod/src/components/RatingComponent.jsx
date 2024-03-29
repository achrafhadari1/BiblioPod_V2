import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import axios from "../api/axios";

export const RatingComponent = ({
  bookId,
  currentRating,
  onRatingChange,
  userId,
}) => {
  const [rating, setRating] = useState(currentRating);
  const [hover, setHover] = useState(null);

  const handleRatingChange = async (newRating) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `/books/${bookId}/rate`,
        { rating: newRating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data);
      setRating(newRating); // Update local rating state
      onRatingChange(newRating); // Update rating in parent component
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };
  // Update rating when the currentRating prop changes
  useEffect(() => {
    setRating(currentRating);
  }, [currentRating]);

  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, index) => {
        const currentRatingValue = index + 1;
        return (
          <label key={index}>
            {" "}
            <input
              type="radio"
              name="rating"
              value={currentRatingValue}
              onClick={() => handleRatingChange(currentRatingValue)}
            />
            <FaStar
              color={
                currentRatingValue <= (hover || rating) ? "#ffc108" : "#e4e5e9"
              }
              onMouseEnter={() => setHover(currentRatingValue)}
              onMouseLeave={() => setHover(null)}
              className="star"
              size={30}
            />
          </label>
        );
      })}
    </div>
  );
};
