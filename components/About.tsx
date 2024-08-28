"use client";
import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { X } from "lucide-react";
import {Planet} from "react-planet"; 

const About: React.FC = () => {
  const [aboutData, setAboutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [galleryImages, setGalleryImages] = useState<
    { name: string; url: string }[]
  >([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // To store the selected image URL
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const scrollIntervalRef = useRef<number | null>(null);

  const fetchgalleryImages = async () => {
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

  useEffect(() => {
    const fetchAboutData = async () => {
      const { data, error } = await supabase.from("about").select("*").single(); // Fetches a single row

      if (error) {
        console.error("Error fetching about data:", error);
      } else {
        setAboutData(data);
      }
      setLoading(false);
    };

    fetchAboutData();
    fetchgalleryImages();
  }, []);

  useEffect(() => {
    const startAutoScroll = () => {
      const gallery = galleryRef.current;
      if (gallery && galleryImages.length > 0) {
        const scrollSpeed = 2; // Adjust the scroll speed

        const autoScroll = () => {
          if (gallery.scrollWidth - gallery.clientWidth <= gallery.scrollLeft) {
            gallery.scrollLeft = 0; // Reset scroll position when reaching the end
          } else {
            gallery.scrollLeft += scrollSpeed;
          }
        };

        scrollIntervalRef.current = window.setInterval(autoScroll, 30); // Adjust the interval for smoother scrolling
      }
    };

    const stopAutoScroll = () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    };

    const handleMouseEnter = () => {
      stopAutoScroll(); // Stop scrolling on mouse enter
    };

    const handleMouseLeave = () => {
      if (!scrollIntervalRef.current) {
        startAutoScroll(); // Restart scrolling on mouse leave
      }
    };

    if (galleryRef.current) {
      galleryRef.current.addEventListener("mouseenter", handleMouseEnter);
      galleryRef.current.addEventListener("mouseleave", handleMouseLeave);
    }

    startAutoScroll();

    return () => {
      stopAutoScroll(); // Cleanup on component unmount
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
    <div className="relative flex flex-col gap-5 justify-center items-center w-full h-full mt-12">
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
                  className="w-96 h-96 rounded-md cursor-pointer"
                  onClick={() => setSelectedImage(image.url)} // Set the selected image on click
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

      {/* Modal for displaying the large image */}
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
              className="absolute top-2 right-2 text-white bg-black bg-opacity-70 rounded-full p-2 hover:bg-red-600"
            >
              <X />
            </button>
          </div>
        </div>
      )}
      <h1 className="text-3xl font-extrabold ">
        Reviews from <span className="text-indigo-600">Our Customers</span>
      </h1>


    </div>
  );
};

export default About;
