"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { supabase } from "@/app/lib/supabase/client";
import type { LatestSettings, LatestCard } from "@/app/types/latest";

export default function Latest() {
  const [settings, setSettings] = useState<Partial<LatestSettings>>({});
  const [cards, setCards] = useState<LatestCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false 
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch settings
      const { data: settingsData } = await supabase
        .from('latest_settings')
        .select('*')
        .eq('id', 1)
        .single();
      if (settingsData) setSettings(settingsData);

      // Fetch cards
      const { data: cardsData } = await supabase
        .from('latest_cards')
        .select('*')
        .order('display_order', { ascending: true });
      if (cardsData) setCards(cardsData);

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
    return <div className="w-full py-20" style={{ backgroundColor: '#FEFDF8' }}></div>;
  }

  // ========== MOBILE LAYOUT ==========
  if (isMobile) {
    return (
      <section className="w-full py-8 px-4 text-black" style={{ backgroundColor: settings.background_color || '#FEFDF8' }}>
        <div className="text-center mb-6">
          <h3 className="font-helvetica text-xl font-semibold mb-2">
            {settings.title_text || 'The latest drops'}
          </h3>

          <div className="flex justify-center gap-2 mb-3">
            {settings.social_links?.map((social, idx) => (
              <a 
                key={idx} 
                href={social.url} 
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-8 h-8 block"
              >
                <Image 
                  src={`/Landing/Icons/${social.name}.png`} 
                  alt={social.name} 
                  fill
                  className="object-contain"
                />
              </a>
            ))}
          </div>

          <Image
            src={settings.headphones_image_url || '/Landing/Headphones.png'}
            alt="podcast headphones"
            width={80}
            height={80}
            className="mx-auto mb-2"
          />

          <p className="font-helvetica text-sm font-medium">
            {settings.podcast_title || 'Subscribe to my podcast'}
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {cards.map((card, idx) => (
                <div key={card.id} className="flex-[0_0_75%] min-w-0">
                  <a href={card.link_url} className="block cursor-pointer" target="_blank" rel="noopener noreferrer">
                    <div 
                      className="h-10 flex items-center justify-center rounded-t-lg"
                      style={{ backgroundColor: card.background_color }}
                    >
                      <Image
                        src={card.icon_url}
                        alt={`icon${idx + 1}`}
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="relative w-full aspect-[3/4] overflow-hidden rounded-b-lg">
                      <Image
                        src={card.image_url}
                        alt={`post${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>

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

  // ========== DESKTOP LAYOUT ==========
  return (
    <section className="w-full py-20 px-6 lg:px-16 text-black" style={{ backgroundColor: settings.background_color || '#FEFDF8' }}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left podcast block - NOT wrapped in Link to avoid nesting */}
        <div className="flex flex-col items-center text-center">
          <h3 className="font-helvetica text-3xl font-semibold mb-3">
            {settings.title_text || 'The latest drops'}
          </h3>

          <div className="flex gap-4 mb-1">
            {settings.social_links?.map((social, idx) => (
              <a 
                key={idx} 
                href={social.url} 
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-12 h-12 block"
              >
                <Image 
                  src={`/Landing/Icons/${social.name}.png`} 
                  alt={social.name} 
                  fill
                  className="object-contain"
                />
              </a>
            ))}
          </div>

          <Image
            src={settings.headphones_image_url || '/Landing/Headphones.png'}
            alt="podcast headphones"
            width={220}
            height={220}
            className="mb-2"
          />

          <p className="font-helvetica text-2xl font-medium">
            {settings.podcast_title || 'Subscribe to my podcast'}
          </p>
        </div>

        {/* Content cards */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <a 
              key={card.id} 
              href={card.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col cursor-pointer"
            >
              <div 
                className="h-12 flex items-center justify-center mb-3"
                style={{ backgroundColor: card.background_color }}
              >
                <Image
                  src={card.icon_url}
                  alt={`icon${idx + 1}`}
                  width={28}
                  height={28}
                />
              </div>
              <div className="relative w-full aspect-[3/4] overflow-hidden">
                <Image
                  src={card.image_url}
                  alt={`post${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}