import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import dayjs from "dayjs";

interface OrderedProduct {
  quantity: number;
  processor_name?: string;
  motherboard_name?: string;
  ram_name?: string;
  ssd_name?: string;
  hdd_name?: string;
  cabinet_name?: string;
  psu_name?: string;
  cooler_name?: string;
  image_url: string;
}

interface Order {
  order_id: number;
  ordered_products: OrderedProduct[];
  expected_delivery_date: string;
  order_status: string;
}

interface OrderedCustomBuildPCProps {
  userId: string;
}

const OrderedCustomBuildPC: React.FC<OrderedCustomBuildPCProps> = ({
  userId,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);

      try {
        // Fetch orders for the user
        const { data: ordersData, error: ordersError } = await supabase
          .from("order_table_custom_build")
          .select(
            "order_id, ordered_products, expected_delivery_date, order_status"
          )
          .eq("customer_id", userId);

        if (ordersError) {
          console.error("Error fetching orders:", ordersError);
          return;
        }

        setOrders(ordersData || []);
      } catch (error) {
        console.error("Unexpected error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (orders.length === 0) {
    return <div>No orders found.</div>;
  }

  const renderProduct = (product: OrderedProduct) => {
    const productDetails: { [key: string]: string | undefined } = {
      Processor: product.processor_name,
      Motherboard: product.motherboard_name,
      RAM: product.ram_name,
      SSD: product.ssd_name,
      HDD: product.hdd_name,
      Cabinet: product.cabinet_name,
      PSU: product.psu_name,
      Cooler: product.cooler_name,
    };

    return Object.entries(productDetails).map(([key, name], index) => {
      if (name && product.image_url) {
        return (
          <li key={index} className="flex gap-4 items-center justify-start">
            <img
              src={product.image_url}
              alt={`${key} Image`}
              className="w-16 h-16 object-cover"
            />
            <p className="text-sm font-semibold hover:text-indigo-600 text-left">
              {key}: {name} x {product.quantity}
            </p>
          </li>
        );
      }
      return null;
    });
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <h1 className="text-lg font-bold">
        Your <span className="text-indigo-600">Ordered Custom Build PC</span>
      </h1>
      <div className="flex flex-col justify-center items-center w-full p-16 gap-5">
        {orders.map((order) => (
          <div
            key={order.order_id}
            className="flex flex-col border p-4 rounded-md bg-slate-800 custom-backdrop-filter gap-4"
          >
            <h2 className="font-extrabold text-center">
              Order: <span className="text-indigo-600">{order.order_id}</span>
            </h2>

            <div className="w-full flex items-center justify-center gap-10">
              <ol className="w-[50%] list-decimal flex flex-col justify-start items-center">
                {order.ordered_products.map((product, idx) => (
                  <li
                    key={idx}
                    className="flex justify-start items-center hover:text-indigo-600 cursor-pointer"
                  >
                    {renderProduct(product)}
                  </li>
                ))}
              </ol>
              <div className="w-[25%] flex flex-col justify-center items-center gap-4">
                <div className="flex gap-2 justify-center items-center">
                  <img
                    src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/Logo_Social/delivery-truck.png"
                    alt=""
                    className="w-8 h-8"
                  />
                  <p className="text-sm font-semibold text-indigo-600">
                    Expected Delivery Date:
                  </p>
                </div>
                <p className="text-sm font-semibold">
                  {dayjs(order.expected_delivery_date).format(
                    "dddd, MMMM D, YYYY"
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderedCustomBuildPC;
