import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartSingleProductFinalCheckOut = () => {
  const searchParams = useSearchParams();
  const [productId, setProductId] = useState<string | null>(null);
  const [productData, setProductData] = useState<any>(null);
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
          // Process product_image to find the URL containing '_first'
          const productImage = data.product_image.find((img: { url: string }) =>
            img.url.includes("_first")
          );
          setProductData({ ...data, product_image: productImage?.url || "" });
          setDiscountedTotal(data.product_SP); // Initially set the total to product_SP
        }
      }
    };

    fetchProductDetails();
  }, [productId]);

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

  if (!productData) {
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
                <span>&#x20B9;{discountedTotal}</span>
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

export default CartSingleProductFinalCheckOut;
