import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import dayjs from "dayjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface OrderedProduct {
  product_id: string;
}

interface Product {
  product_id: string;
  product_name: string;
  product_image: { url: string }[];
}

interface Customer {
  email: string;
  customer_name: string;
  phone_no: string;
  profile_photo: string;
}

const OrderedPCComponentManagement = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [productsMap, setProductsMap] = useState<Map<string, Product>>(
    new Map()
  );
  const [customersMap, setCustomersMap] = useState<Map<string, Customer>>(
    new Map()
  ); // State to store customer details
  const [loading, setLoading] = useState<boolean>(false);

  const getFirstImageUrl = (images: { url: string }[]): string | null => {
    const image = images.find((img) => img.url.includes("_first"));
    return image ? image.url : null;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);

      try {
        // Fetch orders
        const { data: ordersData, error: ordersError } = await supabase
          .from("order_table")
          .select("*");

        if (ordersError) {
          console.error("Error fetching orders:", ordersError);
          return;
        }

        setOrders(ordersData || []);

        // Fetch unique product IDs
        const uniqueProductIds = new Set<string>();
        ordersData?.forEach((order) => {
          order.ordered_products.forEach((product: OrderedProduct) =>
            uniqueProductIds.add(product.product_id)
          );
        });

        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("product_id, product_name, product_image")
          .in("product_id", Array.from(uniqueProductIds));

        if (productsError) {
          console.error("Error fetching products:", productsError);
          return;
        }

        const productMap = new Map<string, Product>();
        productsData?.forEach((product: Product) => {
          productMap.set(product.product_id, product);
        });

        setProductsMap(productMap);

        // Fetch unique customer IDs
        const uniqueCustomerIds = new Set<string>();
        ordersData?.forEach((order) => {
          uniqueCustomerIds.add(order.customer_id);
        });

        // Fetch customer details from the profile table
        const { data: customersData, error: customersError } = await supabase
          .from("profile")
          .select("id, email, customer_name, phone_no, profile_photo")
          .in("id", Array.from(uniqueCustomerIds));

        if (customersError) {
          console.error("Error fetching customers:", customersError);
          return;
        }

        const customerMap = new Map<string, Customer>();
        customersData?.forEach((customer: any) => {
          customerMap.set(customer.id, customer);
        });

        setCustomersMap(customerMap);
      } catch (error) {
        console.error("Unexpected error fetching orders or products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="w-full h-full justify-center items-center flex flex-col pt-8">
      <h1 className="text-xl font-bold text-center">
        <span className="text-indigo-500">Ordered PC Component</span> Orders
      </h1>

      {/* Table Section */}
      <div className="w-full flex justify-center overflow-x-auto p-8 scrollbar-hide">
        <table className="min-w-full text-left table-auto border-collapse">
          <thead>
            <tr className="bg-gray-800 w-full">
              <th className="px-4 py-2 border text-center w-[5%]">Order ID</th>
              <th className="px-4 py-2 border text-center w-[5%]">
                Payment ID
              </th>
              <th className="px-4 py-2 border text-center w-[25%]">
                Customer Details
              </th>
              <th className="px-4 py-2 border text-center w-[5%]">
                Customer Address
              </th>
              <th className="px-4 py-2 border text-center w-[35%]">
                Ordered Products
              </th>
              <th className="px-4 py-2 border text-center w-[7%]">
                Order Status
              </th>
              <th className="px-4 py-2 border text-center w-[18%]">
                Expected Delivery Date
              </th>
              <th className="px-4 py-2 border text-center w-[5%]">
                Contact Customer
              </th>
              <th className="px-4 py-2 border text-center w-[5%]">Refund</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center px-4 py-2 border">
                  Loading...
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const customer = customersMap.get(order.customer_id);

                return (
                  <tr key={order.order_id}>
                    <td className="px-4 py-2 border w-[5%] break-all text-xs">
                      {order.order_id}
                    </td>
                    <td className="px-4 py-2 border w-[5%] text-xs">
                      {order.payment_id}
                    </td>
                    <td className="px-4 py-2 border w-[25%] text-xs">
                      <div className="flex flex-wrap items-center gap-2 justify-center">
                        {customer?.profile_photo && (
                          <img
                            src={customer.profile_photo}
                            alt={customer.customer_name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <p>{customer?.customer_name || "Unknown Name"}</p>
                      </div>
                      <div className="flex flex-col gap-2 justify-center items-center">
                        <div
                          className="flex gap-2 justify-center items-center cursor-pointer hover:text-indigo-500"
                          onClick={() => {
                            window.open(
                              `mailto:${customer?.email}`,
                              "Wishing you a heartily welcome from Modern Computer, Belgharia."
                            );
                          }}
                        >
                          <img
                            src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/Logo_Social/gmail.png"
                            alt=""
                            className="w-4 h-4"
                          />
                          <p>{customer?.email || "Unknown Email"}</p>
                        </div>
                        <div
                          className="flex gap-2 justify-center items-center cursor-pointer hover:text-indigo-500"
                          onClick={() => {
                            window.open(`tel:${customer?.phone_no}`);
                          }}
                        >
                          <img
                            src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/Logo_Social/call.png"
                            alt=""
                            className="w-4 h-4"
                          />
                          <p>{customer?.phone_no}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 border w-[5%] text-xs">
                      {order.order_address}
                    </td>
                    <td className="px-4 py-2 border w-[35%]">
                      {order.ordered_products.map((product: OrderedProduct) => {
                        const productDetails = productsMap.get(
                          product.product_id
                        );
                        const firstImageUrl = productDetails
                          ? getFirstImageUrl(productDetails.product_image)
                          : null;

                        return (
                          <div
                            key={product.product_id}
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => {
                              window.open(`/product/${product.product_id}`);
                            }}
                          >
                            {firstImageUrl && (
                              <img
                                src={firstImageUrl}
                                alt={
                                  productDetails?.product_name ||
                                  "Product Image"
                                }
                                className="w-8 h-8 object-cover"
                              />
                            )}
                            <span className="text-xs hover:text-indigo-500">
                              {productDetails?.product_name
                                ? productDetails.product_name.length > 25
                                  ? `${productDetails.product_name.slice(
                                      0,
                                      25
                                    )}...`
                                  : productDetails.product_name
                                : "Unknown Product"}
                            </span>
                          </div>
                        );
                      })}
                    </td>
                    <td className="px-4 py-2 border w-[7%]">
                      <select
                        value={order.order_status} // Set the current order status as the default value
                        onChange={async (e) => {
                          const newStatus = e.target.value;

                          // Update the order status in Supabase
                          const { error } = await supabase
                            .from("order_table")
                            .update({ order_status: newStatus }) // Update the order status
                            .eq("order_id", order.order_id); // Where the order_id matches

                          if (error) {
                            console.error(
                              "Error updating order status:",
                              error
                            );
                            // Optionally, show an error toast notification if there's an error
                            toast.error(
                              "Failed to update order status. Please try again."
                            );
                          } else {
                            console.log("Order status updated successfully!");

                            // Update the order status in the state immediately
                            setOrders((prevOrders) =>
                              prevOrders.map((o) =>
                                o.order_id === order.order_id
                                  ? { ...o, order_status: newStatus }
                                  : o
                              )
                            );

                            // Show a success toast notification
                            toast.success("Order Status changed successfully");
                          }
                        }}
                        className="border rounded p-1 text-xs w-full"
                      >
                        {/* Show the current order status as an option */}
                        <option value={order.order_status}>
                          {order.order_status}
                        </option>

                        {/* Add the other options: Shipped, Cancelled, Delivered, Refunded */}
                        {order.order_status !== "Shipped" && (
                          <option value="Shipped">Shipped</option>
                        )}
                        {order.order_status !== "Cancelled" && (
                          <option value="Cancelled">Cancelled</option>
                        )}
                        {order.order_status !== "Delivered" && (
                          <option value="Delivered">Delivered</option>
                        )}
                        {order.order_status !== "Refunded" && (
                          <option value="Refunded">Refunded</option>
                        )}
                      </select>
                    </td>

                    <td className="px-4 py-2 border w-[18%]">
                      <div className="flex justify-center items-center">
                        {dayjs(order.expected_delivery_date).format(
                          "MMM D, YYYY"
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 border w-[5%]">
                      <button className="bg-blue-500 text-white px-2 py-1 w-full rounded" onClick={()=>{
                        //Message in whatsapp using customer.phone_no
                        window.open(`https://wa.me/${customer?.phone_no}?text=Hello, You've ordered something from Modern Computer. Here is your Order ID: ${order.order_id}. We've something to talk about the order.`);
                      }}>
                        Contact
                      </button>
                    </td>
                    <td className="px-4 py-2 border w-[5%]">
                      <button className="bg-red-500 text-white px-2 py-1 w-full rounded">
                        Refund
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default OrderedPCComponentManagement;
