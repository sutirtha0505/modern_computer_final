"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import Toast styles

const UserProfile = () => {
  const params = useParams();
  const { id } = params;
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter(); // Hook for navigation

  useEffect(() => {
    const fetchUserData = async () => {
      if (id) {
        try {
          // Fetching profile data from the profile table
          const { data: profileData, error: profileError } = await supabase
            .from("profile")
            .select("email")
            .eq("id", id)
            .single();

          if (profileError) {
            console.error("Error fetching profile data:", profileError);
          } else {
            setEmail(profileData?.email || null);
          }

          // Fetching user metadata from the auth table
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError) {
            console.error("Error fetching user data:", userError);
          } else if (user) {
            setName(user.user_metadata.name);
          }
        } catch (error) {
          console.error("Unexpected error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [id]);

  const handleSave = async () => {
    if (id && name) {
      try {
        const { error } = await supabase
          .from("profile")
          .update({ customer_name: name })
          .eq("id", id);

        if (error) {
          console.error("Error updating profile:", error);
          toast.error("Error updating information. Please try again.");
        } else {
          toast.success("Your information has been updated successfully.");

          // Redirect to homepage after 3 seconds
          setTimeout(() => {
            router.push("/"); // Adjust the homepage route as needed
          }, 3000);
        }
      } catch (error) {
        console.error("Unexpected error updating profile:", error);
        toast.error("Unexpected error occurred. Please try again.");
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>User Profile</h1>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="text"
          value={email || ''}
          readOnly
          className="border bg-transparent text-white rounded p-2 mb-4 w-full"
        />
      </div>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          value={name || ''}
          onChange={(e) => setName(e.target.value)}
          className="border bg-transparent text-white rounded p-2 mb-4 w-full"
        />
      </div>
      <button
        onClick={handleSave}
        className="bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600"
      >
        Save
      </button>
      <ToastContainer />
    </div>
  );
};

export default UserProfile;
