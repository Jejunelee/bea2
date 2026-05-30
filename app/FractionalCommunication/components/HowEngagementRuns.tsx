"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { FractionalEngagementSettings, EngagementStep } from "@/app/types/FractionalCommunication/HowEngagementRuns";

export default function HowEngagementRuns() {
  const [settings, setSettings] = useState<Partial<FractionalEngagementSettings>>({});
  const [steps, setSteps] = useState<EngagementStep[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: settingsData } = await supabase
        .from('fractional_engagement_settings')
        .select('*')
        .eq('id', 1)
        .single();
      if (settingsData) setSettings(settingsData);
      
      const { data: stepsData } = await supabase
        .from('fractional_engagement_steps')
        .select('*')
        .order('display_order', { ascending: true });
      if (stepsData && stepsData.length > 0) setSteps(stepsData);
      
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

  const displaySteps = steps.length > 0 ? steps : [];
  
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
  
  const numberBgStyle = {
    backgroundColor: settings.number_background_color || 'rgba(255, 255, 255, 0.1)',
  };
  
  const numberTextStyle = {
    color: settings.number_text_color || '#ffffff',
  };
  
  const accentColor = settings.accent_color || '#e9c08f';
  const glowIntensity = (settings.glow_intensity || 30) / 100;
  
  // Get content from settings or use defaults
  const sectionTitle = settings.section_title || "How the engagement runs";
  const italicWord = settings.italic_word || "runs";
  const titleParts = sectionTitle.split(italicWord);
  
  // Title emphasis mapping
  const titleEmphasisWords = settings.title_emphasis_words || {
    "A discovery call": "discovery call",
    "A scoped proposal": "scoped proposal",
    "A three-month minimum": "three-month minimum",
    "Async-first communication": "Async-first"
  };
  
  // Helper to render title with italic emphasis
  const renderTitle = (title: string) => {
    const emphasisWord = titleEmphasisWords[title];
    if (emphasisWord && title.includes(emphasisWord)) {
      const parts = title.split(emphasisWord);
      return (
        <>
          {parts[0]}
          <span className="font-editorial italic" style={textColorStyle}>
            {emphasisWord}
          </span>
          {parts[1]}
        </>
      );
    }
    return title;
  };

  if (displaySteps.length === 0) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full py-16 px-4 overflow-hidden"
        style={sectionStyle}
      >
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p style={textColorStyle}>No engagement steps available yet.</p>
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
            <div className="space-y-8">
              {displaySteps.map((step, idx) => (
                <div 
                  key={step.id} 
                  className={`flex flex-col items-center text-center transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} 
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium font-helvetica mb-3"
                    style={{ ...numberBgStyle, ...numberTextStyle }}
                  >
                    {idx + 1}
                  </div>
                  <h3 
                    className="text-lg font-semibold mb-2 font-helvetica"
                    style={textColorStyle}
                  >
                    {renderTitle(step.title)}
                  </h3>
                  <p 
                    className="text-sm leading-relaxed font-helvetica"
                    style={mutedTextColorStyle}
                  >
                    {step.description}
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
      className="relative w-full py-28 px-6 sm:px-8 lg:px-12 overflow-hidden"
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
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="mb-12 text-center">
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displaySteps.map((step, idx) => (
              <div 
                key={step.id} 
                className={`text-center transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} 
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-medium font-helvetica mx-auto mb-4"
                  style={{ ...numberBgStyle, ...numberTextStyle }}
                >
                  {idx + 1}
                </div>
                <h3 
                  className="text-xl font-semibold mb-3 font-helvetica"
                  style={textColorStyle}
                >
                  {renderTitle(step.title)}
                </h3>
                <p 
                  className="text-base leading-relaxed font-helvetica"
                  style={mutedTextColorStyle}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}