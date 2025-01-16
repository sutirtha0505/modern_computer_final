import React, { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { supabase } from "@/lib/supabaseClient";
import { EmblaCarouselType } from "embla-carousel";
import './carousel.css';
import Image from "next/image";

const TWEEN_FACTOR_BASE = 0.52;

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

const RecentProductsShow: React.FC = () => {
  const [galleryImages, setGalleryImages] = useState<
    { name: string; url: string }[]
  >([]);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: true },
    [Autoplay({ delay: 2000, stopOnInteraction: false })]
  );

  const tweenFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);

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

  const setTweenNodes = useCallback((emblaApi: EmblaCarouselType) => {
    tweenNodes.current = emblaApi
      .slideNodes()
      .map((slideNode: { querySelector: (arg0: string) => HTMLElement }) => {
        return slideNode.querySelector(".embla__slide__number") as HTMLElement;
      });
  }, []);

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenScale = useCallback(
    (emblaApi: EmblaCarouselType, eventName?: string) => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = emblaApi.slidesInView();
      const isScrollEvent = eventName === "scroll";

      emblaApi
        .scrollSnapList()
        .forEach((scrollSnap: number, snapIndex: number) => {
          // snapIndex is now always a number
          let diffToTarget = scrollSnap - scrollProgress;
          const slidesInSnap = engine.slideRegistry[snapIndex]; // snapIndex as a number

          slidesInSnap.forEach((slideIndex: number) => {
            if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

            if (engine.options.loop) {
              engine.slideLooper.loopPoints.forEach(
                (loopItem: { target: () => number; index: number }) => {
                  const target = loopItem.target();

                  if (slideIndex === loopItem.index && target !== 0) {
                    const sign = Math.sign(target);

                    if (sign === -1) {
                      diffToTarget = scrollSnap - (1 + scrollProgress);
                    }
                    if (sign === 1) {
                      diffToTarget = scrollSnap + (1 - scrollProgress);
                    }
                  }
                }
              );
            }

            const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
            const scale = numberWithinRange(tweenValue, 0, 1).toString();
            const tweenNode = tweenNodes.current[slideIndex];
            tweenNode.style.transform = `scale(${scale})`;
          });
        });
    },
    []
  );

  useEffect(() => {
    fetchGalleryImages();
  
    if (!emblaApi) return;
  
    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenScale(emblaApi);
  
    emblaApi
      .on("reInit", setTweenNodes)
      .on("reInit", setTweenFactor)
      .on("reInit", tweenScale)
      .on("scroll", tweenScale)
      .on("slideFocus", tweenScale);
  }, [emblaApi, tweenScale, setTweenFactor, setTweenNodes]);
  

  return (
    <div className="pt-8 flex flex-col justify-center items-center gap-4">
      {galleryImages.length > 0 && (
        <>
          <h1 className="font-bold text-2xl md:mb-6 mb-0 text-center">
            Our <span className="text-indigo-500">Recently Launched</span> Products
          </h1>
          <div className="embla">
            <div className="embla__viewport" ref={emblaRef}>
              <div className="embla__container h-52 md:h-auto">
                {galleryImages.map((image, index) => (
                  <div className="embla__slide w-2/3 md:w-auto object-scale-down" key={index}>
                    <Image
                      src={image.url}
                      alt={image.name}
                      className="embla__slide__number"
                      width={500}
                      height={500}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default RecentProductsShow;
