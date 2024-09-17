import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "@/lib/supabaseClient";

interface Product {
  name: string;
  price: number;
  image: string;
}

const CustomBuildSingleProductFinalCheckOut = () => {
  const searchParams = useSearchParams();

  // Extract parameters
  const totalPrice = Number(searchParams.get("totalPrice")) || 0; // Convert totalPrice to number safely
  const processor = JSON.parse(
    searchParams.get("processor") || "[]"
  ) as Product[];
  const motherboard = JSON.parse(
    searchParams.get("motherboard") || "[]"
  ) as Product[];
  const ram = JSON.parse(searchParams.get("ram") || "[]") as Product[];
  const ramQuantity = Number(searchParams.get("ramQuantity")) || 1;
  const ssd = JSON.parse(searchParams.get("ssd") || "[]") as Product[];
  const graphicsCard = JSON.parse(
    searchParams.get("graphicsCard") || "[]"
  ) as Product[];
  const cabinet = JSON.parse(searchParams.get("cabinet") || "[]") as Product[];
  const psu = JSON.parse(searchParams.get("psu") || "[]") as Product[];
  const hdd = JSON.parse(searchParams.get("hdd") || "[]") as Product[];
  const cooler = JSON.parse(searchParams.get("cooler") || "[]") as Product[];
  const [couponCode, setCouponCode] = useState<string>("");
  const [discountedTotal, setDiscountedTotal] = useState<number>(0);
  const [couponApplied, setCouponApplied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [product, setProduct] = useState<any>(null);
  const customBuildId = searchParams.get("customBuildId") || '';

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!customBuildId) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("custom_build")
          .select(
            "processor, build_type, coupon_code, code_equiv_percent"
          )
          .eq("id", customBuildId)
          .single();

        if (error) throw error;

        setProduct(data);
      } catch (error) {
        console.error(
          "Error fetching product details:",
          (error as Error).message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [customBuildId]);

  const handleApplyCoupon = () => {
    if (couponCode === product?.coupon_code) {
      if (!isNaN(totalPrice)) {
        const discount = totalPrice * (product.code_equiv_percent / 100);
        setDiscountedTotal(totalPrice - discount);
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
    return <div>Loading...</div>;
  }
  

  return (
    <div className="w-full flex justify-center items-center p-6 gap-2 flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex flex-col overflow-y-auto gap-4">
        <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-slate-800">
          <h1 className="text-xl font-bold">Your Configuration</h1>
          <div className="flex justify-center gap-4 items-center w-full">
            <img
              src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/pre-build/processor/processor.png"
              className="w-6 h-6"
              alt="Default Image"
            />
            <h2>Processor:</h2>
            {processor.map((item, index) => (
              <div
                key={index}
                className="flex gap-2 flex-row-reverse bg-gray-600 border p-2 rounded-md "
              >
                <p className="text-xs font-bold">{item.name.slice(0, 10)}...</p>
                <img
                  src={item.image}
                  alt={item.name.slice(0, 10)}
                  className="rounded-full w-4 h-4"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 items-center w-full">
            <img
              src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/pre-build/motherboard/motherboard.png"
              className="w-6 h-6"
              alt="Default Image"
            />
            <h2>Motherboard:</h2>
            {motherboard.map((item, index) => (
              <div
                key={index}
                className="flex gap-2 flex-row-reverse bg-gray-600 border p-2 rounded-md "
              >
                <p className="text-xs font-bold">{item.name.slice(0, 10)}...</p>
                <img
                  src={item.image}
                  alt={item.name.slice(0, 10)}
                  className="rounded-full w-4 h-4"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 items-center w-full">
            <img
              src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/pre-build/RAM/RAM.png"
              className="w-6 h-6"
              alt="Default Image"
            />
            <h2>RAM:</h2>
            {ram.map((item, index) => (
              <div
                key={index}
                className="flex gap-2 flex-row-reverse bg-gray-600 border p-2 rounded-md "
              >
                <p className="text-xs font-bold">{item.name.slice(0, 10)}...</p>
                <img
                  src={item.image}
                  alt={item.name.slice(0, 10)}
                  className="rounded-full w-4 h-4"
                />
              </div>
            ))}
            <p>X {ramQuantity}</p>
          </div>

          <div className="flex justify-center gap-4 items-center w-full">
            <img
              src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/pre-build/SSD/ssd.png"
              className="w-6 h-6"
              alt="Default Image"
            />
            <h2>SSD:</h2>
            {ssd.map((item, index) => (
              <div
                key={index}
                className="flex gap-2 flex-row-reverse bg-gray-600 border p-2 rounded-md "
              >
                <p className="text-xs font-bold">{item.name.slice(0, 10)}...</p>
                <img
                  src={item.image}
                  alt={item.name.slice(0, 10)}
                  className="rounded-full w-4 h-4"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 items-center w-full">
            <img
              src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/pre-build/graphics%20card/graphic_card.png"
              className="w-6 h-6"
              alt="Default Image"
            />
            <h2>Graphics Card:</h2>
            {graphicsCard.map((item, index) => (
              <div
                key={index}
                className="flex gap-2 flex-row-reverse bg-gray-600 border p-2 rounded-md "
              >
                <p className="text-xs font-bold">{item.name.slice(0, 10)}...</p>
                <img
                  src={item.image}
                  alt={item.name.slice(0, 10)}
                  className="rounded-full w-4 h-4"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 items-center w-full">
            <img
              src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/pre-build/cabinet/high_tower.png"
              className="w-6 h-6"
              alt="Default Image"
            />
            <h2>Cabinet:</h2>
            {cabinet.map((item, index) => (
              <div
                key={index}
                className="flex gap-2 flex-row-reverse bg-gray-600 border p-2 rounded-md "
              >
                <p className="text-xs font-bold">{item.name.slice(0, 10)}...</p>
                <img
                  src={item.image}
                  alt={item.name.slice(0, 10)}
                  className="rounded-full w-4 h-4"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 items-center w-full">
            <img
              src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/pre-build/SMPS/power_supply.png"
              className="w-6 h-6"
              alt="Default Image"
            />
            <h2>Power Supply:</h2>
            {psu.map((item, index) => (
              <div
                key={index}
                className="flex gap-2 flex-row-reverse bg-gray-600 border p-2 rounded-md "
              >
                <p className="text-xs font-bold">{item.name.slice(0, 10)}...</p>
                <img
                  src={item.image}
                  alt={item.name.slice(0, 10)}
                  className="rounded-full w-4 h-4"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 items-center w-full">
            <img
              src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/cbpc_intel/INTEL_Custom.png"
              className="w-6 h-6"
              alt="Default Image"
            />
            <h2>Hard Disk:</h2>
            {hdd.map((item, index) => (
              <div
                key={index}
                className="flex gap-2 flex-row-reverse bg-gray-600 border p-2 rounded-md "
              >
                <p className="text-xs font-bold">{item.name.slice(0, 10)}...</p>
                <img
                  src={item.image}
                  alt={item.name.slice(0, 10)}
                  className="rounded-full w-4 h-4"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 items-center w-full">
            <img
              src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/pre-build/hard%20disk/hard_disk.png"
              className="w-6 h-6"
              alt="Default Image"
            />
            <h2>Cooler:</h2>
            {cooler.map((item, index) => (
              <div
                key={index}
                className="flex gap-2 flex-row-reverse bg-gray-600 border p-2 rounded-md "
              >
                <p className="text-xs font-bold">{item.name.slice(0, 10)}...</p>
                <img
                  src={item.image}
                  alt={item.name.slice(0, 10)}
                  className="rounded-full w-4 h-4"
                />
              </div>
            ))}
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
              &#x20B9;{totalPrice}
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
                <span>&#x20B9;{discountedTotal || totalPrice}</span>
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

export default CustomBuildSingleProductFinalCheckOut;
