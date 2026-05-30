"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { OutcomesSettings, Outcome } from "@/app/types/StoryAudit/Outcomes";
import Image from "next/image";

export default function Outcomes() {
  const [settings, setSettings] = useState<Partial<OutcomesSettings>>({});
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch settings
      const { data: settingsData } = await supabase
        .from('audit_outcomes_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (settingsData) setSettings(settingsData);

      // Fetch outcomes
      const { data: outcomesData } = await supabase
        .from('audit_outcomes')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (outcomesData && outcomesData.length > 0) {
        setOutcomes(outcomesData);
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
        style={{ backgroundColor: settings.background_color || '#ffffff' }}
      />
    );
  }

  const displayOutcomes = outcomes.length > 0 ? outcomes : [];
  const sectionTitle = settings.section_title || "What you walk away with";
  const italicWord = settings.italic_word || "with";
  const titleParts = sectionTitle.split(italicWord);
  
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
  
  const lighterMutedTextColorStyle = {
    color: settings.muted_text_color || 'rgba(0, 0, 0, 0.6)',
  };
  
  const accentColor = settings.accent_color || '#e9c08f';
  const glowIntensity = (settings.glow_intensity || 30) / 100;
  
  const processNoteText = settings.process_note_text || "This is not a generic content audit with a template attached. Every recommendation is specific to your business, your audience, and the gap between where your brand is now and where it could be.";
  const processNoteEmphasisPhrases = settings.process_note_emphasis_phrases || [
    "not a generic content audit",
    "specific to your business",
    "your audience",
    "the gap"
  ];
  
  const imageUrl = settings.image_url || "/StoryAudit/3-1.png";

  // Helper to render process note with emphasis
  const renderProcessNote = (text: string) => {
    if (!processNoteEmphasisPhrases.length) return text;

    let result = [];
    let lastIndex = 0;
    let textLower = text.toLowerCase();
    
    // Sort phrases by length (longest first) to prevent partial matches
    const sortedPhrases = [...processNoteEmphasisPhrases].sort((a, b) => b.length - a.length);
    
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

  if (displayOutcomes.length === 0) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full py-16 px-4 overflow-hidden"
        style={sectionStyle}
      >
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p style={textColorStyle}>No outcomes available yet.</p>
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
            <div className="space-y-4">
              {displayOutcomes.map((outcome, idx) => (
                <div
                  key={outcome.id}
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
                    style={{ backgroundColor: `${settings.text_color}10` }}
                  >
                    <svg 
                      className="w-3 h-3" 
                      style={{ color: `${settings.text_color}60` }}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p 
                    className="text-sm leading-relaxed font-helvetica flex-1"
                    style={mutedTextColorStyle}
                  >
                    {outcome.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Process Note Callout */}
            <div className="mt-8 pt-6 border-t" style={{ borderColor: `${settings.text_color}10` }}>
              <div 
                className="rounded-lg p-4"
                style={{ backgroundColor: `${settings.text_color}05` }}
              >
                <p 
                  className="text-xs leading-relaxed font-helvetica italic"
                  style={lighterMutedTextColorStyle}
                >
                  {renderProcessNote(processNoteText)}
                </p>
              </div>
            </div>

            {/* Image Section */}
            <div className="mt-8 w-full relative aspect-[16/9]">
              <Image
                src={imageUrl}
                alt="Story audit outcomes illustration showing brand transformation and clarity"
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
      className="relative w-full py-28 px-6 overflow-hidden"
      style={sectionStyle}
    >
      {/* Warm glow blobs */}
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
          <div className="grid md:grid-cols-2 gap-6">
            {displayOutcomes.map((outcome, idx) => (
              <div
                key={outcome.id}
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
                  style={{ backgroundColor: `${settings.text_color}05` }}
                >
                  <svg 
                    className="w-4 h-4" 
                    style={{ color: `${settings.text_color}40` }}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p 
                  className="text-base md:text-lg leading-relaxed font-helvetica flex-1"
                  style={mutedTextColorStyle}
                >
                  {outcome.text}
                </p>
              </div>
            ))}
          </div>

          {/* Process Note Callout */}
          <div className="mt-12 pt-8 border-t" style={{ borderColor: `${settings.text_color}10` }}>
            <div 
              className="rounded-xl p-6 max-w-2xl mx-auto"
              style={{ backgroundColor: `${settings.text_color}05` }}
            >
              <p 
                className="text-sm md:text-base leading-relaxed font-helvetica italic text-center"
                style={lighterMutedTextColorStyle}
              >
                {renderProcessNote(processNoteText)}
              </p>
            </div>
          </div>

          {/* Image Section */}
          <div className="mt-12 w-full relative aspect-[15/9]">
            <Image
              src={imageUrl}
              alt="Story audit outcomes illustration showing brand transformation, clarity, and actionable roadmap"
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