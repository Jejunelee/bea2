// app/components/fractional/WhatYouGet.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { FractionalGetSettings, FractionalGetItem } from "@/app/types/fractional";

export default function WhatYouGet() {
  const [settings, setSettings] = useState<Partial<FractionalGetSettings>>({});
  const [items, setItems] = useState<FractionalGetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const defaultItems: FractionalGetItem[] = [
    { id: 1, text: "One senior Brand & Comms Director running the work across every channel that matters for your brand, with one set of priorities, one strategic mind, and one consistent voice.", display_order: 1 },
    { id: 2, text: "Communications that actually go out on a schedule, not in panicked bursts when the founder finds a free Sunday.", display_order: 2 },
    { id: 3, text: "A brand that sounds like the same brand across the website, the deck, the newsletter, the LinkedIn, the press, and the launches.", display_order: 3 },
    { id: 4, text: "Specialist support pulled in when the project actually needs it, with no agency overhead and no fragmented vendor management.", display_order: 4 },
    { id: 5, text: "A founder freed up to run the business, instead of managing five different freelancers between meetings.", display_order: 5 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const { data: settingsData } = await supabase.from('fractional_get_settings').select('*').eq('id', 1).single();
      if (settingsData) setSettings(settingsData);
      const { data: itemsData } = await supabase.from('fractional_get_items').select('*').order('display_order', { ascending: true });
      if (itemsData && itemsData.length > 0) setItems(itemsData);
      else setItems(defaultItems);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const currentSection = sectionRef.current;
    if (!currentSection || loading) return;
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting && !hasAnimated) setHasAnimated(true); }); },
      { threshold: 0.2, rootMargin: "0px 0px -100px 0px" }
    );
    observer.observe(currentSection);
    return () => { if (currentSection) observer.unobserve(currentSection); };
  }, [hasAnimated, loading]);

  if (loading) return <div className="w-full py-16" style={{ backgroundColor: '#ffffff' }}></div>;

  const displayItems = items.length > 0 ? items : defaultItems;

  const renderTextWithEmphasis = (text: string) => {
    const emphasisPhrases = ["one senior Brand & Comms Director", "actually go out on a schedule", "sounds like the same brand", "no agency overhead", "freed up to run the business"];
    let result = [];
    let lastIndex = 0;
    
    for (const phrase of emphasisPhrases) {
      const index = text.toLowerCase().indexOf(phrase.toLowerCase());
      if (index !== -1) {
        if (index > lastIndex) result.push(text.substring(lastIndex, index));
        const foundPhrase = text.substring(index, index + phrase.length);
        result.push(<span key={index} className="font-editorial italic text-black">{foundPhrase}</span>);
        lastIndex = index + phrase.length;
      }
    }
    if (lastIndex < text.length) result.push(text.substring(lastIndex));
    return result.length > 0 ? result : text;
  };

  if (isMobile) {
    return (
      <section ref={sectionRef} className="relative w-full py-16 px-4 overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#e9c08f]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#e6ee9c]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-medium text-black tracking-tight font-helvetica">What you <span className="font-editorial italic">get</span></h2>
            <div className="w-12 h-px bg-black/20 mx-auto mt-3" />
          </div>
          <div className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="space-y-4">
              {displayItems.map((item, idx) => (
                <div key={item.id} className={`flex items-start gap-3 transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`} style={{ transitionDelay: `${idx * 75}ms` }}>
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-black/10 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-black/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-black/70 leading-relaxed font-helvetica flex-1">{renderTextWithEmphasis(item.text)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative w-full py-28 px-6 sm:px-8 lg:px-12 overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-[5%] w-[300px] h-[300px] bg-[#e9c08f]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[10%] w-[400px] h-[400px] bg-[#e6ee9c]/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium text-black tracking-tight font-helvetica">
            What you <span className="font-editorial italic">get</span>
          </h2>
          <div className="w-16 h-px bg-black/20 mx-auto mt-4" />
        </div>
        <div className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="space-y-4">
            {displayItems.map((item, idx) => (
              <div key={item.id} className={`flex items-start gap-4 transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`} style={{ transitionDelay: `${idx * 75}ms` }}>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-base md:text-lg text-black/70 leading-relaxed font-helvetica">
                  {renderTextWithEmphasis(item.text)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}