import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import dayjs from "dayjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { XCircle } from "lucide-react";

// Interfaces for types
interface OrderedProduct {
  product_id: string;
}

interface Product {
  id: string;
  build_name: string;
  build_type: string;
  image_urls: { url: string }[];
}

interface Customer {
  email: string;
  customer_name: string;
  phone_no: string;
  profile_photo: string;
}

const OrderedPreBuildPCManagement = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]); // State to hold filtered orders
  const [productsMap, setProductsMap] = useState<Map<string, Product>>(
    new Map()
  );
  const [customersMap, setCustomersMap] = useState<Map<string, Customer>>(
    new Map()
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>(""); // State to hold the search query

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
          .from("order_table_pre_build")
          .select("*");

        if (ordersError) {
          console.error("Error fetching orders:", ordersError);
          return;
        }

        setOrders(ordersData || []);
        setFilteredOrders(ordersData || []); // Set filtered orders initially

        // Fetch unique product IDs
        const uniqueProductIds = new Set<string>();
        ordersData?.forEach((order) => {
          if (order.ordered_products && order.ordered_products.length > 0) {
            order.ordered_products.forEach((productId: string) => {
              if (productId) {
                uniqueProductIds.add(productId);
              }
            });
          }
        });

        if (uniqueProductIds.size === 0) {
          console.log("No product IDs found in orders.");
          return;
        }

        // Fetch product details from pre_build table using the product IDs
        const { data: productsData, error: productsError } = await supabase
          .from("pre_build")
          .select("id, build_name, image_urls, build_type")
          .in("id", Array.from(uniqueProductIds));

        if (productsError) {
          console.error("Error fetching products:", productsError);
          return;
        }
        const productMap = new Map<string, Product>();
        productsData?.forEach((product: Product) => {
          productMap.set(product.id, product);
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

  // Function to handle filtering
  const handleFilter = () => {
    const query = searchQuery.toLowerCase();

    const filtered = orders.filter((order) => {
      const customer = customersMap.get(order.customer_id);
      return (
        order.order_id.toLowerCase().includes(query) ||
        order.payment_id.toLowerCase().includes(query) ||
        customer?.customer_name?.toLowerCase().includes(query) ||
        customer?.email?.toLowerCase().includes(query) ||
        order.order_status.toLowerCase().includes(query) // Ensures 'Shipped' or any other status is filtered
      );
    });

    setFilteredOrders(filtered);
  };

  // Function to clear the filter
  const clearFilter = () => {
    setSearchQuery(""); // Reset search query
    setFilteredOrders(orders); // Reset filtered orders to original orders
  };

  return (
    <div className="w-full h-full justify-center items-center flex flex-col pt-8 mb-12    ">
      <h1 className="text-xl font-bold text-center">
        <span className="text-indigo-500">Pre-Build PC </span> Orders
      </h1>

      {/* Filter Section */}
      <div className="flex justify-center items-center w-full gap-6 py-4 px-8">
        <input
          type="text"
          placeholder="Search by order ID, payment ID, customer details, or order status"
          value={searchQuery} // Bind the input value to state
          onChange={(e) => setSearchQuery(e.target.value)} // Update the search query state
          className="w-full px-4 py-2 border rounded-md bg-transparent"
        />
        {/* Clear Filter Icon */}
        {searchQuery && ( // Show the clear button only if there's a search query
          <button
            className="text-red-500 hover:text-red-700"
            onClick={clearFilter}
            aria-label="Clear filter"
          >
            <XCircle size={24} />
          </button>
        )}
        <button
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
          onClick={handleFilter} // Call handleFilter on click
        >
          Filter
        </button>
      </div>

      {/* Table Section */}
      <div className="w-full flex items-center overflow-x-auto p-8 scrollbar-hide">
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
              <th className="px-4 py-2 border text-center w-[12%]">
                Order Status
              </th>
              <th className="px-4 py-2 border text-center w-[13%]">
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
              filteredOrders.map((order) => {
                const customer = customersMap.get(order.customer_id);

                return (
                  <tr key={order.order_id}>
                    <td className="px-4 py-2 border w-[5%] break-all text-xs select-text">
                      {order.order_id}
                    </td>
                    <td
                      className="px-4 py-2 break-all border w-[5%] text-xs select-text cursor-pointer hover:text-indigo-500"
                      onClick={() => {
                        window.open(
                          `https://dashboard.razorpay.com/app/payments/${order.payment_id}?init_page=Payments`
                        );
                      }}
                    >
                      {order.payment_id}
                    </td>
                    <td className="px-4 py-2 border w-[25%] text-xs">
                      <div className="flex flex-wrap items-center gap-2 justify-center mb-3">
                        {customer?.profile_photo && (
                          <img
                            src={customer.profile_photo}
                            alt={customer.customer_name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <p className="text-center">
                          {customer?.customer_name || "Unknown Name"}
                        </p>
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
                          <p className="break-all">
                            {customer?.email || "Unknown Email"}
                          </p>
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
                    <td
                      className="px-4 py-2 border w-[5%] text-xs cursor-pointer hover:text-indigo-500"
                      onClick={() => {
                        const address = encodeURIComponent(order.order_address);
                        window.open(
                          `https://www.google.com/maps/search/?api=1&query=${address}`,
                          "_blank"
                        );
                      }}
                    >
                      {order.order_address}
                    </td>

                    <td className="px-4 py-2 border w-[35%]">
                      {order.ordered_products?.map((productId: string) => {
                        const product = productsMap.get(productId);
                        const imageUrl = product?.image_urls
                          ? getFirstImageUrl(product.image_urls)
                          : undefined;

                        return (
                          <div
                            key={productId}
                            className="flex flex-col items-center"
                          >
                            <img
                              src={imageUrl ?? undefined} // Use nullish coalescing to ensure undefined if null
                              alt={product?.build_name || "Product Image"}
                              className="w-16 h-16 object-cover"
                            />
                            <p className="text-center">
                              {product?.build_name || "Unknown Product"}
                            </p>
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
                            .from("order_table_pre_build")
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
                      <button
                        className="bg-blue-500 border-1 hover:bg-transparent hover:text-blue-500 border-blue-500 text-white px-2 py-1 w-full rounded"
                        onClick={() => {
                          const message = `Hello, You've ordered something from Modern Computer. Here is your Order ID: ${order.order_id}. We've something to talk about the order.`;
                          const encodedMessage = encodeURIComponent(message);

                          window.open(
                            `https://web.whatsapp.com/send?phone=${customer?.phone_no}&text=${encodedMessage}`
                          );
                        }}
                      >
                        Contact
                      </button>
                    </td>
                    <td className="px-4 py-2 border w-[5%]">
                      <button
                        className={`${
                          order.order_status === "Cancelled"
                            ? "bg-red-500 border-red-500 hover:bg-transparent hover:text-red-500 text-white"
                            : "bg-gray-300 border-gray-300 text-gray-600 cursor-not-allowed"
                        } border-1 px-2 py-1 w-full rounded`}
                        onClick={async () => {
                          const orderId = order.order_id; // Get order ID
                          const paymentId = order.payment_id; // Get payment ID
                          const amount = order.payment_amount * 100; // Get payment amount (ensure this is part of your order data)

                          try {
                            const response = await fetch("/api/refund", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                order_id: orderId,
                                payment_id: paymentId,
                                amount,
                              }),
                            });

                            const data = await response.json();

                            if (response.ok) {
                              toast.success("Refund processed successfully!");
                              // Optionally, refresh the orders list or update the state
                            } else {
                              toast.error(`Refund failed: ${data.error}`);
                            }
                          } catch (error) {
                            console.error("Error during refund:", error);
                            toast.error(
                              "An error occurred while processing the refund."
                            );
                          }
                        }}
                      >
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

export default OrderedPreBuildPCManagement;