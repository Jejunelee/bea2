"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { FractionalHowItWorksSettings } from "@/app/types/FractionalCommunication/HowThisWorks";

export default function HowThisWorks() {
  const [settings, setSettings] = useState<Partial<FractionalHowItWorksSettings>>({});
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('fractional_howitworks_settings')
        .select('*')
        .eq('id', 1)
        .single();
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
      (entries) => { 
        entries.forEach((entry) => { 
          if (entry.isIntersecting && !hasAnimated) setHasAnimated(true); 
        }); 
      },
      { threshold: 0.2, rootMargin: "0px 0px -100px 0px" }
    );
    observer.observe(currentSection);
    return () => { if (currentSection) observer.unobserve(currentSection); };
  }, [hasAnimated, loading]);

  if (loading) {
    return (
      <div 
        className="w-full py-16 animate-pulse" 
        style={{ backgroundColor: settings.background_color || '#f5f3ef' }}
      />
    );
  }

  // Dynamic styles
  const sectionStyle = {
    backgroundColor: settings.background_color || '#f5f3ef',
  };
  
  const textColorStyle = {
    color: settings.text_color || '#000000',
  };
  
  const mutedTextColorStyle = {
    color: settings.muted_text_color || 'rgba(0, 0, 0, 0.7)',
  };
  
  const cardTextColorStyle = {
    color: settings.card_text_color || 'rgba(0, 0, 0, 0.8)',
  };
  
  const accentColor = settings.accent_color || '#e9c08f';
  const glowIntensity = (settings.glow_intensity || 30) / 100;
  
  const cardStyle = {
    backgroundColor: settings.card_background_color || 'rgba(255, 255, 255, 0.5)',
    borderColor: settings.card_border_color || 'rgba(255, 255, 255, 0.2)',
  };
  
  // Get content from settings or use defaults
  const sectionTitle = settings.section_title || "A bit about how this works";
  const italicWord = settings.italic_word || "works";
  const titleParts = sectionTitle.split(italicWord);
  
  const paragraphOne = settings.paragraph_one || "Fractional Comms is not a content factory. I am not going to send you 50 social posts a month and call it strategy. The work is built around what your brand actually needs each quarter, which is usually fewer, sharper outputs across the channels that earn or lose customers for you.";
  const paragraphOneEmphasis = settings.paragraph_one_emphasis || ["content factory"];
  
  const paragraphTwo = settings.paragraph_two || "It is also not a one-size-fits-all retainer. Some clients need heavy content execution. Some need PR and partnership lead. Some need founder voice and editorial coaching. The scope is built in the proposal, and we calibrate quarterly.";
  const paragraphTwoEmphasis = settings.paragraph_two_emphasis || ["one-size-fits-all retainer"];
  
  const calloutText = settings.callout_text || "If what you actually need is a one-off audit, that is the Story Audit. If you need a full messaging rebuild, that is the Story Foundation. Fractional Comms is for ongoing partnership where I am in the business, running the work.";
  const calloutEmphasis = settings.callout_emphasis || ["Story Audit", "Story Foundation"];

  // Helper to render text with emphasis
  const renderTextWithEmphasis = (text: string, emphasisPhrases: string[]) => {
    if (!emphasisPhrases.length) return text;

    let result = [];
    let lastIndex = 0;
    let textLower = text.toLowerCase();
    const sortedPhrases = [...emphasisPhrases].sort((a, b) => b.length - a.length);
    
    for (const phrase of sortedPhrases) {
      const phraseLower = phrase.toLowerCase();
      const index = textLower.indexOf(phraseLower);
      
      if (index !== -1) {
        if (index > lastIndex) {
          result.push(text.substring(lastIndex, index));
        }
        const foundPhrase = text.substring(index, index + phrase.length);
        result.push(
          <span key={index} className="font-editorial italic" style={textColorStyle}>
            {foundPhrase}
          </span>
        );
        lastIndex = index + phrase.length;
        textLower = textLower.substring(lastIndex);
      }
    }
    
    if (lastIndex < text.length) {
      result.push(text.substring(lastIndex));
    }
    
    return result.length > 0 ? result : text;
  };

  // ========== MOBILE LAYOUT ==========
  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full py-16 px-4 overflow-hidden"
        style={sectionStyle}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl"
            style={{ backgroundColor: `${accentColor}${Math.floor(glowIntensity * 40).toString(16).padStart(2, '0')}` }}
          />
          <div 
            className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl"
            style={{ backgroundColor: `${accentColor}${Math.floor(glowIntensity * 30).toString(16).padStart(2, '0')}` }}
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h2 
              className="text-xl font-medium tracking-tight font-helvetica"
              style={textColorStyle}
            >
              {titleParts[0]}
              <span className="font-editorial italic" style={textColorStyle}>
                {italicWord}
              </span>
              {titleParts[1]}
            </h2>
            <div 
              className="w-12 h-px mx-auto mt-3"
              style={{ backgroundColor: `${settings.text_color}20` }}
            />
          </div>
          <div className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="space-y-4">
              <p 
                className="text-base leading-relaxed font-helvetica"
                style={mutedTextColorStyle}
              >
                {renderTextWithEmphasis(paragraphOne, paragraphOneEmphasis)}
              </p>
              <p 
                className="text-base leading-relaxed font-helvetica"
                style={mutedTextColorStyle}
              >
                {renderTextWithEmphasis(paragraphTwo, paragraphTwoEmphasis)}
              </p>
              <div 
                className="rounded-xl p-5 border"
                style={cardStyle}
              >
                <p 
                  className="text-base leading-relaxed font-helvetica"
                  style={cardTextColorStyle}
                >
                  {renderTextWithEmphasis(calloutText, calloutEmphasis)}
                </p>
              </div>
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
      className="relative w-full py-28 px-6 sm:px-8 lg:px-12 overflow-hidden"
      style={sectionStyle}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-20 right-[10%] w-[350px] h-[350px] rounded-full blur-3xl"
          style={{ backgroundColor: `${accentColor}${Math.floor(glowIntensity * 40).toString(16).padStart(2, '0')}` }}
        />
        <div 
          className="absolute bottom-20 left-[5%] w-[400px] h-[400px] rounded-full blur-3xl"
          style={{ backgroundColor: `${accentColor}${Math.floor(glowIntensity * 30).toString(16).padStart(2, '0')}` }}
        />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <h2 
            className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight font-helvetica"
            style={textColorStyle}
          >
            {titleParts[0]}
            <span className="font-editorial italic" style={textColorStyle}>
              {italicWord}
            </span>
            {titleParts[1]}
          </h2>
          <div 
            className="w-16 h-px mx-auto mt-4"
            style={{ backgroundColor: `${settings.text_color}20` }}
          />
        </div>
        <div className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="space-y-6">
            <p 
              className="text-lg md:text-xl leading-relaxed font-helvetica"
              style={mutedTextColorStyle}
            >
              {renderTextWithEmphasis(paragraphOne, paragraphOneEmphasis)}
            </p>
            <p 
              className="text-lg md:text-xl leading-relaxed font-helvetica"
              style={mutedTextColorStyle}
            >
              {renderTextWithEmphasis(paragraphTwo, paragraphTwoEmphasis)}
            </p>
            <div 
              className="rounded-2xl p-8 border mt-8"
              style={cardStyle}
            >
              <p 
                className="text-xl md:text-2xl leading-relaxed font-helvetica"
                style={cardTextColorStyle}
              >
                {renderTextWithEmphasis(calloutText, calloutEmphasis)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}