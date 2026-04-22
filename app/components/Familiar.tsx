"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/app/lib/supabase/client";
import type { FamiliarCard, FamiliarSettings } from "@/app/types/familiar";

export default function Familiar() {
  const [cards, setCards] = useState<FamiliarCard[]>([]);
  const [settings, setSettings] = useState<Partial<FamiliarSettings>>({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch cards
      const { data: cardsData } = await supabase
        .from('familiar_cards')
        .select('*')
        .order('card_order', { ascending: true });
      
      if (cardsData) setCards(cardsData);

      // Fetch settings
      const { data: settingsData } = await supabase
        .from('familiar_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (settingsData) setSettings(settingsData);
      
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

  const scrollToCard = (index: number) => {
    const element = document.getElementById(`card-${index}`);
    if (element) element.scrollIntoView({ behavior: "smooth" });
    setActiveIndex(index);
  };

  if (loading) {
    return <div className="w-full py-20 bg-white"></div>;
  }

  const displayCards = cards.length > 0 ? cards : [];
  const headingText = settings.heading_text || 'Sounds familiar?';
  const headingItalicWord = settings.heading_italic_word || 'familiar?';
  const headingParts = headingText.split(headingItalicWord);

  // ========== MOBILE LAYOUT ==========
  if (isMobile) {
    return (
      <section 
        className="relative w-full font-helvetica pb-16"
        style={{ backgroundColor: settings.background_color || '#FFFFFF' }}
      >
        {/* Mobile Header */}
        <div className="sticky top-0 z-30 py-8 px-4 shadow-sm" style={{ backgroundColor: settings.background_color || '#FFFFFF' }}>
          <div className="text-center">
            <h2 className="text-black text-2xl font-medium">
              {headingParts[0]}
              <span className="italic font-normal font-editorial">{headingItalicWord}</span>
              {headingParts[1]}
            </h2>
            <p className="mt-2 text-black text-sm text-gray-600">
              {settings.subheading_text || 'The things nobody says out loud, but everyone feels.'}
            </p>
          </div>
        </div>

        {/* Mobile Carousel */}
        <div className="relative px-4 mt-6">
          <div className="overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar">
            <div className="flex gap-4">
              {displayCards.map((card, idx) => (
                <div
                  key={card.id}
                  className="flex-shrink-0 w-full snap-center"
                >
                  <div 
                    className="rounded-2xl p-5"
                    style={{ backgroundColor: settings.card_background_color || '#000000' }}
                  >
                    {/* Image */}
                    <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4">
                      <Image 
                        src={card.image_url} 
                        alt={card.title} 
                        fill 
                        className="object-cover"
                      />
                    </div>

                    {/* Arrow Icon */}
                    <Image
                      src={`/Landing/Icons/Arrow-${idx + 1}.png`}
                      alt={`Arrow ${idx + 1}`}
                      width={48}
                      height={48}
                      className="mb-3"
                    />

                    {/* Title */}
                    <h3 
                      className="text-xl font-medium mb-3 leading-tight"
                      style={{ color: settings.text_color || '#FFFFFF' }}
                    >
                      "{card.title}"
                    </h3>

                    {/* Description */}
                    <p 
                      className="text-sm leading-relaxed"
                      style={{ color: settings.text_color || '#FFFFFF' }}
                    >
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {displayCards.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const container = document.querySelector('.overflow-x-auto');
                  const cardWidth = window.innerWidth - 32;
                  container?.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
                  setActiveIndex(idx);
                }}
                className={`transition-all duration-300 ${
                  activeIndex === idx 
                    ? 'w-8 h-2 bg-black rounded-full' 
                    : 'w-2 h-2 bg-gray-300 rounded-full'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mobile Swipe Hint */}
        <div className="text-center mt-6 text-gray-400 text-xs">
          ← Swipe to see more →
        </div>

        <style jsx>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </section>
    );
  }

  // ========== DESKTOP LAYOUT ==========
  return (
    <section 
      className="relative w-full font-helvetica"
      style={{ backgroundColor: settings.background_color || '#FFFFFF' }}
    >
      {/* Sticky Heading */}
      <div className="top-0 z-30 py-12 px-6" style={{ backgroundColor: settings.background_color || '#FFFFFF' }}>
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-black text-4xl md:text-5xl font-medium tracking-tight">
            {headingParts[0]}
            <span className="text-black italic font-normal font-editorial">{headingItalicWord}</span>
            {headingParts[1]}
          </h2>
          <p className="mt-4 text-black text-lg">
            {settings.subheading_text || 'The things nobody says out loud, but everyone feels.'}
          </p>
        </div>
      </div>

      {/* Cards - Sticky Scroll */}
      <div className="relative" style={{ height: `${displayCards.length * 60}vh` }}>
        {displayCards.map((card, idx) => (
          <div
            key={card.id}
            id={`card-${idx}`}
            className="sticky flex items-center justify-center px-6 py-8"
            style={{ top: `${160 + idx * 8}px`, zIndex: idx }}
          >
            <div className="max-w-6xl mx-auto w-full">
              <div 
                className="rounded-[36px] p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center shadow-lg"
                style={{ backgroundColor: settings.card_background_color || '#000000' }}
              >
                {/* Image */}
                <div className="relative w-full md:w-[420px] h-[260px] md:h-[300px] rounded-2xl overflow-hidden flex-shrink-0">
                  <Image src={card.image_url} alt={card.title} fill className="object-cover" />
                </div>

                {/* Text Content */}
                <div className="max-w-xl">
                  <Image
                    src={`/Landing/Icons/Arrow-${idx + 1}.png`}
                    alt={`Arrow ${idx + 1}`}
                    width={72}
                    height={72}
                    className="mb-4 w-18 h-18"
                  />

                  <h3 
                    className="font-helvetica text-3xl md:text-4xl font-medium mb-4"
                    style={{ color: settings.text_color || '#FFFFFF' }}
                  >
                    "{card.title}"
                  </h3>
                  <p 
                    className="text-lg leading-relaxed"
                    style={{ color: settings.text_color || '#FFFFFF' }}
                  >
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}