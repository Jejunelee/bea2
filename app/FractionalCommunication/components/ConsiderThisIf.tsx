// app/components/fractional/ConsiderThisIf.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { FractionalConsiderSettings, FractionalConsiderItem } from "@/app/types/FractionalCommunication/ConsiderThisIf";

export default function ConsiderThisIf() {
  const [settings, setSettings] = useState<Partial<FractionalConsiderSettings>>({});
  const [items, setItems] = useState<FractionalConsiderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const defaultItems: FractionalConsiderItem[] = [
    { id: 1, text: "You are founder-led and you have been running the comms yourself between everything else, and the content has gone out inconsistently for months.", display_order: 1 },
    { id: 2, text: "You are running a hospitality group with multiple venues or concepts and the brand voice keeps drifting between them.", display_order: 2 },
    { id: 3, text: "You have worked with agencies before but the work never quite sounds like you, and you do not have the bandwidth to manage them tightly enough to fix that.", display_order: 3 },
    { id: 4, text: "You are building a food media business or a creator-led brand and you need someone who understands both the editorial and commercial sides.", display_order: 4 },
    { id: 5, text: "You need a comms partner who already knows the food and hospitality industry. Who knows the difference between a chef, a restaurateur, and an operator. Who can spell amatriciana.", display_order: 5 },
  ];

  const renderTextWithEmphasis = (text: string) => {
    const emphasisWords = ["inconsistently", "drifting", "never quite sounds like you", "editorial and commercial", "amatriciana"];
    let result = [];
    let lastIndex = 0;
    
    for (const word of emphasisWords) {
      const index = text.toLowerCase().indexOf(word.toLowerCase());
      if (index !== -1) {
        if (index > lastIndex) result.push(text.substring(lastIndex, index));
        const foundWord = text.substring(index, index + word.length);
        result.push(<span key={index} className="font-editorial italic text-white">{foundWord}</span>);
        lastIndex = index + word.length;
      }
    }
    if (lastIndex < text.length) result.push(text.substring(lastIndex));
    return result.length > 0 ? result : text;
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: settingsData } = await supabase.from('fractional_consider_settings').select('*').eq('id', 1).single();
      if (settingsData) setSettings(settingsData);

      const { data: itemsData } = await supabase.from('fractional_consider_items').select('*').order('display_order', { ascending: true });
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

  if (loading) return <div className="w-full py-16" style={{ backgroundColor: '#000000' }}></div>;

  const displayItems = items.length > 0 ? items : defaultItems;

  if (isMobile) {
    return (
      <section ref={sectionRef} className="relative w-full py-16 px-4 overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#e9c08f]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#e6ee9c]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-medium text-white tracking-tight font-helvetica">You should consider this <span className="font-editorial italic">if</span></h2>
            <div className="w-12 h-px bg-white/20 mx-auto mt-3" />
          </div>
          <div className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="space-y-4">
              {displayItems.map((item, idx) => (
                <div key={item.id} className={`flex items-start gap-3 transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`} style={{ transitionDelay: `${idx * 75}ms` }}>
                  <span className="text-white/40 text-base mt-0.5">✦</span>
                  <p className="text-base text-white/70 leading-relaxed font-helvetica">{renderTextWithEmphasis(item.text)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative w-full py-28 px-6 sm:px-8 lg:px-12 overflow-hidden" style={{ backgroundColor: '#000000' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-[5%] w-[300px] h-[300px] bg-[#e9c08f]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[10%] w-[400px] h-[400px] bg-[#e6ee9c]/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium text-white tracking-tight font-helvetica">
            You should consider this <span className="font-editorial italic">if</span>
          </h2>
          <div className="w-16 h-px bg-white/20 mx-auto mt-4" />
        </div>
        <div className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="space-y-5">
            {displayItems.map((item, idx) => (
              <div key={item.id} className={`flex items-start gap-4 transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`} style={{ transitionDelay: `${idx * 75}ms` }}>
                <span className="text-white/30 text-xl mt-0.5">✦</span>
                <p className="text-lg md:text-xl lg:text-2xl text-white/70 leading-relaxed font-helvetica">
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