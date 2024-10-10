"use client";
// components/CharacterCounterInput.tsx
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CharacterCounterInputProps {
  user: any;
  rating: number;
  onResetRating: () => void;
}

const CharacterCounterInputForproduct: React.FC<CharacterCounterInputProps> = ({
  user,
  rating,
  onResetRating,
}) => {
  const [inputValue, setInputValue] = useState("");
  const maxChars = 300;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    if (value.length <= maxChars) {
      setInputValue(value);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("User:", user); // Debug: Log the user object

    if (!user) {
      toast.error("You Forgot to Log In. Do it Right now.");
      return;
    }

    try {
      const { error } = await supabase
        .from("profile")
        .update({ comment: inputValue, UX_star: rating })
        .eq("id", user.id);

      if (error) {
        console.error("Supabase Error:", error); // Debug: Log any Supabase errors
        toast.error("Error adding comment: " + error.message);
      } else {
        toast.success("Thanks for your feedback.");
        setInputValue("");
        onResetRating(); // Reset the rating
      }
    } catch (error: any) {
      console.error("Catch Error:", error); // Debug: Log any caught errors
      toast.error(
        "Error adding comment: " + (error.message || "Unknown error"),
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative gap-4 w-full p-10 md:p-4 justify-center items-center h-full flex flex-col"
    >
      <div className="relative h-full w-full justify-center items-center flex flex-col">
        <textarea
          value={inputValue}
          onChange={handleChange}
          rows={8}
          className="w-full h-full p-2 bg-transparent border-2 border-indigo-600 rounded-md resize-none outline-none focus:shadow-lg focus:shadow-indigo-600"
          placeholder="Type here ..."
          required
        />
        <div className="absolute bottom-2 right-2 text-gray-500 text-sm">
          {inputValue.length}/{maxChars}
        </div>
      </div>
      <button
        type="submit"
        className="bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 px-4 py-1 rounded-md text-l hover:text-l hover:font-bold duration-200"
      >
        Submit
      </button>
    </form>
  );
};

export default CharacterCounterInputForproduct;
