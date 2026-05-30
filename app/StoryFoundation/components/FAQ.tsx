"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { FoundationFAQSettings, FoundationFAQItem } from "@/app/types/StoryFoundation/FAQ";

export default function FAQ() {
  const [settings, setSettings] = useState<Partial<FoundationFAQSettings>>({});
  const [faqs, setFaqs] = useState<FoundationFAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: settingsData } = await supabase
        .from('foundation_faq_settings')
        .select('*')
        .eq('id', 1)
        .single();
      if (settingsData) setSettings(settingsData);
      
      const { data: faqsData } = await supabase
        .from('foundation_faq_items')
        .select('*')
        .order('display_order', { ascending: true });
      if (faqsData && faqsData.length > 0) setFaqs(faqsData);
      
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

  const toggleFAQ = (index: number) => setOpenIndex(openIndex === index ? null : index);

  if (loading) {
    return (
      <div 
        className="w-full py-16 animate-pulse" 
        style={{ backgroundColor: settings.background_color || '#f5f3ef' }}
      />
    );
  }

  const displayFaqs = faqs.length > 0 ? faqs : [];
  
  // Dynamic styles
  const sectionStyle = {
    backgroundColor: settings.background_color || '#f5f3ef',
  };
  
  const textColorStyle = {
    color: settings.text_color || '#000000',
  };
  
  const mutedTextColorStyle = {
    color: settings.muted_text_color || 'rgba(0, 0, 0, 0.6)',
  };
  
  const accentColor = settings.accent_color || '#e9c08f';
  const glowIntensity = (settings.glow_intensity || 30) / 100;
  
  const cardStyle = {
    backgroundColor: settings.card_background_color || 'rgba(255, 255, 255, 0.5)',
  };
  
  const hoverCardStyle = {
    backgroundColor: settings.card_hover_color || 'rgba(255, 255, 255, 0.7)',
  };
  
  // Get content from settings or use defaults
  const sectionTitle = settings.section_title || "Frequently asked";
  const italicWord = settings.italic_word || "asked";
  const titleParts = sectionTitle.split(italicWord);

  if (displayFaqs.length === 0) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full py-16 px-4 overflow-hidden"
        style={sectionStyle}
      >
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p style={textColorStyle}>No FAQ items available yet.</p>
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
            <div className="space-y-3">
              {displayFaqs.map((faq, idx) => (
                <div 
                  key={faq.id} 
                  className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`} 
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  <button 
                    onClick={() => toggleFAQ(idx)} 
                    className="w-full text-left py-3 px-4 rounded-lg flex justify-between items-center gap-3 transition-colors"
                    style={cardStyle}
                    onMouseEnter={(e) => {
                      if (settings.card_hover_color) {
                        e.currentTarget.style.backgroundColor = settings.card_hover_color;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (settings.card_background_color) {
                        e.currentTarget.style.backgroundColor = settings.card_background_color;
                      } else {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                      }
                    }}
                  >
                    <span 
                      className="text-sm font-medium font-helvetica"
                      style={textColorStyle}
                    >
                      {faq.question}
                    </span>
                    <span 
                      className="text-lg flex-shrink-0"
                      style={{ color: `${settings.text_color}40` }}
                    >
                      {openIndex === idx ? "−" : "+"}
                    </span>
                  </button>
                  {openIndex === idx && (
                    <div 
                      className="px-4 py-3 text-sm leading-relaxed font-helvetica border-l-2 ml-2"
                      style={{ 
                        color: mutedTextColorStyle.color,
                        borderLeftColor: `${accentColor}40`
                      }}
                    >
                      {faq.answer}
                    </div>
                  )}
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
        <div className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="space-y-3">
            {displayFaqs.map((faq, idx) => (
              <div 
                key={faq.id} 
                className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`} 
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                <button 
                  onClick={() => toggleFAQ(idx)} 
                  className="w-full text-left py-4 px-5 rounded-xl flex justify-between items-center gap-4 transition-colors"
                  style={cardStyle}
                  onMouseEnter={(e) => {
                    if (settings.card_hover_color) {
                      e.currentTarget.style.backgroundColor = settings.card_hover_color;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (settings.card_background_color) {
                      e.currentTarget.style.backgroundColor = settings.card_background_color;
                    } else {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                    }
                  }}
                >
                  <span 
                    className="text-base md:text-lg font-medium font-helvetica"
                    style={textColorStyle}
                  >
                    {faq.question}
                  </span>
                  <span 
                    className="text-xl md:text-2xl flex-shrink-0 transition-transform duration-200"
                    style={{ color: `${settings.text_color}40` }}
                  >
                    {openIndex === idx ? "−" : "+"}
                  </span>
                </button>
                {openIndex === idx && (
                  <div 
                    className="px-5 py-4 text-base md:text-lg leading-relaxed font-helvetica border-l-2 ml-6"
                    style={{ 
                      color: mutedTextColorStyle.color,
                      borderLeftColor: `${accentColor}40`
                    }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}