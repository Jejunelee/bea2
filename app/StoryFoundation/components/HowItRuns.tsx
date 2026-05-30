"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { HowItRunsSettings, Phase } from "@/app/types/StoryFoundation/HowItRuns";
import Image from "next/image";

export default function HowItRuns() {
  const [settings, setSettings] = useState<Partial<HowItRunsSettings>>({});
  const [phases, setPhases] = useState<Phase[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: settingsData } = await supabase
        .from('foundation_phases_settings')
        .select('*')
        .eq('id', 1)
        .single();
      if (settingsData) setSettings(settingsData);
      
      const { data: phasesData } = await supabase
        .from('foundation_phases')
        .select('*')
        .order('display_order', { ascending: true });
      if (phasesData && phasesData.length > 0) setPhases(phasesData);
      
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

  const displayPhases = phases.length > 0 ? phases : [];
  
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
  
  const lightMutedTextColorStyle = {
    color: settings.muted_text_color || 'rgba(0, 0, 0, 0.5)',
  };
  
  const numberColorStyle = {
    color: settings.number_color || 'rgba(0, 0, 0, 0.1)',
  };
  
  const accentColor = settings.accent_color || '#e9c08f';
  const glowIntensity = (settings.glow_intensity || 30) / 100;
  
  // Get content from settings or use defaults
  const sectionTitle = settings.section_title || "How the engagement runs";
  const italicWord = settings.italic_word || "runs";
  const titleParts = sectionTitle.split(italicWord);
  
  const subheading = settings.subheading || "The Foundation runs in three phases over four to six weeks. Each phase ends with a deliverable and a checkpoint, so you always know exactly where the work stands.";
  
  const quoteText = settings.quote_text || "The rebuild is structured, written, and delivered as deployed work — not a brand strategy retreat.";
  const quoteAuthor = settings.quote_author || "";
  
  const imageUrl = settings.image_url || "/StoryFoundation/2.png";
  
  // Title emphasis mapping
  const titleEmphasisWords = settings.title_emphasis_words || {
    "The audit.": "audit.",
    "The messaging architecture.": "architecture.",
    "Activation across three priority assets.": "assets."
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

  if (displayPhases.length === 0) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full py-16 px-4 overflow-hidden"
        style={sectionStyle}
      >
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p style={textColorStyle}>No phases available yet.</p>
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
            <p 
              className="text-sm mt-3"
              style={lightMutedTextColorStyle}
            >
              {subheading}
            </p>
          </div>
          <div className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="space-y-8">
              {displayPhases.map((phase, idx) => (
                <div 
                  key={phase.id} 
                  className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} 
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <span 
                      className="text-3xl font-editorial italic"
                      style={numberColorStyle}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 
                        className="text-lg font-semibold mb-2 font-helvetica"
                        style={textColorStyle}
                      >
                        {renderTitle(phase.title)}
                      </h3>
                      <p 
                        className="text-sm leading-relaxed font-helvetica"
                        style={mutedTextColorStyle}
                      >
                        {phase.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Image + Quote Section */}
            <div className="mt-12">
              <div className="w-full relative aspect-[16/9] rounded-lg overflow-hidden shadow-lg mb-6">
                <Image
                  src={imageUrl}
                  alt="Story Foundation engagement process illustration"
                  fill
                  className="object-cover"
                  style={{ objectPosition: '50% 30%' }}
                  priority={false}
                />
              </div>
              
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
          <p 
            className="text-base md:text-lg mt-4 max-w-2xl mx-auto"
            style={lightMutedTextColorStyle}
          >
            {subheading}
          </p>
        </div>
        <div className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {/* Phases Grid */}
          <div className="space-y-10 mb-16">
            {displayPhases.map((phase, idx) => (
              <div 
                key={phase.id} 
                className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} 
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-start gap-5">
                  <span 
                    className="text-5xl font-editorial italic"
                    style={numberColorStyle}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <h3 
                      className="text-xl md:text-2xl font-semibold mb-3 font-helvetica"
                      style={textColorStyle}
                    >
                      {renderTitle(phase.title)}
                    </h3>
                    <p 
                      className="text-base md:text-lg leading-relaxed font-helvetica"
                      style={mutedTextColorStyle}
                    >
                      {phase.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Image + Quote Section */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="w-full relative aspect-[11/12] rounded-lg overflow-hidden shadow-lg order-1">
              <Image
                src={imageUrl}
                alt="Story Foundation engagement process illustration showing phased brand transformation"
                fill
                className="object-cover"
                priority={false}
              />
            </div>
            
            <div 
              className="py-24 relative rounded-lg p-8 order-2"
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