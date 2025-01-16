import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';

const BannerSection: React.FC = () => {
  const [galleryImages, setGalleryImages] = useState<{ name: string; url: string }[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: true }, // Enable looping and drag-free scrolling
    [Autoplay({ delay: 4000, stopOnInteraction: false })] // Enable autoplay
  );

  const fetchGalleryImages = async () => {
    const { data, error } = await supabase.storage
      .from("product-image")
      .list("banners", { limit: 100 });

    if (error) {
      console.error("Error fetching gallery images:", error);
      return;
    }

    if (data) {
      const imageUrls = data.map((file) => {
        const { data: publicUrlData } = supabase.storage
          .from("product-image")
          .getPublicUrl(`banners/${file.name}`);
        const publicUrl = publicUrlData.publicUrl;
        return { name: file.name, url: publicUrl };
      });
      setGalleryImages(imageUrls);
    }
  };

  const onScroll = useCallback(() => {
    if (!emblaApi) return;

    const slides = emblaApi.slideNodes(); // Get all slide elements
    const scrollProgress = emblaApi.scrollProgress(); // Get current scroll progress

    slides.forEach((slide, index) => {
      const slideProgress = emblaApi.scrollSnapList()[index] - scrollProgress;
      const opacity = 1 - Math.abs(slideProgress); // Calculate opacity based on position

      // Set opacity for each slide
      const innerImageWrapper = slide.querySelector(".embla__slide__inner") as HTMLElement;
      if (innerImageWrapper) {
        innerImageWrapper.style.opacity = opacity.toString(); // Apply opacity effect
      }
    });
  }, [emblaApi]);

  useEffect(() => {
    fetchGalleryImages();
    if (emblaApi) {
      emblaApi.on("scroll", onScroll); // Apply opacity effect on scroll
      emblaApi.on("select", onScroll); // Ensure effect when snapping to slide
    }
  }, [emblaApi, onScroll]);

  return (
    <div className="flex flex-col items-center w-full py-16 px-4">
      {/* Check if there are images to display */}
      {galleryImages.length > 0 && (
        <>
      <h1 className="font-bold text-2xl md:mb-6 mb-0 text-center">
        Our <span className="text-indigo-500">Recent Offers</span> on Products
      </h1>

          {/* Embla Carousel */}
          <div className="embla w-full max-w-4xl overflow-hidden" ref={emblaRef}>
            <div className="embla__container flex">
              {galleryImages.map((image, index) => (
                <div
                  className="embla__slide relative flex-shrink-0 w-full md:w-[33.333%] px-2" // Adjusted width for responsive design
                  key={index}
                >
                  <div className="embla__slide__inner transition-opacity duration-300"> {/* Apply transition for smooth effect */}
                    <Image
                      src={image.url}
                      alt={image.name}
                      className="w-full h-64 object-cover rounded-lg shadow-lg" // Use object-cover for better image fit
                      width={1920}
                      height={1080}
                      priority
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-4">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                className="w-3 h-3 rounded-full mx-1 bg-gray-300 hover:bg-gray-500 transition duration-200"
                onClick={() => emblaApi?.scrollTo(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BannerSection;
