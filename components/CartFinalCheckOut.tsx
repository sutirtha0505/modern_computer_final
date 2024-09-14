import { useRouter } from "next/navigation"; // Correct import for App Router
import React, { useEffect, useState } from "react";
import Image from "next/image"; // Import Next.js Image component for optimized image rendering

const CartFinalCheckOut = () => {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [totalSum, setTotalSum] = useState<number>(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cartData = params.get("cart");
    const total = params.get("totalSum");

    if (cartData && total) {
      setCart(JSON.parse(decodeURIComponent(cartData)));
      setTotalSum(Number(total));
    }
  }, []);

  return (
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
            <label htmlFor="amount" className="text-sm font-bold">
              Product Amount:
            </label>
            <p className="text-sm font-bold text-indigo-600">
              &#x20B9;{totalSum}
            </p>
          </div>
          <div className="w-full flex gap-2 justify-center items-center">
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
              className="rounded-md bg-transparent border w-44 outline-none p-2 text-xs"
              placeholder="Coupon code..."
            />
            <button className="rounded-md bg-indigo-500 text-white p-2 text-xs">
              Apply
            </button>
          </div>
          <hr />
          <div className="w-full flex gap-2 justify-center items-center">
            <p className="font-bold text-sm">Total Amount Payable <br />(Including all Taxes):</p>
            <p className="text-sm font-bold text-indigo-600">&#x20B9;{totalSum}</p>
          </div>
          <div className="flex justify-center">
              <button
                className="bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 h-10 w-36 rounded-md text-l hover:text-l hover:font-bold duration-200">
                Pay Here
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CartFinalCheckOut;
