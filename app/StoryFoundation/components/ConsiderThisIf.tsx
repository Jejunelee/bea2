"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { FoundationConsiderSettings, FoundationConsiderItem } from "@/app/types/StoryFoundation/ConsiderThisIf";

export default function ConsiderThisIf() {
  const [settings, setSettings] = useState<Partial<FoundationConsiderSettings>>({});
  const [items, setItems] = useState<FoundationConsiderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: settingsData } = await supabase
        .from('foundation_consider_settings')
        .select('*')
        .eq('id', 1)
        .single();
      if (settingsData) setSettings(settingsData);

      const { data: itemsData } = await supabase
        .from('foundation_consider_items')
        .select('*')
        .order('display_order', { ascending: true });
      if (itemsData && itemsData.length > 0) setItems(itemsData);

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
        style={{ backgroundColor: settings.background_color || '#000000' }}
      />
    );
  }

  const displayItems = items.length > 0 ? items : [];
  
  // Dynamic styles
  const sectionStyle = {
    backgroundColor: settings.background_color || '#000000',
  };
  
  const textColorStyle = {
    color: settings.text_color || '#ffffff',
  };
  
  const mutedTextColorStyle = {
    color: settings.muted_text_color || 'rgba(255, 255, 255, 0.7)',
  };
  
  const iconColorStyle = {
    color: settings.icon_color || 'rgba(255, 255, 255, 0.3)',
  };
  
  const accentColor = settings.accent_color || '#e9c08f';
  const glowIntensity = (settings.glow_intensity || 30) / 100;
  
  // Get content from settings or use defaults
  const sectionTitle = settings.section_title || "You should consider this if";
  const italicWord = settings.italic_word || "if";
  const titleParts = sectionTitle.split(italicWord);
  
  const emphasisWords = settings.emphasis_words || [
    "tight",
    "does not reflect",
    "single-source-of-truth",
    "pulled back",
    "pull it out of your head"
  ];

  // Helper to render text with emphasis
  const renderTextWithEmphasis = (text: string) => {
    if (!emphasisWords.length) return text;

    let result = [];
    let lastIndex = 0;
    let textLower = text.toLowerCase();
    const sortedWords = [...emphasisWords].sort((a, b) => b.length - a.length);
    
    for (const word of sortedWords) {
      const wordLower = word.toLowerCase();
      const index = textLower.indexOf(wordLower);
      
      if (index !== -1) {
        if (index > lastIndex) {
          result.push(text.substring(lastIndex, index));
        }
        const foundWord = text.substring(index, index + word.length);
        result.push(
          <span key={index} className="font-editorial italic" style={textColorStyle}>
            {foundWord}
          </span>
        );
        lastIndex = index + word.length;
        textLower = textLower.substring(lastIndex);
      }
    }
    
    if (lastIndex < text.length) {
      result.push(text.substring(lastIndex));
    }
    
    return result.length > 0 ? result : text;
  };

  if (displayItems.length === 0) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full py-16 px-4 overflow-hidden"
        style={sectionStyle}
      >
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p style={textColorStyle}>No items available yet.</p>
        </div>
      </section>
    );
  }

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
            className="absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl"
            style={{ backgroundColor: `${accentColor}${Math.floor(glowIntensity * 40).toString(16).padStart(2, '0')}` }}
          />
          <div 
            className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl"
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
              {displayItems.map((item, idx) => (
                <div 
                  key={item.id} 
                  className={`flex items-start gap-3 transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`} 
                  style={{ transitionDelay: `${idx * 75}ms` }}
                >
                  <span className="text-base mt-0.5" style={iconColorStyle}>✦</span>
                  <p className="text-base leading-relaxed font-helvetica" style={mutedTextColorStyle}>
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

  // ========== DESKTOP LAYOUT ==========
  return (
    <section
      ref={sectionRef}
      className="relative w-full py-28 px-6 overflow-hidden"
      style={sectionStyle}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-20 left-[5%] w-[300px] h-[300px] rounded-full blur-3xl"
          style={{ backgroundColor: `${accentColor}${Math.floor(glowIntensity * 40).toString(16).padStart(2, '0')}` }}
        />
        <div 
          className="absolute bottom-20 right-[10%] w-[400px] h-[400px] rounded-full blur-3xl"
          style={{ backgroundColor: `${accentColor}${Math.floor(glowIntensity * 30).toString(16).padStart(2, '0')}` }}
        />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="mb-10 text-center">
          <h2 
            className="text-2xl md:text-3xl font-medium tracking-tight font-helvetica"
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
          <div className="space-y-5">
            {displayItems.map((item, idx) => (
              <div 
                key={item.id} 
                className={`flex items-start gap-4 transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`} 
                style={{ transitionDelay: `${idx * 75}ms` }}
              >
                <span className="text-xl mt-0.5" style={iconColorStyle}>✦</span>
                <p className="text-lg md:text-xl leading-relaxed font-helvetica" style={mutedTextColorStyle}>
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