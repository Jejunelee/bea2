"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { WhatYouGetSettings, Deliverable } from "@/app/types/StoryAudit/WhatYouGet";

export default function WhatYouGet() {
  const [settings, setSettings] = useState<Partial<WhatYouGetSettings>>({});
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch settings
      const { data: settingsData } = await supabase
        .from('audit_deliverables_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (settingsData) setSettings(settingsData);

      // Fetch deliverables
      const { data: deliverablesData } = await supabase
        .from('audit_deliverables')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (deliverablesData && deliverablesData.length > 0) {
        setDeliverables(deliverablesData);
      }

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
      {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    observer.observe(currentSection);

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, [hasAnimated, loading]);

  if (loading) {
    return (
      <div 
        className="w-full py-16 animate-pulse" 
        style={{ backgroundColor: settings.background_color || '#000000' }}
      />
    );
  }

  const displayDeliverables = deliverables.length > 0 ? deliverables : [];
  
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
  
  const checkmarkBgStyle = {
    backgroundColor: settings.checkmark_background_color || 'rgba(255, 255, 255, 0.1)',
  };
  
  const checkmarkIconStyle = {
    color: settings.checkmark_icon_color || 'rgba(255, 255, 255, 0.4)',
  };
  
  const accentColor = settings.accent_color || '#e9c08f';
  const glowIntensity = (settings.glow_intensity || 30) / 100;
  
  // Get content from settings or use defaults
  const sectionTitle = settings.section_title || "What you get";
  const italicWord = settings.italic_word || "get";
  const titleParts = sectionTitle.split(italicWord);
  
  const titleEmphasisWords = settings.title_emphasis_words || {};
  const descriptionEmphasisPhrases = settings.description_emphasis_phrases || [
    "walk through the business",
    "specific examples and screenshots",
    "30, 60, and 90-day",
    "pressure-test the recommendations",
    "in case anything comes up"
  ];

  // Helper to render title with italic emphasis
  const renderTitle = (title: string) => {
    // Check if there's a custom emphasis mapping for this title
    const customEmphasis = titleEmphasisWords[title];
    if (customEmphasis) {
      const parts = title.split(customEmphasis);
      return (
        <>
          {parts[0]}
          <span className="font-editorial italic" style={textColorStyle}>
            {customEmphasis}
          </span>
          {parts[1]}
        </>
      );
    }
    
    // Default: italicize the last word
    const words = title.split(' ');
    const lastWord = words.pop();
    return (
      <>
        {words.join(' ')} {words.length > 0 && ' '}
        <span className="font-editorial italic" style={textColorStyle}>
          {lastWord}
        </span>
      </>
    );
  };

  // Helper to render description with italic emphasis on key phrases
  const renderDescription = (description: string) => {
    if (!descriptionEmphasisPhrases.length) return description;

    let result = [];
    let lastIndex = 0;
    let descLower = description.toLowerCase();
    const sortedPhrases = [...descriptionEmphasisPhrases].sort((a, b) => b.length - a.length);
    
    for (const phrase of sortedPhrases) {
      const phraseLower = phrase.toLowerCase();
      const index = descLower.indexOf(phraseLower);
      
      if (index !== -1) {
        if (index > lastIndex) {
          result.push(description.substring(lastIndex, index));
        }
        const foundPhrase = description.substring(index, index + phrase.length);
        result.push(
          <span key={index} className="font-editorial italic" style={mutedTextColorStyle}>
            {foundPhrase}
          </span>
        );
        lastIndex = index + phrase.length;
        descLower = descLower.substring(lastIndex);
      }
    }
    
    if (lastIndex < description.length) {
      result.push(description.substring(lastIndex));
    }
    
    return result.length > 0 ? result : description;
  };

  if (displayDeliverables.length === 0) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full py-16 px-4 overflow-hidden"
        style={sectionStyle}
      >
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p style={textColorStyle}>No deliverables available yet.</p>
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
        {/* Subtle glow blobs */}
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
          {/* Header with editorial italic */}
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

          <div
            className={`transition-all duration-700 ease-out ${
              hasAnimated
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <div className="space-y-5">
              {displayDeliverables.map((item, idx) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-3 transition-all duration-700 ease-out ${
                    hasAnimated
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-4"
                  }`}
                  style={{ transitionDelay: `${idx * 75}ms` }}
                >
                  {/* Checkmark */}
                  <div 
                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                    style={checkmarkBgStyle}
                  >
                    <svg 
                      className="w-3 h-3" 
                      style={checkmarkIconStyle}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 
                      className="text-base font-semibold mb-1 font-helvetica"
                      style={textColorStyle}
                    >
                      {renderTitle(item.title)}
                    </h3>
                    <p 
                      className="text-sm leading-relaxed font-helvetica"
                      style={mutedTextColorStyle}
                    >
                      {renderDescription(item.description)}
                    </p>
                  </div>
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
      {/* Subtle glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-20 left-[5%] w-[300px] h-[300px] rounded-full blur-3xl"
          style={{ backgroundColor: `${accentColor}${Math.floor(glowIntensity * 40).toString(16).padStart(2, '0')}` }}
        />
        <div 
          className="absolute bottom-20 right-[10%] w-[400px] h-[400px] rounded-full blur-3xl"
          style={{ backgroundColor: `${accentColor}${Math.floor(glowIntensity * 30).toString(16).padStart(2, '0')}` }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ backgroundColor: `${settings.text_color}05` }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header with editorial italic */}
        <div className="mb-12 text-center">
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

        <div
          className={`transition-all duration-700 ease-out ${
            hasAnimated
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="grid md:grid-cols-2 gap-8">
            {displayDeliverables.map((item, idx) => (
              <div
                key={item.id}
                className={`flex items-start gap-4 transition-all duration-700 ease-out ${
                  hasAnimated
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-6"
                }`}
                style={{ transitionDelay: `${idx * 75}ms` }}
              >
                {/* Checkmark circle */}
                <div 
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1"
                  style={checkmarkBgStyle}
                >
                  <svg 
                    className="w-4 h-4" 
                    style={checkmarkIconStyle}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 
                    className="text-xl font-semibold mb-2 font-helvetica"
                    style={textColorStyle}
                  >
                    {renderTitle(item.title)}
                  </h3>
                  <p 
                    className="text-base md:text-lg leading-relaxed font-helvetica"
                    style={mutedTextColorStyle}
                  >
                    {renderDescription(item.description)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}