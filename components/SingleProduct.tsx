import { useAppDispatch } from "@/lib/hooks/redux";
import { addToCart } from "@/redux/cartSlice";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import { ToastContainer, toast } from "react-toastify"; // Import toast and ToastContainer from react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import CSS for react-toastify
import { useRouter } from "next/navigation";
import RatingForProduct from "./RatingForProduct";
import CharacterCounterInputForproduct from "./CharacterCounterInputForProduct";
import { supabase } from "@/lib/supabaseClient";
import SingleProductReviews from "./SingleProductReviews";

const SingleProduct = ({ singleProduct }: { singleProduct: any }) => {
  const router = useRouter();
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [rating, setRating] = useState<number>(0);
  const [resetRating, setResetRating] = useState<boolean>(false);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  const handleResetRating = () => {
    setRating(0);
    setResetRating(true);
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  useEffect(() => {
    if (resetRating) {
      setResetRating(false);
    }
  }, [resetRating]);

  if (loading) {
    return <div>Loading...</div>;
  }

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
    router.push(
      `/checkout-single-product?product_id=${singleProduct.product_id}`
    );
  };

  return (
    <div className="pb-20">
      <div className="w-full flex flex-row flex-wrap md:flex-nowrap items-center justify-center pt-16">
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
      </div>
      <ToastContainer position="bottom-center" />{" "}
      {/* Set position prop directly */}
      <div className="flex flex-col justify-center items-center gap-4 pb-8">
        <h1 className="font-bold text-xl text-center">
          Want to say something about{" "}
          <span className="text-indigo-500">this product?</span>
        </h1>
        {/* Rating Component */}
        <RatingForProduct
          onRatingChange={handleRatingChange}
          resetRating={resetRating}
        />
        {/* CharacterCounterInput Component */}
        <CharacterCounterInputForproduct
          user={user}
          rating={rating}
          onResetRating={handleResetRating}
          productId={singleProduct.product_id}
        />
      </div>
      <div className="flex flex-col justify-center items-center gap-4 pb-12">
        <h1 className="font-bold text-xl text-center">
          What people think about{" "}
          <span className="text-indigo-500">this product?</span>
        </h1>
        <SingleProductReviews productId={singleProduct.product_id}/>
      </div>
    </div>
  );
};

export default SingleProduct;
