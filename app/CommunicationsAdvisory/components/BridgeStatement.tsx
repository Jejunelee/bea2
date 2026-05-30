"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { AdvisoryBridgeSettings } from "@/app/types/CommunicationsAdvisory/BridgeStatement";
import Image from "next/image";

export default function BridgeStatement() {
  const [settings, setSettings] = useState<Partial<AdvisoryBridgeSettings>>({});
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('advisory_bridge_settings')
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

  if (loading) {
    return (
      <div 
        className="w-full py-16 animate-pulse" 
        style={{ backgroundColor: settings.background_color || '#ffffff' }}
      />
    );
  }

  // Dynamic styles
  const sectionStyle = {
    backgroundColor: settings.background_color || '#ffffff',
  };
  
  const textColorStyle = {
    color: settings.text_color || '#000000',
  };
  
  const mutedTextColorStyle = {
    color: settings.muted_text_color || 'rgba(0, 0, 0, 0.7)',
  };
  
  const accentColor = settings.accent_color || '#e9c08f';
  const glowIntensity = (settings.glow_intensity || 30) / 100;
  
  // Get content from settings or use defaults
  const mainText = settings.main_text || "Some founders do not need someone to run the work. They need someone who has done it at a high level, understands the food and hospitality industry specifically, and can sit alongside them monthly to make sure the strategy is sound, the messaging is consistent, and the big decisions are not being made in a vacuum.";
  const mainEmphasisPhrases = settings.main_emphasis_phrases || [];
  
  const closingText = settings.closing_text || "That is what Communications Advisory is built for.";
  
  const imageUrl = settings.image_url || "/CommsAdvisory/1-2.png";

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
          <div
            className={`transition-all duration-700 ease-out ${
              hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <p 
              className="text-base leading-relaxed font-helvetica"
              style={mutedTextColorStyle}
            >
              {renderTextWithEmphasis(mainText, mainEmphasisPhrases)}
            </p>

            <div className="mt-6 pt-4 border-t" style={{ borderColor: `${settings.text_color}10` }}>
              <p 
                className="text-base font-medium leading-relaxed font-helvetica"
                style={textColorStyle}
              >
                {closingText}
              </p>
            </div>

            <div className="mt-8 w-full relative aspect-[16/9]">
              <Image
                src={imageUrl}
                alt="Bridge statement illustration"
                fill
                className="object-cover rounded-lg"
                priority={false}
              />
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
        <div
          className={`transition-all duration-700 ease-out ${
            hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p 
            className="text-xl md:text-2xl lg:text-3xl leading-relaxed font-helvetica"
            style={mutedTextColorStyle}
          >
            {renderTextWithEmphasis(mainText, mainEmphasisPhrases)}
          </p>

          <div className="mt-10 pt-6 border-t" style={{ borderColor: `${settings.text_color}10` }}>
            <p 
              className="text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed font-helvetica"
              style={textColorStyle}
            >
              {closingText}
            </p>
            <div 
              className="h-px mt-6"
              style={{ backgroundColor: `${settings.text_color}15` }}
            />
          </div>

          <div className="mt-12 w-full relative aspect-[15/9]">
            <Image
              src={imageUrl}
              alt="Bridge statement illustration"
              fill
              className="object-cover rounded-lg"
              priority={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}