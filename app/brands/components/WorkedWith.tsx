"use client";

import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { supabase } from "@/app/lib/supabase/client";
import type { WorkedWithSettings, WorkedWithBrand } from "@/app/types/brandworkedwith";

export default function WorkedWith() {
  const [settings, setSettings] = useState<Partial<WorkedWithSettings>>({});
  const [brands, setBrands] = useState<WorkedWithBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    loop: true
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch settings
      const { data: settingsData } = await supabase
        .from('worked_with_settings')
        .select('*')
        .eq('id', 1)
        .single();
      if (settingsData) setSettings(settingsData);

      // Fetch brands
      const { data: brandsData } = await supabase
        .from('worked_with_brands')
        .select('*')
        .order('display_order', { ascending: true });
      if (brandsData) setBrands(brandsData);

      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const currentSection = sectionRef.current;
    if (!currentSection || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    observer.observe(currentSection);

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, [hasAnimated, loading]);

  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    
    emblaApi.on("select", onSelect);
    onSelect();
    
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  if (loading) {
    return <div className="w-full py-16" style={{ backgroundColor: '#000000' }}></div>;
  }

  // ========== MOBILE LAYOUT ==========
  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        className="py-12 px-4"
        style={{ backgroundColor: settings.background_color || '#000000' }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <div
            className={`transition-all duration-700 ease-out ${
              hasAnimated
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <p className="text-base tracking-[0.1em] mb-3" style={{ color: settings.text_color || '#FFFFFF' }}>
              {settings.heading_prefix || 'Some of the'}{" "}
              <span className="font-editorial italic font-semibold" style={{ color: settings.text_color || '#FFFFFF' }}>
                {settings.heading_brands_italic || 'brands'}
              </span>{" "}
              and{" "}
              <span className="font-editorial italic font-semibold" style={{ color: settings.text_color || '#FFFFFF' }}>
                {settings.heading_people_italic || 'people'}
              </span>{" "}
              {settings.heading_suffix || "I've worked with"}
            </p>
          </div>

          {/* Divider */}
          <div
            className={`transition-all duration-700 delay-75 ease-out origin-left ${
              hasAnimated
                ? "opacity-100 scale-x-100"
                : "opacity-0 scale-x-0"
            }`}
          >
            <div className="border-b w-full mb-8" style={{ borderColor: settings.divider_color || '#404040' }} />
          </div>

          {/* Carousel */}
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-3">
                {brands.map((brand, index) => (
                  <div
                    key={brand.id}
                    className="flex-[0_0_70%] min-w-0"
                  >
                    <a
                      href={brand.website_url || '#'}
                      target={brand.website_url ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className={`bg-neutral-800 aspect-square flex items-center justify-center rounded-lg transition-all duration-700 ease-out block ${
                        hasAnimated
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-8"
                      }`}
                      style={{ transitionDelay: `${150 + index * 100}ms` }}
                    >
                      {brand.logo_url ? (
                        <Image
                          src={brand.logo_url}
                          alt={brand.name}
                          width={150}
                          height={150}
                          className="object-contain p-4"
                        />
                      ) : (
                        <span className="text-neutral-500 text-sm">{brand.name}</span>
                      )}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {brands.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => emblaApi?.scrollTo(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === selectedIndex 
                      ? "w-6 bg-white" 
                      : "w-2 bg-neutral-600"
                  }`}
                  aria-label={`Go to brand ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ========== DESKTOP LAYOUT ==========
  return (
    <section
      ref={sectionRef}
      className="py-16 px-6"
      style={{ backgroundColor: settings.background_color || '#000000' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div
          className={`transition-all duration-700 ease-out ${
            hasAnimated
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <p className="text-lg tracking-[0.1em] mb-4" style={{ color: settings.text_color || '#FFFFFF' }}>
            {settings.heading_prefix || 'Some of the'}{" "}
            <span className="font-editorial italic font-semibold" style={{ color: settings.text_color || '#FFFFFF' }}>
              {settings.heading_brands_italic || 'brands'}
            </span>{" "}
            and{" "}
            <span className="font-editorial italic font-semibold" style={{ color: settings.text_color || '#FFFFFF' }}>
              {settings.heading_people_italic || 'people'}
            </span>{" "}
            {settings.heading_suffix || "I've worked with"}
          </p>
        </div>

        {/* Divider */}
        <div
          className={`transition-all duration-700 delay-75 ease-out origin-left ${
            hasAnimated
              ? "opacity-100 scale-x-100"
              : "opacity-0 scale-x-0"
          }`}
        >
          <div className="border-b w-full mb-12" style={{ borderColor: settings.divider_color || '#404040' }} />
        </div>

        {/* Logos grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {brands.map((brand, index) => (
            <a
              key={brand.id}
              href={brand.website_url || '#'}
              target={brand.website_url ? "_blank" : undefined}
              rel="noopener noreferrer"
              className={`bg-neutral-800 aspect-square flex items-center justify-center rounded-lg transition-all duration-700 ease-out ${
                hasAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${150 + index * 100}ms` }}
            >
              {brand.logo_url ? (
                <Image
                  src={brand.logo_url}
                  alt={brand.name}
                  width={200}
                  height={200}
                  className="object-contain p-4"
                />
              ) : (
                <span className="text-neutral-500 text-sm">{brand.name}</span>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}