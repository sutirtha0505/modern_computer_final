import React from "react";
import { useRouter } from "next/navigation";

interface Product {
  product_id: string;
  product_MRP: number;
  product_SP: number;
  product_amount: number;
  product_image: { url: string }[];
  product_name: string;
}

interface ProductListProps {
  products: Product[];
}

const truncateProductName = (name: string) => {
  const words = name.split(" ");
  if (words.length > 5) {
    return words.slice(0, 7).join(" ") + " ...";
  }
  return name;
};

const ProductByCategoriesItemList: React.FC<ProductListProps> = ({
  products,
}) => {
  const router = useRouter(); // Use the hook inside the component

  return (
    <div className="flex flex-wrap justify-center items-center gap-4">
      {products.map((product, index) => {
        console.log("Product:", product); // Log the product to ensure the structure is correct

        // Find the first image URL containing '_first' in its URL
        const productImage = product.product_image.find((img) =>
          img.url.includes("_first")
        );

        return (
          <div
            key={index}
            className="p-4 mb-16 flex rounded-md flex-col cursor-pointer w-60 h-80 gap-5 justify-center items-center bg-white/50 custom-backdrop-filter"
          >
            {productImage && (
              <img
                src={productImage.url}
                className="w-44 h-96 object-contain hover:scale-105 overflow-hidden ease-in-out duration-[0.5s]"
                alt={product.product_name}
              />
            )}
            <h1 className="font-bold text-sm text-center">
              {truncateProductName(product.product_name)}
            </h1>
            <div className="flex justify-between gap-6">
              <p className="font-bold">&#x20B9;{`${product.product_SP}`}</p>
              <p className="text-[#b8b4b4] line-through select-none">
                &#x20B9;{`${product.product_MRP}`}
              </p>
            </div>
            <button
              className="bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 h-32 w-36 rounded-md text-xs hover:text-xs hover:font-bold duration-200"
              onClick={() => router.push(`/product/${product.product_id}`)}
            >
              Check out
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ProductByCategoriesItemList;
