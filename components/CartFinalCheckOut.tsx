import { useRouter } from "next/navigation"; // Correct import for App Router
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image"; // Import Next.js Image component for optimized image rendering
import { toast, ToastContainer } from "react-toastify"; // To display toasts
import "react-toastify/dist/ReactToastify.css";

const CartFinalCheckOut = () => {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [totalSum, setTotalSum] = useState<number>(0);
  const [couponCode, setCouponCode] = useState<string>(""); // Capture coupon code input
  const [discountedTotal, setDiscountedTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false); // Track loading state
  const [couponApplied, setCouponApplied] = useState<boolean>(false); // Track if coupon has been applied

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cartData = params.get("cart");

    if (cartData) {
      const parsedCart = JSON.parse(decodeURIComponent(cartData));
      setCart(parsedCart);

      // Calculate total sum directly from the cart
      const total = parsedCart.reduce(
        (sum: number, product: any) =>
          sum + product.product_SP * product.quantity,
        0
      );
      setTotalSum(total);
      setDiscountedTotal(total); // Initially set discounted total as total sum
    }
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast.error("Please enter a coupon code.");
      return;
    }

    // Get product IDs from the cart
    const productIds = cart.map((item) => item.product_id);
    
    // Query Supabase for products that match the product IDs from the cart
    const { data: products, error } = await supabase
      .from("products")
      .select("product_id, coupon_code, code_equiv_percent")
      .in("product_id", productIds);

    if (error) {
      toast.error("Failed to validate coupon code.");
      return;
    }

    // Find products with the entered coupon code
    const matchedProducts = products.filter(
      (product) => product.coupon_code === couponCode
    );

    if (matchedProducts.length === 0) {
      toast.error("Wrong code, try again.");
      setCouponCode(""); // Reset input field
      return;
    }

    // Create a map of product ID to its discount percentage
    const discountMap = matchedProducts.reduce((acc, product) => {
      acc[product.product_id] = product.code_equiv_percent;
      return acc;
    }, {} as Record<number, number>);

    // Simulate lazy loading of the discounted total calculation
    setLoading(true);
    setTimeout(() => {
      const newTotal = cart.reduce((sum: number, product: any) => {
        const discountPercent = discountMap[product.product_id] || 0; 
        const discountedPrice =
          product.product_SP - (product.product_SP * discountPercent) / 100;
        const finalPrice = discountPercent > 0 ? discountedPrice : product.product_SP;
        return sum + finalPrice * product.quantity;
      }, 0);

      setDiscountedTotal(newTotal);
      setLoading(false);
      setCouponApplied(true); // Mark coupon as applied
      toast.success("Coupon code is redeemed successfully!");
    }, 500); // Adjust the timeout as needed for lazy loading simulation
  };

  return (
    <>
      <div className="w-full flex justify-center items-center p-6 gap-2 flex-col md:flex-row">
        <div className="w-full md:w-1/2 flex flex-col overflow-y-auto gap-4">
          {cart.map((product: any, index: number) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 border rounded-lg bg-slate-800"
            >
              {/* Display the product image */}
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.product_name}
                  width={100}
                  height={100}
                  className="rounded-lg"
                />
              ) : (
                <p>No image available</p>
              )}

              {/* Display product details */}
              <div>
                <p className="font-bold text-sm">{product.product_name}</p>
                <p>Quantity: {product.quantity}</p>
                <p className="text-indigo-500 font-extrabold">
                  Total: &#x20B9;
                  {(product.product_SP * product.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4">
          <div className="w-96 bg-slate-800 gap-5 p-4 flex flex-col justify-between items-center rounded-md">
            <h1 className="text-2xl font-bold">
              Order <span className="text-indigo-500">Summary</span>
            </h1>
            <div className="w-full flex gap-2 justify-center items-center">
            <img src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/Logo_Social/money.png" alt="" className="w-8 h-8" />
              <label htmlFor="amount" className="text-sm font-bold">
                Product Amount:
              </label>
              <p className="text-sm font-bold text-indigo-600">
                &#x20B9;{totalSum.toFixed(2)}
              </p>
            </div>
            <div className="w-full flex gap-2 justify-center items-center">
            <img src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/Logo_Social/fast-delivery.png" alt="" className="w-8 h-8"/>
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
                className={`rounded-md bg-transparent border w-44 outline-none p-2 text-xs ${couponApplied ? 'bg-gray-600 cursor-not-allowed' : ''}`}
                placeholder="Coupon code..."
                disabled={couponApplied} // Disable input after coupon applied
              />
              <button
                onClick={handleApplyCoupon}
                className={`rounded-md p-2 text-xs ${couponApplied ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-500 text-white'} `}
                disabled={couponApplied} // Disable button after coupon applied
              >
                {couponApplied ? "Applied" : "Apply"}
              </button>
            </div>
            <hr />
            <div className="w-full flex gap-2 justify-center items-center">
              <img src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/Logo_Social/cashless-payment.png" alt="" className="w-6 h-6" />
              <p className="font-bold text-sm">
                Total Amount Payable <br />(Including all Taxes):
              </p>
              <p className="text-sm font-bold text-indigo-600">
                {loading ? (
                  <span>Loading...</span> // Placeholder while loading
                ) : (
                  <span>&#x20B9;{discountedTotal.toFixed(2)}</span>
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
      </div>
      <ToastContainer />
    </>
  );
};

export default CartFinalCheckOut;
