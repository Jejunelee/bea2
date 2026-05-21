// app/components/foundation/HowThisWorks.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { HowThisWorksSettings } from "@/app/types/foundation";

export default function HowThisWorks() {
  const [settings, setSettings] = useState<Partial<HowThisWorksSettings>>({});
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('foundation_howitworks_settings').select('*').eq('id', 1).single();
      if (data) setSettings(data);
      setLoading(false);
    };
    fetchSettings();
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

  if (loading) return <div className="w-full py-16" style={{ backgroundColor: '#f5f3ef' }}></div>;

  const renderTextWithEmphasis = (text: string) => {
    const emphasisPhrases = ["not a brand strategy retreat", "not a content factory", "Comms Advisory"];
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
      <section ref={sectionRef} className="relative w-full py-16 px-4 overflow-hidden" style={{ backgroundColor: '#f5f3ef' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#e9c08f]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#e6ee9c]/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-medium text-black tracking-tight font-helvetica">A bit about how this <span className="font-editorial italic">works</span></h2>
            <div className="w-12 h-px bg-black/20 mx-auto mt-3" />
          </div>
          <div className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="space-y-4">
              <p className="text-base text-black/70 leading-relaxed font-helvetica">{renderTextWithEmphasis("The Foundation is not a brand strategy retreat. There is no offsite, no whiteboard exercise, no manifesto. It is a structured writing engagement that produces real, deployed work.")}</p>
              <p className="text-base text-black/70 leading-relaxed font-helvetica">{renderTextWithEmphasis("It is also not a content factory. I am not going to send you 50 social captions and call it activation. The three priority assets are chosen because they are the ones that earn or lose customers for you, and they are written carefully, in your voice, to last.")}</p>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-black/5">
                <p className="text-base text-black/80 leading-relaxed font-helvetica">If what you actually need is one asset rebuilt rather than three, or a higher volume of content over a longer engagement, that is probably <span className="font-editorial italic text-black">Comms Advisory</span>, not the Foundation.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative w-full py-28 px-6 overflow-hidden" style={{ backgroundColor: '#f5f3ef' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-[10%] w-[350px] h-[350px] bg-[#e9c08f]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-[5%] w-[400px] h-[400px] bg-[#e6ee9c]/20 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-medium text-black tracking-tight font-helvetica">A bit about how this <span className="font-editorial italic">works</span></h2>
          <div className="w-16 h-px bg-black/20 mx-auto mt-4" />
        </div>
        <div className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="space-y-6">
            <p className="text-lg md:text-xl text-black/70 leading-relaxed font-helvetica">{renderTextWithEmphasis("The Foundation is not a brand strategy retreat. There is no offsite, no whiteboard exercise, no manifesto. It is a structured writing engagement that produces real, deployed work.")}</p>
            <p className="text-lg md:text-xl text-black/70 leading-relaxed font-helvetica">{renderTextWithEmphasis("It is also not a content factory. I am not going to send you 50 social captions and call it activation. The three priority assets are chosen because they are the ones that earn or lose customers for you, and they are written carefully, in your voice, to last.")}</p>
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mt-8">
              <p className="text-xl md:text-2xl text-black/70 leading-relaxed font-helvetica">If what you actually need is one asset rebuilt rather than three, or a higher volume of content over a longer engagement, that is probably <span className="font-editorial italic text-black">Comms Advisory</span>, not the Foundation.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}