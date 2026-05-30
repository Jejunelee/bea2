"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { TestimonialsSettings, Testimonial } from "@/app/types/StoryAudit/Testimonials";

export default function Testimonials() {
  const [settings, setSettings] = useState<Partial<TestimonialsSettings>>({});
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: settingsData } = await supabase
        .from('audit_testimonials_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (settingsData) setSettings(settingsData);

      const { data: testimonialsData } = await supabase
        .from('audit_testimonials')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (testimonialsData && testimonialsData.length > 0) {
        setTestimonials(testimonialsData);
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

  // FIXED: Loading state with hardcoded color
  if (loading) {
    return (
      <div 
        className="w-full py-16 animate-pulse" 
        style={{ backgroundColor: '#f5f3ef' }}
      />
    );
  }

  const displayTestimonials = testimonials.length > 0 ? testimonials : [];
  const count = displayTestimonials.length;

  // Dynamic styles
  const gradientStart = settings.background_gradient_start || '#ffffff';
  const gradientMiddle = settings.background_gradient_middle || '#f5f3ef';
  const gradientEnd = settings.background_gradient_end || '#f5f3ef';
  const backgroundGradient = `linear-gradient(to bottom, ${gradientStart} 0%, ${gradientMiddle} 30%, ${gradientEnd} 100%)`;
  
  const textColorStyle = {
    color: settings.text_color || '#000000',
  };
  
  const mutedTextColorStyle = {
    color: settings.muted_text_color || 'rgba(0, 0, 0, 0.7)',
  };
  
  const authorTextColorStyle = {
    color: settings.author_text_color || 'rgba(0, 0, 0, 0.4)',
  };
  
  const accentColor = settings.accent_color || '#e9c08f';
  const glowIntensity = (settings.glow_intensity || 30) / 100;
  
  // Get content from settings or use defaults
  const sectionTitle = settings.section_title || "What clients say";
  const italicWord = settings.italic_word || "clients";
  const titleParts = sectionTitle.split(italicWord);
  
  const quoteEmphasisPhrases = settings.quote_emphasis_phrases || [
    "clarity I'd been missing",
    "completely different response"
  ];

  // Helper to render quote with emphasis on key phrases
  const renderQuoteWithEmphasis = (quote: string) => {
    if (!quoteEmphasisPhrases.length) return quote;

    let result = [];
    let lastIndex = 0;
    let quoteLower = quote.toLowerCase();
    const sortedPhrases = [...quoteEmphasisPhrases].sort((a, b) => b.length - a.length);
    
    for (const phrase of sortedPhrases) {
      const phraseLower = phrase.toLowerCase();
      const index = quoteLower.indexOf(phraseLower);
      
      if (index !== -1) {
        if (index > lastIndex) {
          result.push(quote.substring(lastIndex, index));
        }
        const foundPhrase = quote.substring(index, index + phrase.length);
        result.push(
          <span key={index} className="font-editorial italic" style={textColorStyle}>
            {foundPhrase}
          </span>
        );
        lastIndex = index + phrase.length;
        quoteLower = quoteLower.substring(lastIndex);
      }
    }
    
    if (lastIndex < quote.length) {
      result.push(quote.substring(lastIndex));
    }
    
    return result.length > 0 ? result : quote;
  };

  // Determine grid layout based on number of testimonials
  const getGridClass = () => {
    if (count === 1) return "md:grid-cols-1 max-w-3xl mx-auto";
    if (count === 2) return "md:grid-cols-2 max-w-4xl mx-auto";
    return "md:grid-cols-3 max-w-6xl mx-auto";
  };

  if (displayTestimonials.length === 0) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full py-16 px-4 overflow-hidden"
        style={{ background: backgroundGradient }}
      >
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p style={textColorStyle}>No testimonials available yet.</p>
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
        style={{ background: backgroundGradient }}
      >
        {/* Warm glow blobs */}
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
          {/* Header */}
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
            <div className="space-y-8">
              {displayTestimonials.map((testimonial, idx) => (
                <div
                  key={testimonial.id}
                  className={`transition-all duration-700 ease-out ${
                    hasAnimated
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  <div className="text-center">
                    <p 
                      className="text-xl leading-relaxed font-helvetica mb-4"
                      style={mutedTextColorStyle}
                    >
                      {renderQuoteWithEmphasis(testimonial.quote)}
                    </p>
                    {testimonial.author && (
                      <p 
                        className="text-base font-helvetica"
                        style={authorTextColorStyle}
                      >
                        — {testimonial.author}
                        {testimonial.role && `, ${testimonial.role}`}
                        {testimonial.company && `, ${testimonial.company}`}
                      </p>
                    )}
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
      style={{ background: backgroundGradient }}
    >
      {/* Warm glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-20 left-[10%] w-[300px] h-[300px] rounded-full blur-3xl"
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

      <div className="relative z-10 mx-auto">
        {/* Header */}
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
          <div className={`grid ${getGridClass()} gap-8`}>
            {displayTestimonials.map((testimonial, idx) => (
              <div
                key={testimonial.id}
                className={`transition-all duration-700 ease-out ${
                  hasAnimated
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="text-center">
                  <p 
                    className="text-2xl md:text-3xl leading-relaxed font-helvetica mb-5"
                    style={mutedTextColorStyle}
                  >
                    {renderQuoteWithEmphasis(testimonial.quote)}
                  </p>
                  {testimonial.author && (
                    <div className="pt-4">
                      <p 
                        className="text-base md:text-lg font-helvetica"
                        style={authorTextColorStyle}
                      >
                        — {testimonial.author}
                        {testimonial.role && `, ${testimonial.role}`}
                        {testimonial.company && `, ${testimonial.company}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}