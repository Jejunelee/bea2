"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { ProblemStatementSettings } from "@/app/types/StoryAudit/ProblemStatement";
import Image from "next/image";

export default function ProblemStatement() {
  const [settings, setSettings] = useState<Partial<ProblemStatementSettings>>({});
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('audit_problem_statement')
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
        style={{ backgroundColor: settings.background_color || '#f5f3ef' }}
      />
    );
  }

  // Dynamic styles
  const sectionStyle = {
    backgroundColor: settings.background_color || '#f5f3ef',
  };
  
  const textColorStyle = {
    color: settings.text_color || '#000000',
  };
  
  const mutedTextColorStyle = {
    color: settings.muted_text_color || 'rgba(0, 0, 0, 0.7)',
  };
  
  const lightMutedTextColorStyle = {
    color: settings.muted_text_color || 'rgba(0, 0, 0, 0.35)',
  };
  
  const accentColor = settings.accent_color || '#e9c08f';
  const glowIntensity = (settings.glow_intensity || 30) / 100;
  
  // Get content from settings or use defaults
  const sectionTitle = settings.section_title || "The real problem";
  const italicWord = settings.italic_word || "real";
  const titleParts = sectionTitle.split(italicWord);
  
  const openingStatement = settings.opening_statement || "Most early-stage food brands aren't underperforming because of a bad product. They are underperforming because their messaging grew piece by piece, on different days, in different moods, with no underlying story holding it together.";
  const openingEmphasisPhrase = settings.opening_emphasis_phrase || "no underlying story holding it together";
  
  const fragmentedItems = settings.fragmented_items || [
    "A website written two years ago.",
    "Captions written last week.",
    "A pitch deck written for one specific investor.",
    "A press kit nobody has opened since launch."
  ];
  
  const consequenceStatement = settings.consequence_statement || "That is expensive. It costs you press hits. It costs you partnership conversations. It costs you customers who would have stayed if the brand had been clearer.";
  const consequenceEmphasisWords = settings.consequence_emphasis_words || ["expensive", "would have stayed"];
  
  const resolutionStatement = settings.resolution_statement || "The audit is how you find out exactly where the story is breaking down, and what to do about it.";
  
  const imageUrl = settings.image_url || "/StoryAudit/1-1.png";

  // Helper to render text with emphasis
  const renderWithEmphasis = (text: string, emphasisWords: string[]) => {
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

  // Render opening statement with emphasis
  const renderOpeningStatement = () => {
    if (!openingEmphasisPhrase) return openingStatement;
    
    const index = openingStatement.toLowerCase().indexOf(openingEmphasisPhrase.toLowerCase());
    if (index === -1) return openingStatement;
    
    return (
      <>
        {openingStatement.substring(0, index)}
        <span className="font-editorial italic" style={textColorStyle}>
          {openingStatement.substring(index, index + openingEmphasisPhrase.length)}
        </span>
        {openingStatement.substring(index + openingEmphasisPhrase.length)}
      </>
    );
  };

  // Render consequence statement with emphasis
  const renderConsequenceStatement = () => {
    return renderWithEmphasis(consequenceStatement, consequenceEmphasisWords);
  };

  // ========== MOBILE LAYOUT ==========
  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full py-16 px-4 overflow-hidden"
        style={sectionStyle}
      >
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '30px'
          }} />
        </div>

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
            {/* Opening statement */}
            <div className="relative">
              <span 
                className="absolute -top-4 -left-2 text-5xl font-editorial"
                style={{ color: `${settings.text_color}10` }}
              >
                "
              </span>
              <p 
                className="text-base leading-relaxed font-helvetica relative z-10"
                style={mutedTextColorStyle}
              >
                {renderOpeningStatement()}
              </p>
            </div>

            {/* Fragmented list */}
            <div 
              className="my-8 space-y-2 pl-3 border-l-2"
              style={{ borderColor: `${settings.text_color}15` }}
            >
              {fragmentedItems.map((item, idx) => (
                <p 
                  key={idx}
                  className="text-sm font-helvetica"
                  style={lightMutedTextColorStyle}
                >
                  {item}
                </p>
              ))}
            </div>

            {/* Consequence statement */}
            <div 
              className="rounded-xl p-5 my-6 border shadow-sm"
              style={{ 
                backgroundColor: `${settings.card_background_color || '#ffffff'}60`,
                borderColor: `${settings.text_color}05`,
                backdropFilter: 'blur(8px)'
              }}
            >
              <p 
                className="text-base leading-relaxed font-helvetica"
                style={mutedTextColorStyle}
              >
                {renderConsequenceStatement()}
              </p>
            </div>

            {/* Resolution statement */}
            <div className="mt-8 pt-4">
              <p 
                className="text-base font-medium leading-relaxed font-helvetica"
                style={textColorStyle}
              >
                {resolutionStatement}
              </p>
            </div>

            {/* Image Section */}
            <div className="mt-8 w-full relative aspect-[16/9]">
              <Image
                src={imageUrl}
                alt="Problem statement illustration showing fragmented brand messaging"
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
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '40px'
        }} />
      </div>

      {/* Warm glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-20 right-[10%] w-[400px] h-[400px] rounded-full blur-3xl"
          style={{ backgroundColor: `${accentColor}${Math.floor(glowIntensity * 40).toString(16).padStart(2, '0')}` }}
        />
        <div 
          className="absolute bottom-20 left-[5%] w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ backgroundColor: `${accentColor}${Math.floor(glowIntensity * 30).toString(16).padStart(2, '0')}` }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ backgroundColor: `${settings.text_color}05` }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
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

        <div
          className={`transition-all duration-700 ease-out ${
            hasAnimated
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          {/* Opening paragraph with decorative quote */}
          <div className="relative">
            <span 
              className="absolute -top-10 -left-8 text-8xl font-editorial select-none"
              style={{ color: `${settings.text_color}08` }}
            >
              "
            </span>
            <p 
              className="text-xl md:text-2xl leading-relaxed font-helvetica relative z-10"
              style={mutedTextColorStyle}
            >
              {renderOpeningStatement()}
            </p>
          </div>

          {/* Fragmented list */}
          <div 
            className="my-12 space-y-3 pl-8 border-l-2"
            style={{ borderColor: `${settings.text_color}15` }}
          >
            {fragmentedItems.map((item, idx) => (
              <p 
                key={idx}
                className="text-base md:text-lg font-helvetica"
                style={lightMutedTextColorStyle}
              >
                {item}
              </p>
            ))}
          </div>

          {/* Consequence statement */}
          <div 
            className="rounded-2xl p-8 my-10 border shadow-sm"
            style={{ 
              backgroundColor: `${settings.card_background_color || '#ffffff'}50`,
              borderColor: `${settings.text_color}05`,
              backdropFilter: 'blur(8px)'
            }}
          >
            <p 
              className="text-xl md:text-2xl leading-relaxed font-helvetica"
              style={mutedTextColorStyle}
            >
              {renderConsequenceStatement()}
            </p>
          </div>

          {/* Resolution statement */}
          <div className="mt-12 pt-6 text-center">
            <div className="inline-block">
              <p 
                className="text-xl md:text-2xl font-medium leading-relaxed font-helvetica"
                style={textColorStyle}
              >
                {resolutionStatement}
              </p>
              <div 
                className="w-full h-px mt-5"
                style={{ backgroundColor: `${settings.text_color}15` }}
              />
            </div>
          </div>

          {/* Image Section */}
          <div className="mt-12 w-full relative aspect-[15/9]">
            <Image
              src={imageUrl}
              alt="Problem statement illustration showing fragmented brand messaging across different channels"
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