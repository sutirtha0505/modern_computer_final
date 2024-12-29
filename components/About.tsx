"use client";
import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { X } from "lucide-react";

const About: React.FC = () => {
  const [aboutData, setAboutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [galleryImages, setGalleryImages] = useState<
    { name: string; url: string }[]
  >([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [profilePhotos, setProfilePhotos] = useState<
    {
      profile_photo: string;
      email: string;
      customer_name: string;
      UX_star: number;
      comment: string;
    }[]
  >([]); // Updated to store profile photo and details
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const scrollIntervalRef = useRef<number | null>(null);

  const fetchGalleryImages = async () => {
    const { data, error } = await supabase.storage
      .from("product-image")
      .list("gallery/");
    if (error) {
      console.error("Error fetching gallery items:", error);
    }
    if (data) {
      const imageUrls = data.map((file) => {
        const { data: publicUrlData } = supabase.storage
          .from("product-image")
          .getPublicUrl(`gallery/${file.name}`);
        const publicUrl = publicUrlData.publicUrl;
        return { name: file.name, url: publicUrl };
      });
      setGalleryImages(imageUrls);
    }
  };

  const fetchProfilePhotos = async () => {
    const { data, error } = await supabase
      .from("profile")
      .select("profile_photo, email, customer_name, UX_star, comment")
      .eq("show_in_carousel", true);

    if (error) {
      console.error("Error fetching profile photos:", error);
    } else if (data) {
      setProfilePhotos(
        data.map((profile) => ({
          profile_photo: profile.profile_photo,
          email: profile.email,
          customer_name: profile.customer_name,
          UX_star: profile.UX_star,
          comment: profile.comment,
        }))
      );
    }
  };

  useEffect(() => {
    const fetchAboutData = async () => {
      const { data, error } = await supabase
        .from("about")
        .select("*")
        .order("id", { ascending: false }) // Order by 'id' in descending order
        .limit(1); // Limit to the first row

      if (error) {
        console.error("Error fetching about data:", error);
      } else {
        setAboutData(data?.[0] || null); // Safely access the first item if it exists
      }
      setLoading(false);
    };

    fetchAboutData();
    fetchGalleryImages();
    fetchProfilePhotos();
  }, []);

  useEffect(() => {
    const startAutoScroll = () => {
      const gallery = galleryRef.current;
      if (gallery && galleryImages.length > 0) {
        const scrollSpeed = 2;

        const autoScroll = () => {
          if (gallery.scrollWidth - gallery.clientWidth <= gallery.scrollLeft) {
            gallery.scrollLeft = 0;
          } else {
            gallery.scrollLeft += scrollSpeed;
          }
        };

        scrollIntervalRef.current = window.setInterval(autoScroll, 30);
      }
    };

    const stopAutoScroll = () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    };

    const handleMouseEnter = () => {
      stopAutoScroll();
    };

    const handleMouseLeave = () => {
      if (!scrollIntervalRef.current) {
        startAutoScroll();
      }
    };

    if (galleryRef.current) {
      galleryRef.current.addEventListener("mouseenter", handleMouseEnter);
      galleryRef.current.addEventListener("mouseleave", handleMouseLeave);
    }

    startAutoScroll();

    return () => {
      stopAutoScroll();
      if (galleryRef.current) {
        galleryRef.current.removeEventListener("mouseenter", handleMouseEnter);
        galleryRef.current.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [galleryImages]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!aboutData) {
    return <div>No data found</div>;
  }

  return (
    <div
      className="relative flex flex-col gap-5 justify-center items-center w-full h-full mt-12"
      id="about"
    >
      <h1 className="text-3xl font-extrabold ">
        About <span className="text-indigo-600">Us</span>
      </h1>

      <div className="text-center flex flex-col justify-center items-center">
        <div className="w-80 h-80 flex justify-center items-center rounded-full rotator">
          {aboutData.about_image && (
            <img
              src={aboutData.about_image}
              alt="About"
              className="mx-auto w-60 h-60 rounded-full absolute z-[3]"
            />
          )}
        </div>
        <p className="mb-4 w-full text-center p-4">
          {aboutData.about_description}
        </p>
        <div className="flex md:flex-row flex-col justify-between items-center p-6">
          <div className="md:w-1/2 w-full gap-4 flex flex-col justify-center items-center p-4 md:p-0">
            <h1 className="text-2xl font-bold">
              Check our <span className="text-indigo-600">Gallery</span>
            </h1>
            <div
              ref={galleryRef}
              className="h-auto flex justify-start items-center gap-2 overflow-x-scroll hide-scrollbar"
            >
              {galleryImages.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.name}
                  className="w-96 h-96 rounded-md cursor-pointer object-contain"
                  onClick={() => setSelectedImage(image.url)}
                />
              ))}
            </div>
          </div>
          <div className="md:w-1/2 w-full flex flex-col justify-center items-center p-4 md:p-0">
            <h1 className="text-2xl font-bold">
              Find us in <span className="text-green-400">Google Maps</span>
            </h1>
            <div className="p-4 flex justify-center items-center w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117809.33356005314!2d88.2346774433594!3d22.6708709!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89d6194bec665%3A0xcd7daf9c1de1513d!2sMODERN%20COMPUTER!5e0!3m2!1sen!2sin!4v1722415474783!5m2!1sen!2sin"
                className="w-full md:w-full rounded-md h-96"
                frameBorder="0"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
        <h1 className="text-2xl font-bold">
          Check <span className="text-red-500">YouTube</span> for{" "}
          <span className="text-indigo-600">Latest Offers</span>
        </h1>
        <div className="w-full flex gap-10 justify-center flex-wrap items-center p-6 md:p-28">
          {aboutData.about_yt_1 && (
            <iframe
              className="w-auto h-64 md:w-[500px] md:h-[300px] rounded-md"
              src={aboutData.about_yt_1}
              title="YouTube video 1"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
          {aboutData.about_yt_2 && (
            <iframe
              className="w-auto h-64 md:w-[500px] md:h-[300px] rounded-md"
              src={aboutData.about_yt_2}
              title="YouTube video 2"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
          <div className="relative">
            <img
              src={selectedImage}
              alt="Selected"
              className="w-auto h-[90vh] max-w-[90vw] rounded-md object-cover "
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-70 rounded-full p-2 hover:bg-red-600 object-scale-down"
            >
              <X />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 justify-center items-center">
        <h1 className="text-2xl font-bold">
          Why <span className="text-indigo-500">Modern Computer?</span>
        </h1>
        <div className="flex justify-center items-center gap-4 flex-wrap">
          <div className="flex flex-col justify-center items-center gap-2">
            <img
              src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/Logo_Social/free-delivery.png"
              alt=""
              className="w-24 h-24"
            />
            <p className="text-lg font-extrabold">Free Delivery</p>
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <img
              src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/Logo_Social/technical-support.png"
              alt=""
              className="w-24 h-24"
            />
            <p className="text-lg font-extrabold">365 Days Servicing </p>
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <img
              src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/Logo_Social/opinion.png"
              alt=""
              className="w-24 h-24"
            />
            <p className="text-lg font-extrabold">Proper Suggestion</p>
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <img
              src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/Logo_Social/best-price.png"
              alt=""
              className="w-24 h-24"
            />
            <p className="text-lg font-extrabold">Best Price</p>
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <img
              src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/Logo_Social/free-delivery%20truck.png"
              alt=""
              className="w-24 h-24"
            />
            <p className="text-lg font-extrabold">Free Shipping</p>
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <img
              src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/Logo_Social/warranty.png"
              alt=""
              className="w-24 h-24"
            />
            <p className="text-lg font-extrabold">Safe Delivery</p>
          </div>
        </div>
      </div>

      <div className="w-full p-6">
        <h1 className="text-3xl font-extrabold text-center">
          Reviews from
          <span className="text-indigo-600"> Our Customers</span>
        </h1>
        <div className="flex flex-wrap justify-center items-center gap-10 mt-16">
          {profilePhotos.map((profile, index) => (
            <div
              key={index}
              className="w-96 h-96 p-6 bg-white/90 dark:bg-slate-900 rounded-md shadow-lg flex flex-col justify-center gap-6 items-center relative"
            >
              <img
                src={profile.profile_photo}
                alt={`Profile ${index}`}
                className="w-24 h-24 rounded-full mx-auto absolute -top-9"
              />
              <h2 className="text-xl font-semibold text-center">
                {profile.customer_name}
              </h2>
              <div className="flex justify-center items-center gap-2">
                {[...Array(5)].map((_, starIndex) => (
                  <svg
                    key={starIndex}
                    className={`w-6 h-6 ${
                      starIndex < profile.UX_star
                        ? "text-yellow-500"
                        : "text-gray-400"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <p className="text-center h-36 overflow-x-scroll hide-scrollbar">
                {profile.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
