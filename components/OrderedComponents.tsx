import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import dayjs from "dayjs"; // Import Day.js

interface OrderedComponentsProps {
  userId: string;
}

interface OrderedProduct {
  product_id: string;
  quantity: number;
}

interface Order {
  ordered_products: OrderedProduct[];
  expected_delivery_date: string;
}

interface Product {
  product_id: string;
  product_name: string;
  product_image: { url: string }[]; // Assuming product_image is an array of objects with "url" key
}

const OrderedComponents: React.FC<OrderedComponentsProps> = ({ userId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [productsMap, setProductsMap] = useState<Map<string, Product>>(
    new Map()
  );

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);

      try {
        // Fetching orders for the user
        const { data: ordersData, error: ordersError } = await supabase
          .from("order_table")
          .select("ordered_products, expected_delivery_date")
          .eq("customer_id", userId); // Match the userId with the customer_id

        if (ordersError) {
          console.error("Error fetching orders:", ordersError);
          return;
        }

        setOrders(ordersData || []);

        // Extract unique product IDs from ordered_products
        const uniqueProductIds = new Set<string>();
        ordersData?.forEach((order) => {
          order.ordered_products.forEach((product: OrderedProduct) =>
            uniqueProductIds.add(product.product_id)
          );
        });

        // Fetch product details from the products table for unique product IDs
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("product_id, product_name, product_image")
          .in("product_id", Array.from(uniqueProductIds)); // Fetch all products at once

        if (productsError) {
          console.error("Error fetching products:", productsError);
          return;
        }

        // Create a map of product_id -> Product for quick lookup
        const productMap = new Map<string, Product>();
        productsData?.forEach((product: Product) => {
          productMap.set(product.product_id, product);
        });

        setProductsMap(productMap); // Store the map
      } catch (error) {
        console.error("Unexpected error fetching orders or products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const getFirstImageUrl = (images: { url: string }[]): string | null => {
    const image = images.find((img) => img.url.includes("_first"));
    return image ? image.url : null;
  };

  const truncateString = (str: string, maxLength: number) => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + "..."; // Add '...' if the string exceeds the limit
    }
    return str;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (orders.length === 0) {
    return <div>No orders found.</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-xl font-bold">
        Your <span className="text-indigo-600">Ordered PC Components</span>
      </h1>
      <div className="flex flex-col justify-center items-center w-full p-16 gap-5">
        {orders.map((order, index) => (
          <div
            key={index}
            className="flex flex-col border p-4 rounded-md bg-slate-800 custom-backdrop-filter gap-4"
          >
            <h2 className="font-extrabold text-center">
              Order : <span className="text-indigo-600">{index + 1}</span>
            </h2>

            <div className="flex items-center justify-center gap-10">
              <ol>
                <p className="text-sm font-bold text-center">Ordered Products</p>
                {order.ordered_products.map((product: OrderedProduct, idx) => {
                  const productDetails = productsMap.get(product.product_id);
                  const firstImageUrl =
                    productDetails &&
                    getFirstImageUrl(productDetails.product_image);
                  return (
                    <ol key={idx}>
                      <li className="flex gap-4 items-center">
                        <div className="flex items-center justify-between gap-6 cursor-pointer">
                          {firstImageUrl && (
                            <img
                              src={firstImageUrl}
                              alt="Product Image"
                              className="w-16 h-16 object-cover"
                            />
                          )}
                          <p className="text-sm font-semibold hover:text-indigo-600">
                            {truncateString(
                              productDetails?.product_name || "Unknown Product",
                              30
                            )}{" "}
                          </p>
                          <p className="text-sm font-semibold text-indigo-600">
                            X {product.quantity}
                          </p>
                        </div>
                      </li>
                    </ol>
                  );
                })}
              </ol>
              {/* Format and display the expected delivery date */}
              <p className="text-sm font-semibold text-indigo-600">
                Expected Delivery Date:{" "} <br />
                <span className="text-white">{dayjs(order.expected_delivery_date).format("dddd, MMMM D, YYYY")}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderedComponents;
