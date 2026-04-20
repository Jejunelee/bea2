"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

export default function Latest() {
  const [isMobile, setIsMobile] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false 
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    
    emblaApi.on("select", onSelect);
    onSelect(); // Set initial index
    
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const cards = [
    { bg: "#e8b6c0", icon: "/Landing/Icons/Icons1.png", image: "/Landing/Latest/1.png" },
    { bg: "#f3cc2b", icon: "/Landing/Icons/Icons2.png", image: "/Landing/Latest/2.png" },
    { bg: "#9ac33b", icon: "/Landing/Icons/Icon3.png", image: "/Landing/Latest/3.png" }
  ];

  // ========== MOBILE LAYOUT (Carousel) ==========
  if (isMobile) {
    return (
      <section className="w-full bg-[#FEFDF8] py-8 px-4 text-black">
        {/* Compact Header */}
        <div className="text-center mb-6">
          <h3 className="font-helvetica text-xl font-semibold mb-2">
            The latest drops
          </h3>

          {/* Social Icons - Compact */}
          <div className="flex justify-center gap-2 mb-3">
            {["spotify", "linkedin", "ig", "substack"].map((social) => (
              <div key={social} className="relative w-8 h-8">
                <Image 
                  src={`/Landing/Icons/${social}.png`} 
                  alt={social} 
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>

          {/* Headphones - Smaller */}
          <Image
            src="/Landing/Headphones.png"
            alt="podcast headphones"
            width={80}
            height={80}
            className="mx-auto mb-2"
          />

          <p className="font-helvetica text-sm font-medium">
            Subscribe to my podcast
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {cards.map((card, idx) => (
                <div key={idx} className="flex-[0_0_75%] min-w-0">
                  <Link href="/work" className="block cursor-pointer">
                    <div 
                      className="h-10 flex items-center justify-center rounded-t-lg"
                      style={{ backgroundColor: card.bg }}
                    >
                      <Image
                        src={card.icon}
                        alt={`icon${idx + 1}`}
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="relative w-full aspect-[3/4] overflow-hidden rounded-b-lg">
                      <Image
                        src={card.image}
                        alt={`post${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {cards.map((_, idx) => (
              <button
                key={idx}
                onClick={() => emblaApi?.scrollTo(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === selectedIndex 
                    ? "w-6 bg-gray-800" 
                    : "w-2 bg-gray-300"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ========== DESKTOP LAYOUT (Original) ==========
  return (
    <section className="w-full bg-[#FEFDF8] py-20 px-6 lg:px-16 text-black">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

        {/* LEFT PODCAST BLOCK */}
        <Link href="/work" className="flex flex-col items-center text-center cursor-pointer">
          <h3 className="font-helvetica text-3xl font-semibold mb-3">
            The latest drops
          </h3>

          <div className="flex gap-4 mb-1">
            <div className="relative w-12 h-12">
              <Image 
                src="/Landing/Icons/spotify.png" 
                alt="spotify" 
                fill
                className="object-contain"
              />
            </div>
            <div className="relative w-12 h-12">
              <Image 
                src="/Landing/Icons/linkedin.png" 
                alt="linkedin" 
                fill
                className="object-contain"
              />
            </div>
            <div className="relative w-12 h-12">
              <Image 
                src="/Landing/Icons/ig.png" 
                alt="instagram" 
                fill
                className="object-contain"
              />
            </div>
            <div className="relative w-12 h-12">
              <Image 
                src="/Landing/Icons/substack.png" 
                alt="substack" 
                fill
                className="object-contain"
              />
            </div>
          </div>

          <Image
            src="/Landing/Headphones.png"
            alt="podcast headphones"
            width={220}
            height={220}
            className="mb-2"
          />

          <p className="font-helvetica text-2xl font-medium">
            Subscribe to my <br /> podcast
          </p>
        </Link>

        {/* CONTENT CARDS */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <Link key={idx} href="/work" className="flex flex-col cursor-pointer">
              <div 
                className="h-12 flex items-center justify-center mb-3"
                style={{ backgroundColor: card.bg }}
              >
                <Image
                  src={card.icon}
                  alt={`icon${idx + 1}`}
                  width={28}
                  height={28}
                />
              </div>
              <div className="relative w-full aspect-[3/4] overflow-hidden">
                <Image
                  src={card.image}
                  alt={`post${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}