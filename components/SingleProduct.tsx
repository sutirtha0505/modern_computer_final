import { useAppDispatch } from "@/lib/hooks/redux";
import { addToCart } from "@/redux/cartSlice";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import { ToastContainer, toast } from "react-toastify"; // Import toast and ToastContainer from react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import CSS for react-toastify
import { useRouter } from "next/navigation";

const SingleProduct = ({ singleProduct }: { singleProduct: any }) => {
  const router = useRouter();
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const dispatch = useAppDispatch();

  if (!singleProduct) {
    return <div>Loading...</div>;
  }

  // Assuming product_image is an array of image URLs
  const productImages = singleProduct.product_image;

  const handleHeartClick = () => {
    setIsHeartFilled(!isHeartFilled);
  };

  const handleAddToCart = () => {
    dispatch(addToCart(singleProduct));
  };

  const handleBuyNow = () => {
    router.push(`/checkout-single-product?product_id=${singleProduct.product_id}`);
  };

  return (
    <div className="w-full flex flex-row flex-wrap md:flex-nowrap items-center justify-center pb-20 pt-16">
      <div className="md:w-1/2 w-full flex p-6 flex-col justify-center items-center relative">
        <div
          className="absolute top-2 right-2 z-10 rounded-full bg-white/50 p-2 custom-backdrop-filter cursor-pointer"
          onClick={handleHeartClick}
        >
          <Heart
            className={
              isHeartFilled ? "text-red-500 fill-current" : "text-red-500"
            }
          />
        </div>
        {/* Carousel to display product images */}
        {productImages && productImages.length > 0 && (
          <Carousel
            showThumbs={true} // Enable the thumbnails
            autoPlay={true} // Enable auto play
            interval={3000} // Interval between slides in milliseconds (3 seconds)
            infiniteLoop={true} // Enable infinite loop
            showStatus={false} // Hide the status bar
          >
            {productImages.map((image: any, index: number) => (
              <div key={index} className="relative">
                <Image
                  src={image.url}
                  alt={`Product Image ${index}`}
                  width={500} // Adjust width and height as needed
                  height={500}
                  className="rounded-lg"
                />
              </div>
            ))}
          </Carousel>
        )}
      </div>
      <div className="md:w-1/2 w-full flex flex-col justify-center gap-6 p-6">
        <h1 className="font-extrabold text-2xl">
          {singleProduct.product_name}
        </h1>
        <p className="text-xs">{singleProduct.product_description}</p>
        <div className="flex gap-5">
          <p className="font-extrabold text-xl">
            &#x20B9;{singleProduct.product_SP}
          </p>
          <div className="flex gap-1">
            <p className="line-through text-[#b8b4b4] text-sm">
              &#x20B9;{singleProduct.product_MRP}
            </p>
            <p className="font-bold text-sm text-emerald-300">
              ({singleProduct.product_discount}%)
            </p>
          </div>
        </div>
        <div className="w-full flex gap-10">
          <button
            className="bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 h-10 w-28 rounded-md text-l hover:text-l hover:font-bold duration-200"
            onClick={() => {
              handleAddToCart();
              // No need to toast here, it's handled in cartSlice
            }}
          >
            Add to Cart
          </button>
          <button 
            className="bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 h-10 w-28 rounded-md text-l hover:text-l hover:font-bold duration-200"
            onClick={handleBuyNow}
          >
            Buy Now
          </button>
        </div>
      </div>
      <ToastContainer position="bottom-center" />{" "}
      {/* Set position prop directly */}
    </div>
  );
};

export default SingleProduct;
