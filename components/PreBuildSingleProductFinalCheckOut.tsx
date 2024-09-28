import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient"; // Ensure to import your Supabase client

const PreBuildSingleProductFinalCheckOut: React.FC = () => {
  const [product, setProduct] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [couponCode, setCouponCode] = useState<string>("");
  const [discountedTotal, setDiscountedTotal] = useState<number>(0);
  const [couponApplied, setCouponApplied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [sellingPrice, setSellingPrice] = useState<number>(0); // State for selling price

  useEffect(() => {
    const storedProduct = localStorage.getItem("checkoutProduct");
    if (storedProduct) {
      const { id, selling_price } = JSON.parse(storedProduct);
      fetchProductDetails(id, selling_price);
    }
  }, []);

  const fetchProductDetails = async (id: string, selling_price: string) => {
    setLoading(true); // Set loading state to true
    try {
      const { data, error } = await supabase
        .from("pre_build")
        .select(
          "build_name, image_urls, build_type, coupon_code, code_equiv_percent"
        )
        .eq("id", id)
        .single();

      if (error) throw error;

      setProduct(data);
      setSellingPrice(Number(selling_price)); // Use the passed selling_price directly

      // Extract the image URL with "_first"
      const firstImageUrl = data.image_urls?.find((img: { url: string }) =>
        img.url.includes("_first")
      )?.url;

      setImageUrl(firstImageUrl || "");
    } catch (error) {
      console.error(
        "Error fetching product details:",
        (error as Error).message
      );
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode === product?.coupon_code) {
      if (!isNaN(sellingPrice)) {
        const discount = sellingPrice * (product.code_equiv_percent / 100);
        setDiscountedTotal(sellingPrice - discount);
        setCouponApplied(true);
        toast.success("Coupon code redeemed successfully!");
      } else {
        toast.error("Invalid selling price");
      }
    } else {
      toast.error("Wrong coupon code");
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while fetching data
  }

  if (!product) {
    return <div>No product found.</div>; // Handle the case where no product data is available
  }

  return (
    <div className="w-full flex justify-center items-center p-6 gap-2 flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex flex-col overflow-y-auto gap-4">
        <div className="flex items-center gap-4 p-4 border rounded-lg bg-slate-800">
          <Image
            src={imageUrl}
            alt={product.build_name}
            width={200}
            height={200}
            className="rounded-lg"
          />
          <div className="flex flex-col gap-2">
            <p className="font-bold text-sm text-center">
              {product.build_name} -{" "}
              <span className="text-indigo-500">
                {product.build_type} Build
              </span>
            </p>
          </div>
          <div className="flex gap-3 px-8 justify-between items-center">
            <p className="text-indigo-500 font-extrabold">
              Total: <span className="text-white">&#x20B9;{sellingPrice}</span>
            </p>
            <p className="font-extrabold text-sm text-indigo-500">
              Quantity: <span className="text-white">1</span>
            </p>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4">
        {/* Additional content goes here */}
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
              &#x20B9;{sellingPrice}
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
              disabled={couponApplied} // Disable input after coupon applied
            />
            <button
              onClick={handleApplyCoupon}
              className={`rounded-md p-2 text-xs ${
                couponApplied
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-500 text-white"
              } `}
              disabled={couponApplied} // Disable button after coupon applied
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
              Total Amount Payable <br />(Including all Taxes):
            </p>
            <p className="text-sm font-bold text-indigo-600">
              {loading ? (
                <span>Loading...</span>
              ) : (
                <span>&#x20B9;{discountedTotal || sellingPrice}</span>
              )}
            </p>
          </div>
          <div className="flex justify-center">
            <button className="bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 h-10 w-36 rounded-md text-l hover:text-l hover:font-bold duration-200">
              Pay Here
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default PreBuildSingleProductFinalCheckOut;
