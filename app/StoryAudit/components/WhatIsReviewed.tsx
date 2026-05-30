"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { WhatIsReviewedSettings, ReviewArea } from "@/app/types/StoryAudit/WhatIsReviewed";
import Image from "next/image";

export default function WhatIsReviewed() {
  const [settings, setSettings] = useState<Partial<WhatIsReviewedSettings>>({});
  const [reviewAreas, setReviewAreas] = useState<ReviewArea[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch settings
      const { data: settingsData } = await supabase
        .from('audit_review_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (settingsData) setSettings(settingsData);

      // Fetch review areas
      const { data: areasData } = await supabase
        .from('audit_review_areas')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (areasData && areasData.length > 0) {
        setReviewAreas(areasData);
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
        style={{ backgroundColor: settings.background_color || '#fefdf8' }}
      />
    );
  }

  const displayAreas = reviewAreas.length > 0 ? reviewAreas : [];
  
  // Dynamic styles
  const sectionStyle = {
    backgroundColor: settings.background_color || '#fefdf8',
  };
  
  const textColorStyle = {
    color: settings.text_color || '#000000',
  };
  
  const mutedTextColorStyle = {
    color: settings.muted_text_color || 'rgba(0, 0, 0, 0.6)',
  };
  
  const accentColor = settings.accent_color || '#e9c08f';
  const glowIntensity = (settings.glow_intensity || 30) / 100;
  
  // Get content from settings or use defaults
  const sectionTitle = settings.section_title || "What the audit reviews";
  const italicWord = settings.italic_word || "reviews";
  const titleParts = sectionTitle.split(italicWord);
  
  const imageUrl = settings.image_url || "/StoryAudit/2.png";
  const quoteText = settings.quote_text || "Built on a decade of writing about food — and a lifetime spent inside the restaurants, kitchens, and brands shaping it.";
  const quoteAuthor = settings.quote_author || "";
  
  // Helper to render title with italic emphasis on the last word
  const renderTitle = (title: string) => {
    // If there's a custom emphasis word from settings, use that
    if (settings.title_emphasis_words && settings.title_emphasis_words.length > 0) {
      const emphasisWord = settings.title_emphasis_words[0];
      if (title.toLowerCase().includes(emphasisWord.toLowerCase())) {
        const parts = title.split(new RegExp(`(${emphasisWord})`, 'i'));
        return (
          <>
            {parts[0]}
            <span className="font-editorial italic" style={textColorStyle}>
              {parts[1]}
            </span>
            {parts[2]}
          </>
        );
      }
    }
    
    // Default behavior: italicize the last word
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

  if (displayAreas.length === 0) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full py-16 px-4 overflow-hidden"
        style={sectionStyle}
      >
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p style={textColorStyle}>No review areas available yet.</p>
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
        {/* Warm glow blobs */}
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
            <div className="space-y-6">
              {displayAreas.map((area, idx) => (
                <div
                  key={area.id}
                  className={`transition-all duration-700 ease-out ${
                    hasAnimated
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  <h3 
                    className="text-lg font-semibold mb-2 font-helvetica"
                    style={textColorStyle}
                  >
                    {renderTitle(area.title)}
                  </h3>
                  <p 
                    className="text-base leading-relaxed font-helvetica"
                    style={mutedTextColorStyle}
                  >
                    {area.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Image + Quote Section */}
            <div className="mt-12">
              {/* Image Container */}
              <div className="w-full relative aspect-[16/9] rounded-lg overflow-hidden shadow-lg mb-6">
                <Image
                  src={imageUrl}
                  alt="Story audit review process illustration showing brand analysis"
                  fill
                  className="object-cover"
                  style={{ objectPosition: '50% 30%' }}
                  priority={false}
                />
              </div>
              
              {/* Quote Container */}
              <div 
                className="relative rounded-lg p-6"
                style={{ backgroundColor: `${accentColor}10` }}
              >
                <svg 
                  className="w-6 h-6 absolute top-4 left-4"
                  style={{ color: `${accentColor}80` }}
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p 
                  className="text-base italic leading-relaxed font-editorial px-4 py-8"
                  style={{ color: mutedTextColorStyle.color }}
                >
                  {quoteText}
                </p>
                <svg 
                  className="w-6 h-6 absolute bottom-4 right-4 rotate-180"
                  style={{ color: `${accentColor}80` }}
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                {quoteAuthor && (
                  <div className="mt-2 text-center">
                    <div 
                      className="w-12 h-px mx-auto"
                      style={{ backgroundColor: accentColor }}
                    />
                    <p 
                      className="text-sm mt-2 font-helvetica"
                      style={{ color: mutedTextColorStyle.color }}
                    >
                      — {quoteAuthor}
                    </p>
                  </div>
                )}
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
      className="relative w-full py-28 px-6 overflow-hidden"
      style={sectionStyle}
    >
      {/* Warm glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-20 right-[10%] w-[350px] h-[350px] rounded-full blur-3xl"
          style={{ backgroundColor: `${accentColor}${Math.floor(glowIntensity * 40).toString(16).padStart(2, '0')}` }}
        />
        <div 
          className="absolute bottom-20 left-[5%] w-[400px] h-[400px] rounded-full blur-3xl"
          style={{ backgroundColor: `${accentColor}${Math.floor(glowIntensity * 30).toString(16).padStart(2, '0')}` }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ backgroundColor: `${settings.text_color}05` }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
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
          {/* Review Areas Grid */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {displayAreas.map((area, idx) => (
              <div
                key={area.id}
                className={`transition-all duration-700 ease-out ${
                  hasAnimated
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-start gap-3">
                  {/* Decorative number */}
                  <span 
                    className="text-4xl font-editorial italic"
                    style={{ color: `${settings.text_color}10` }}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <h3 
                      className="text-xl md:text-2xl font-semibold mb-3 font-helvetica"
                      style={textColorStyle}
                    >
                      {renderTitle(area.title)}
                    </h3>
                    <p 
                      className="text-base md:text-lg leading-relaxed font-helvetica"
                      style={mutedTextColorStyle}
                    >
                      {area.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Image + Quote Section */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image Container */}
            <div className="w-full relative aspect-[11/12] rounded-lg overflow-hidden shadow-lg order-1">
              <Image
                src={imageUrl}
                alt="Story audit review process illustration showing brand analysis across different channels"
                fill
                className="object-cover"
                priority={false}
              />
            </div>
            
            {/* Quote Container */}
            <div 
              className="relative rounded-lg p-8 py-24 order-2"
              style={{ backgroundColor: `${accentColor}10` }}
            >
              <svg 
                className="w-8 h-8 absolute top-6 left-6"
                style={{ color: `${accentColor}80` }}
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p 
                className="text-xl lg:text-3xl italic leading-relaxed font-editorial px-6 py-20"
                style={{ color: mutedTextColorStyle.color }}
              >
                {quoteText}
              </p>
              <svg 
                className="w-8 h-8 absolute bottom-6 right-6 rotate-180"
                style={{ color: `${accentColor}80` }}
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              {quoteAuthor && (
                <div className="mt-4 text-center">
                  <div 
                    className="w-12 h-px mx-auto"
                    style={{ backgroundColor: accentColor }}
                  />
                  <p 
                    className="text-sm mt-2 font-helvetica"
                    style={{ color: mutedTextColorStyle.color }}
                  >
                    — {quoteAuthor}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}