"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { FractionalCTASettings } from "@/app/types/FractionalCommunication/CTASection";

export default function CTASection() {
  const [settings, setSettings] = useState<Partial<FractionalCTASettings>>({});
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('fractional_cta_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (data) setSettings(data);
      setLoading(false);
    };

    fetchSettings();
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
      { threshold: 0.2, rootMargin: "0px 0px -100px 0px" }
    );

    observer.observe(currentSection);
    return () => { if (currentSection) observer.unobserve(currentSection); };
  }, [hasAnimated, loading]);

  const createCalendarEvent = () => {
    const bookingUrl = settings.booking_url || "https://calendar.app.google/kZ2VsHYE7Nz9WFZ77";
    window.open(bookingUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div 
        className="w-full py-16 animate-pulse" 
        style={{ backgroundColor: settings.background_color || '#000000' }}
      />
    );
  }

  // Dynamic styles
  const sectionStyle = {
    backgroundColor: settings.background_color || '#000000',
  };
  
  const textColorStyle = {
    color: settings.text_color || '#ffffff',
  };
  
  const mutedTextColorStyle = {
    color: settings.muted_text_color || 'rgba(255, 255, 255, 0.6)',
  };
  
  const buttonStyle = {
    backgroundColor: settings.button_background_color || '#ffffff',
    color: settings.button_text_color || '#000000',
  };
  
  const accentColor = settings.accent_color || '#e9c08f';
  const glowIntensity = (settings.glow_intensity || 30) / 100;
  
  // Get content from settings or use defaults
  const headline = settings.headline || "Start the conversation";
  const italicWord = settings.italic_word || "conversation";
  const headlineParts = headline.split(italicWord);
  const hasItalicWord = headlineParts.length > 1;
  
  const subheadline = settings.subheadline || "If you are running a food or hospitality brand and you are tired of managing communications between everything else, the first step is a 30-minute call to talk through what the work could look like.";
  const buttonText = settings.button_text || "Book a call";

  // ========== MOBILE LAYOUT ==========
  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full py-20 px-4 overflow-hidden"
        style={sectionStyle}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl"
            style={{ backgroundColor: `${accentColor}${Math.floor(glowIntensity * 40).toString(16).padStart(2, '0')}` }}
          />
          <div 
            className="absolute bottom-0 right-0 w-60 h-60 rounded-full blur-3xl"
            style={{ backgroundColor: `${accentColor}${Math.floor(glowIntensity * 20).toString(16).padStart(2, '0')}` }}
          />
          <div 
            className="absolute top-0 left-0 w-60 h-60 rounded-full blur-3xl"
            style={{ backgroundColor: `${accentColor}${Math.floor(glowIntensity * 20).toString(16).padStart(2, '0')}` }}
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <h2 
              className="text-2xl font-medium mb-3 font-helvetica tracking-tight"
              style={textColorStyle}
            >
              {hasItalicWord ? (
                <>
                  {headlineParts[0]}
                  <span className="font-editorial italic" style={textColorStyle}>
                    {italicWord}
                  </span>
                  {headlineParts[1]}
                </>
              ) : (
                headline
              )}
            </h2>
            <p 
              className="text-base leading-relaxed mb-8 font-helvetica max-w-md mx-auto"
              style={mutedTextColorStyle}
            >
              {subheadline}
            </p>
            <button
              onClick={createCalendarEvent}
              className="group relative rounded-full text-base font-medium px-8 py-3 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 overflow-hidden"
              style={buttonStyle}
            >
              <span className="relative z-10 flex items-center gap-2">
                {buttonText}
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ========== DESKTOP LAYOUT ==========
  return (
    <section
      ref={sectionRef}
      className="relative w-full py-32 px-6 sm:px-8 lg:px-12 overflow-hidden"
      style={sectionStyle}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ backgroundColor: `${accentColor}${Math.floor(glowIntensity * 40).toString(16).padStart(2, '0')}` }}
        />
        <div 
          className="absolute bottom-10 right-[15%] w-[300px] h-[300px] rounded-full blur-3xl"
          style={{ backgroundColor: `${accentColor}${Math.floor(glowIntensity * 20).toString(16).padStart(2, '0')}` }}
        />
        <div 
          className="absolute top-10 left-[10%] w-[250px] h-[250px] rounded-full blur-3xl"
          style={{ backgroundColor: `${accentColor}${Math.floor(glowIntensity * 20).toString(16).padStart(2, '0')}` }}
        />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-medium mb-4 font-helvetica tracking-tight"
            style={textColorStyle}
          >
            {hasItalicWord ? (
              <>
                {headlineParts[0]}
                <span className="font-editorial italic" style={textColorStyle}>
                  {italicWord}
                </span>
                {headlineParts[1]}
              </>
            ) : (
              headline
            )}
          </h2>
          <p 
            className="text-lg md:text-xl lg:text-2xl leading-relaxed mb-10 font-helvetica max-w-3xl mx-auto"
            style={mutedTextColorStyle}
          >
            {subheadline}
          </p>
          <button
            onClick={createCalendarEvent}
            className="group relative rounded-full text-base md:text-lg lg:text-xl font-medium px-10 py-4 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 overflow-hidden"
            style={buttonStyle}
          >
            <span className="relative z-10 flex items-center gap-2">
              {buttonText}
              <svg
                className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}