import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Razorpay from "razorpay";
import dayjs from "dayjs"; // For date manipulation

interface CartSingleProductFinalCheckOutProps {
  userId: string; // Explicitly typing the userId as a string
}

const CartSingleProductFinalCheckOut: React.FC<CartSingleProductFinalCheckOutProps> = ({ userId }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [productId, setProductId] = useState<string | null>(null);
  const [productData, setProductData] = useState<any>(null);
  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const [couponCode, setCouponCode] = useState<string>("");
  const [discountedTotal, setDiscountedTotal] = useState<number>(0);
  const [couponApplied, setCouponApplied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const product_id = searchParams.get("product_id");
    if (product_id) {
      setProductId(product_id);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (productId) {
        const { data, error } = await supabase
          .from("products")
          .select(
            "product_image, product_name, product_SP, coupon_code, code_equiv_percent"
          )
          .eq("product_id", productId)
          .single();

        if (error) {
          console.error("Error fetching product:", error);
        } else {
          const productImage = data.product_image.find((img: { url: string }) =>
            img.url.includes("_first")
          );
          setProductData({ ...data, product_image: productImage?.url || "" });
          setDiscountedTotal(data.product_SP);
        }
      }
    };

    fetchProductDetails();
  }, [productId]);

  // Load the Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      console.log("Razorpay script loaded");
    };
    script.onerror = () => {
      console.error("Error loading Razorpay script");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const { data, error } = await supabase
          .from("profile")
          .select(
            "customer_name, customer_house_no, customer_house_street, customer_house_city, customer_house_pincode, customer_house_landmark, profile_photo, email, phone_no"
          )
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error fetching customer details:", error);
          return;
        }

        if (
          !data.customer_name ||
          !data.customer_house_no ||
          !data.customer_house_street ||
          !data.customer_house_city ||
          !data.customer_house_pincode ||
          !data.customer_house_landmark ||
          !data.email ||
          !data.phone_no ||
          !data.profile_photo
        ) {
          router.push(`/profile/${userId}`);
        } else {
          setCustomerDetails(data);
        }
      } catch (error) {
        console.error("Error fetching customer details:", error);
      }
    };

    if (userId) {
      fetchCustomerDetails();
    }
  }, [userId, router]);

  const handleApplyCoupon = () => {
    if (couponCode === productData.coupon_code) {
      const discount = productData.product_SP * (productData.code_equiv_percent / 100);
      setDiscountedTotal(productData.product_SP - discount);
      setCouponApplied(true);
      toast.success("Coupon code redeemed successfully!");
    } else {
      toast.error("Wrong coupon code");
    }
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: discountedTotal,
          currency: "INR",
        }),
      });

      const data = await response.json();

      if (!window.Razorpay) {
        console.error("Razorpay is not loaded");
        toast.error("Payment gateway is not available. Please try again.");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        app_name: "Modern Computer",
        description: productData.product_name,
        image: "https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/About/Logo.gif",
        order_id: data.id,
        handler: async (response: any) => {
          toast.success("Payment successful!");
          console.log("Payment Response:", response);

          // Save order in database
          await saveOrder(response.razorpay_order_id, response.razorpay_payment_id);
        },
        prefill: {
          name: customerDetails.customer_name,
          email: customerDetails.email,
          contact: customerDetails.phone_no,
        },
        notes: {
          address: `${customerDetails.customer_house_no}, ${customerDetails.customer_house_street}, ${customerDetails.customer_house_city}, ${customerDetails.customer_house_pincode}`,
        },
        theme: {
          color: "#6366F1",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error during payment:", error);
      toast.error("Payment failed!");
    } finally {
      setLoading(false);
    }
  };

  const saveOrder = async (order_id: string, payment_id: string) => {
    const expectedDeliveryDate = dayjs().add(7, "day").format("YYYY-MM-DD"); // Calculate expected delivery date

    const { error } = await supabase.from("order_table").insert([
      {
        order_id: order_id,
        payment_id: payment_id,
        customer_id: userId,
        payment_amount: discountedTotal,
        ordered_products: [productId], // Save product_id in array
        order_address: `${customerDetails.customer_house_no}, ${customerDetails.customer_house_street}, ${customerDetails.customer_house_city}, ${customerDetails.customer_house_pincode}`,
        expected_delivery_date: expectedDeliveryDate,
        created_at: new Date(), // Set current timestamp
      },
    ]);

    if (error) {
      console.error("Error saving order:", error);
      toast.error("Failed to save the order. Please try again.");
    } else {
      toast.success("Order saved successfully!");
    }
  };

  if (!productData || !customerDetails) {
    return <div>Loading...</div>;
  }
  return (
    <div className="w-full flex justify-center items-center p-6 gap-2 flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex flex-col overflow-y-auto gap-4">
        <div className="flex items-center gap-4 p-4 border rounded-lg bg-slate-800">
          {productData.product_image && (
            <Image
              src={productData.product_image}
              alt={productData.product_name}
              width={200}
              height={200}
              className="rounded-lg"
            />
          )}
          <div className="flex flex-col gap-2">
            <p className="font-bold text-sm">{productData.product_name}</p>
            <div className="flex gap-3 px-8 justify-between items-center">
              <p className="text-indigo-500 font-extrabold">
                Total:{" "}
                <span className="text-white">
                  &#x20B9;{productData.product_SP}
                </span>
              </p>
              <p className="font-extrabold text-sm text-indigo-500">
                Quantity: <span className="text-white">1</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4">
        <div className="w-96 bg-slate-800 gap-5 p-4 flex flex-col justify-between items-center rounded-md">
          <h1 className="text-2xl font-bold">
            Order <span className="text-indigo-500">Summary</span>
          </h1>
          <div className="w-full flex gap-2 justify-center items-center">
            <img
              src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/Logo_Social/money.png"
              alt=""
              className="w-8 h-8"
            />
            <label htmlFor="amount" className="text-sm font-bold">
              Product Amount:
            </label>
            <p className="text-sm font-bold text-indigo-600">
              &#x20B9;{productData.product_SP}
            </p>
          </div>
          <div className="w-full flex gap-2 justify-center items-center">
            <img
              src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/Logo_Social/fast-delivery.png"
              alt=""
              className="w-8 h-8"
            />
            <label htmlFor="amount" className="text-sm font-bold">
              Delivery Amount:
            </label>
            <p className="text-sm font-bold text-indigo-600">&#x20B9;0</p>
          </div>
          <div className="w-full flex gap-2 justify-center items-center">
            <img
              src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/Logo_Social/voucher.png"
              alt=""
              className="w-6 h-6"
            />
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className={`rounded-md bg-transparent border w-44 outline-none p-2 text-xs ${
                couponApplied ? "bg-gray-600 cursor-not-allowed" : ""
              }`}
              placeholder="Coupon code..."
              disabled={couponApplied}
            />
            <button
              onClick={handleApplyCoupon}
              className={`rounded-md p-2 text-xs ${
                couponApplied
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-500 text-white"
              } `}
              disabled={couponApplied}
            >
              {couponApplied ? "Applied" : "Apply"}
            </button>
          </div>
          <hr />
          <div className="w-full flex gap-2 justify-center items-center">
            <img
              src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/Logo_Social/cashless-payment.png"
              alt=""
              className="w-6 h-6"
            />
            <p className="font-bold text-sm">
              Total Amount Payable <br />
              (Including all Taxes):
            </p>
            <p className="text-sm font-bold text-indigo-600">
              {loading ? (
                <span>Loading...</span>
              ) : (
                <span>&#x20B9;{discountedTotal}</span>
              )}
            </p>
          </div>
          <div className="flex justify-center">
            <button
              className="bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 h-10 w-36 rounded-md text-l hover:text-l hover:font-bold duration-200"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? "Processing..." : "Pay Here"}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CartSingleProductFinalCheckOut;