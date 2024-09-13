import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation"; // Import useRouter

interface CustomerDetailsProps {
  userId: string; // Define the type for userId
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({ userId }) => {
  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const { data, error } = await supabase
          .from("profile")
          .select(
            "customer_name, customer_house_no, customer_house_street, customer_house_city, customer_house_pincode, customer_house_landmark, profile_photo, email, phone_no"
          )
          .eq("id", userId) // Match userId with profile id
          .single(); // Fetch a single row if matched

        if (error) {
          console.error("Error fetching customer details:", error);
          return;
        }

        // Check if any of the required fields are missing
        if (
          !data.customer_name ||
          !data.customer_house_no ||
          !data.customer_house_street ||
          !data.customer_house_city ||
          !data.customer_house_pincode ||
          !data.customer_house_landmark ||
          !data.email ||
          !data.phone_no ||
          !data.profile_photo // Check if profile_photo exists in the returned data
        ) {
          router.push("/profile/[id]"); // Redirect to /profile
        } else {
          setCustomerDetails(data);
        }
      } catch (error) {
        console.error("Error fetching customer details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [userId, router]);

  if (loading) {
    return <div>Loading customer details...</div>;
  }

  if (!customerDetails) {
    return <div>No customer details found.</div>;
  }

  return (
    <div className="w-full p-8 flex justify-center items-center">
      <div className="w-72 bg-white/50 custom-backdrop-filter p-4 rounded-md flex flex-col justify-between items-center gap-2">
        <img
          src={customerDetails.profile_photo}
          alt="Customer Profile"
          className="w-24 h-24 rounded-full"
        />
        <h1 className="text-lg font-bold">Order for</h1>
        <h1 className="text-xl font-bold text-indigo-500">
          {customerDetails.customer_name}
        </h1>
        <div className="w-full flex gap-3 justify-center items-center">
          <label
            htmlFor="address"
            className="text-sm font-bold text-indigo-500"
          >
            Address:
          </label>
          <p className="text-sm font-light">
            {customerDetails.customer_house_no},{" "}
            {customerDetails.customer_house_street},{" "}
            {customerDetails.customer_house_city},{" "}
            {customerDetails.customer_house_pincode}{" "}
          </p>
        </div>
        <div className="w-full flex gap-3 justify-center items-center">
          <label
            htmlFor="landmark"
            className="text-sm font-bold text-indigo-500"
          >
            Landmark:
          </label>
          <p className="text-sm font-light">
            {customerDetails.customer_house_landmark}
          </p>
        </div>
        <div className="w-full flex gap-3 justify-center items-center">
          <img
            src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/Logo_Social/email.png"
            alt=""
            className="w-4 h-4"
          />
          <label htmlFor="email" className="text-sm font-bold text-indigo-500">
            Email:
          </label>
          <p className="text-sm font-light break-all">
            {customerDetails.email}
          </p>
        </div>
        <div className="w-full flex gap-3 justify-center items-center">
          <img
            src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/Logo_Social/call.png"
            alt=""
            className="w-4 h-4"
          />
          <label htmlFor="phone" className="text-sm font-bold text-indigo-500">
            Phone:
          </label>
          <p className="text-sm font-light">{customerDetails.phone_no}</p>
        </div>
      </div>
      {/* <h2>Customer Details</h2>
      <p><strong>Name:</strong> {customerDetails.customer_name}</p>
      <p><strong>House No:</strong> {customerDetails.customer_house_no}</p>
      <p><strong>Street:</strong> {customerDetails.customer_house_street}</p>
      <p><strong>City:</strong> {customerDetails.customer_house_city}</p>
      <p><strong>Pincode:</strong> {customerDetails.customer_house_pincode}</p>
      <p><strong>Landmark:</strong> {customerDetails.customer_house_landmark}</p>
      <img src={customerDetails.profile_photo} alt="Customer Profile" /> */}
    </div>
  );
};

export default CustomerDetails;
