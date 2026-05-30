"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { CaseStudySettings, CaseStudy } from "@/app/types/FractionalCommunication/CaseStudies";

export default function CaseStudies() {
  const [settings, setSettings] = useState<Partial<CaseStudySettings>>({});
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: settingsData } = await supabase
        .from('fractional_casestudy_settings')
        .select('*')
        .eq('id', 1)
        .single();
      if (settingsData) setSettings(settingsData);
      
      const { data: caseStudiesData } = await supabase
        .from('fractional_case_studies')
        .select('*')
        .order('display_order', { ascending: true });
      if (caseStudiesData && caseStudiesData.length > 0) setCaseStudies(caseStudiesData);
      
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
        style={{ backgroundColor: settings.background_color || '#fefdf8' }}
      />
    );
  }

  const displayCaseStudies = caseStudies.length > 0 ? caseStudies : [];
  
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
  
  const categoryColorStyle = {
    color: settings.category_color || 'rgba(0, 0, 0, 0.3)',
  };
  
  const borderColorStyle = {
    borderColor: settings.border_color || 'rgba(0, 0, 0, 0.2)',
  };
  
  const accentColor = settings.accent_color || '#e9c08f';
  const glowIntensity = (settings.glow_intensity || 30) / 100;
  
  // Get content from settings or use defaults
  const sectionTitle = settings.section_title || "Case studies";
  const italicWord = settings.italic_word || "studies";
  const titleParts = sectionTitle.split(italicWord);
  
  // Title emphasis mapping
  const titleEmphasisWords = settings.title_emphasis_words || {
    "CCA Manila": "CCA Manila",
    "anana": "anana",
    "HUNGRY": "HUNGRY",
    "Access Travel": "Access Travel"
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

  if (displayCaseStudies.length === 0) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full py-16 px-4 overflow-hidden"
        style={sectionStyle}
      >
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p style={textColorStyle}>No case studies available yet.</p>
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
            <div className="space-y-8">
              {displayCaseStudies.map((study, idx) => (
                <div 
                  key={study.id} 
                  className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} 
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  <div className="border-l-2 pl-4" style={borderColorStyle}>
                    <h3 
                      className="text-lg font-semibold mb-2 font-helvetica"
                      style={textColorStyle}
                    >
                      {renderTitle(study.title)}
                    </h3>
                    <p 
                      className="text-sm leading-relaxed font-helvetica mb-2"
                      style={mutedTextColorStyle}
                    >
                      {study.description}
                    </p>
                    <span 
                      className="text-xs uppercase tracking-wider font-helvetica"
                      style={categoryColorStyle}
                    >
                      {study.category}
                    </span>
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
          <div className="grid md:grid-cols-2 gap-8">
            {displayCaseStudies.map((study, idx) => (
              <div 
                key={study.id} 
                className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} 
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="border-l-2 pl-6" style={borderColorStyle}>
                  <h3 
                    className="text-xl md:text-2xl font-semibold mb-3 font-helvetica"
                    style={textColorStyle}
                  >
                    {renderTitle(study.title)}
                  </h3>
                  <p 
                    className="text-base md:text-lg leading-relaxed font-helvetica mb-3"
                    style={mutedTextColorStyle}
                  >
                    {study.description}
                  </p>
                  <span 
                    className="text-sm uppercase tracking-wider font-helvetica"
                    style={categoryColorStyle}
                  >
                    {study.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}