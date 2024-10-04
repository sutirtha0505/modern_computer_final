import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import dayjs from "dayjs";
import { CircleX } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  order_id: string;
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
              <span className="font-bold text-indigo-500 text-lg">{key}</span>:{" "}
              {name}... {product.quantity > 1 && `x ${product.quantity}`}
            </p>
          </li>
        );
      }
      return null;
    });
  };
  const handleCancelOrder = async (orderId: string, orderStatus: string) => {
    if (orderStatus === "Shipped") {
      toast.error("Item is shipped. Order can't be cancelled.");
      return;
    }

    try {
      const { error } = await supabase
        .from("order_table_pre_build")
        .update({ order_status: "Cancelled" })
        .eq("order_id", orderId);

      if (error) {
        throw new Error("Error canceling order");
      }

      toast.success("Your order is cancelled. You'll be refunded soon.");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId
            ? { ...order, order_status: "Cancelled" }
            : order
        )
      );
    } catch (error) {
      toast.error("Error canceling the order.");
    }
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
            className="flex flex-col border p-4 rounded-md bg-slate-700 custom-backdrop-filter gap-4 justify-center items-center"
          >
            <h2 className="font-extrabold text-center">
              Order: <span className="text-indigo-600">{order.order_id}</span>
            </h2>

            <div className="w-full flex flex-wrap md:flex-nowrap items-center justify-between gap-10">
              <ol className="w-auto list-decimal flex flex-col justify-center gap-2">
                {order.ordered_products.map((product, idx) => (
                  <li
                    key={idx}
                    className="flex hover:text-indigo-600 items-center cursor-pointer"
                  >
                    {renderProduct(product)}
                  </li>
                ))}
              </ol>
              <div className="w-auto flex flex-col justify-center items-center gap-2">
                <div className="flex gap-2 justify-center items-center">
                  <img
                    src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/Logo_Social/order.png"
                    alt=""
                    className="w-8 h-8"
                  />
                  <p className="text-sm font-semibold text-indigo-600">
                    Order Status:
                  </p>
                </div>
                <p
                  className={`text-sm font-semibold capitalize ${
                    order.order_status === "Delivered"
                      ? "text-green-600"
                      : "text-yellow-500"
                  }`}
                >
                  {order.order_status}
                </p>
              </div>
              <div className="w-auto">
                <button
                  onClick={() =>
                    handleCancelOrder(order.order_id, order.order_status)
                  }
                  className={`p-4 flex flex-row md:flex-col justify-center items-center gap-2 border-2 text-xs rounded-md font-bold ${
                    order.order_status === "Shipped" ||
                    order.order_status === "Cancelled"
                      ? "border-gray-400 bg-gray-400 cursor-not-allowed"
                      : "border-red-600 bg-red-600 hover:bg-transparent hover:text-red-600"
                  }`}
                  disabled={
                    order.order_status === "Shipped" ||
                    order.order_status === "Cancelled"
                  } // Disable if shipped or cancelled
                >
                  <CircleX />
                  Cancel Order
                </button>
              </div>

              <div className="w-auto flex flex-col justify-center items-center gap-4">
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
      <ToastContainer />
    </div>
  );
};

export default OrderedCustomBuildPC;
