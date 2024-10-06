import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const RecentProductsShow: React.FC = () => {
  const [galleryImages, setGalleryImages] = useState<{ name: string; url: string }[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: true }, // Ensure smooth scrolling
    [Autoplay({ delay: 2000, stopOnInteraction: false })] // Autoplay
  );

  const fetchGalleryImages = async () => {
    const { data, error } = await supabase.storage
      .from("product-image")
      .list("recent_products", { limit: 100 });

    if (error) {
      console.error("Error fetching gallery images:", error);
      return;
    }

    if (data) {
      const imageUrls = data.map((file) => {
        const { data: publicUrlData } = supabase.storage
          .from("product-image")
          .getPublicUrl(`recent_products/${file.name}`);
        const publicUrl = publicUrlData.publicUrl;
        return { name: file.name, url: publicUrl };
      });
      setGalleryImages(imageUrls);
    }
  };

  useEffect(() => {
    fetchGalleryImages();
    if (emblaApi) {
      emblaApi.on("select", onSlideChange); // Custom scale effect on select
    }
  }, [emblaApi]);

  const onSlideChange = useCallback(() => {
    if (!emblaApi) return;

    const slides = emblaApi.slideNodes();
    const scaleFactor = 0.3; // Scaling factor for non-center slides
    const selectedIndex = emblaApi.selectedScrollSnap();

    slides.forEach((slide, index) => {
      if (index === selectedIndex) {
        slide.style.transform = 'scale(1)'; // Center slide stays at full size
      } else {
        slide.style.transform = `scale(${scaleFactor})`; // Smaller scale for others
      }
    });
  }, [emblaApi]);

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
              className="embla__slide flex-shrink-0 w-[50%] relative px-2 transition-transform duration-300"
              key={index}
            >
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-72 object-scale-down rounded-lg shadow-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentProductsShow;
