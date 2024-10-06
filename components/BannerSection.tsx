import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const BannerSection: React.FC = () => {
  const [galleryImages, setGalleryImages] = useState<{ name: string; url: string }[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: true }, // Ensure smooth scrolling
    [Autoplay({ delay: 2000, stopOnInteraction: false })] // Autoplay
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

    const slides = emblaApi.slideNodes();
    const scrollProgress = emblaApi.scrollProgress();

    slides.forEach((slide, index) => {
      const slideProgress = emblaApi.scrollSnapList()[index] - scrollProgress;
      const parallax = -50 * slideProgress; // Adjust this value for stronger/weaker effect
      const image = slide.querySelector("img");
      if (image) {
        image.style.transform = `translateX(${parallax}px)`; // Apply parallax effect
      }
    });
  }, [emblaApi]);

  useEffect(() => {
    fetchGalleryImages();
    if (emblaApi) {
      emblaApi.on("scroll", onScroll); // Apply parallax effect during scrolling
      emblaApi.on("select", onScroll); // Ensure effect when snapping to a slide
    }
  }, [emblaApi, onScroll]);

  return (
    <div className="flex flex-col items-center w-full py-16 px-4">
      <h1 className="font-bold text-2xl md:mb-6 mb-0 text-center">
        Our <span className="text-indigo-500">Recently Launched</span> Products
      </h1>

      {/* Embla Carousel */}
      <div className="embla w-full max-w-4xl overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {galleryImages.map((image, index) => (
            <div
              className="relative flex-shrink-0 w-[50%] px-2 transition-transform duration-300" // Embla slide
              key={index}
            >
              <img
                src={image.url}
                alt={image.name}
                className="transform transition-transform will-change-transform w-full h-64 object-scale-down rounded-lg shadow-lg" // Set a fixed height with object-cover
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerSection;
