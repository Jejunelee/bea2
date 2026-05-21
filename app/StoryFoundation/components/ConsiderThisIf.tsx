// app/components/foundation/ConsiderThisIf.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { FoundationConsiderSettings, FoundationConsiderItem } from "@/app/types/foundation";

export default function ConsiderThisIf() {
  const [settings, setSettings] = useState<Partial<FoundationConsiderSettings>>({});
  const [items, setItems] = useState<FoundationConsiderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const defaultItems: FoundationConsiderItem[] = [
    { id: 1, text: "You are approaching a fundraiser, a market expansion, a product launch, or a rebrand, and your messaging needs to be tight before you walk in.", display_order: 1 },
    { id: 2, text: "You have pivoted or grown, and your original brand story does not reflect where the business actually is now.", display_order: 2 },
    { id: 3, text: "You are hiring writers, designers, or agencies to extend the brand, and you need a single-source-of-truth document so everyone produces work that sounds like one brand.", display_order: 3 },
    { id: 4, text: "You have been meaning to fix your website for a year, but you keep getting pulled back into the business before it ever happens.", display_order: 4 },
    { id: 5, text: "You know the messaging needs a full rebuild, but you do not have the time, the system, or the writer in-house to pull it out of your head and put it on the page.", display_order: 5 },
  ];

  const renderTextWithEmphasis = (text: string) => {
    const emphasisWords = ["tight", "does not reflect", "single-source-of-truth", "pulled back", "pull it out of your head"];
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
      const { data: settingsData } = await supabase.from('foundation_consider_settings').select('*').eq('id', 1).single();
      if (settingsData) setSettings(settingsData);

      const { data: itemsData } = await supabase.from('foundation_consider_items').select('*').order('display_order', { ascending: true });
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
    <section ref={sectionRef} className="relative w-full py-28 px-6 overflow-hidden" style={{ backgroundColor: '#000000' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-[5%] w-[300px] h-[300px] bg-[#e9c08f]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[10%] w-[400px] h-[400px] bg-[#e6ee9c]/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight font-helvetica">You should consider this <span className="font-editorial italic">if</span></h2>
          <div className="w-16 h-px bg-white/20 mx-auto mt-4" />
        </div>
        <div className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="space-y-5">
            {displayItems.map((item, idx) => (
              <div key={item.id} className={`flex items-start gap-4 transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`} style={{ transitionDelay: `${idx * 75}ms` }}>
                <span className="text-white/30 text-xl mt-0.5">✦</span>
                <p className="text-lg md:text-xl text-white/70 leading-relaxed font-helvetica">{renderTextWithEmphasis(item.text)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}