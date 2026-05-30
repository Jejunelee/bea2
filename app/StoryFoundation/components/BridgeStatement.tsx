"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { BridgeStatementSettings } from "@/app/types/StoryFoundation/BridgeStatement";
import Image from "next/image";

export default function BridgeStatement() {
  const [settings, setSettings] = useState<Partial<BridgeStatementSettings>>({});
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('foundation_bridge_settings')
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
      { threshold: 0.2, rootMargin: "0px 0px -100px 0px" }
    );

    observer.observe(currentSection);
    return () => { if (currentSection) observer.unobserve(currentSection); };
  }, [hasAnimated, loading]);

  if (loading) {
    return (
      <div 
        className="w-full py-16 animate-pulse" 
        style={{ backgroundColor: settings.background_color || '#ffffff' }}
      />
    );
  }

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
  
  const lightMutedTextColorStyle = {
    color: settings.muted_text_color || 'rgba(0, 0, 0, 0.3)',
  };
  
  const borderColorStyle = {
    borderColor: `${settings.text_color}10`,
  };
  
  const accentColor = settings.accent_color || '#e9c08f';
  const glowIntensity = (settings.glow_intensity || 30) / 100;
  
  // Get content from settings or use defaults
  const preTitle = settings.pre_title || "A brand audit tells you what is wrong.";
  const sectionTitle = settings.section_title || "The foundation fixes it.";
  const italicWord = settings.italic_word || "fixes it";
  const titleParts = sectionTitle.split(italicWord);
  
  const mainText = settings.main_text || "Most founders get stuck here because rebuilding messaging means rewriting your website, your deck, your kit, your bios, and your sales emails, and doing all of it in one consistent voice. That is a lot of writing, and the cost of doing it inconsistently is a brand that feels splintered across every channel a customer or investor will ever see.";
  const mainEmphasisPhrases = settings.main_emphasis_phrases || [
    "lot of writing",
    "splintered across every channel"
  ];
  
  const closingText = settings.closing_text || "The Foundation is how you stop patching the brand and start operating from a single source of truth.";
  
  const imageUrl = settings.image_url || "/StoryFoundation/1-1.png";

  // Helper to render main text with emphasis
  const renderMainText = () => {
    if (!mainEmphasisPhrases.length) return mainText;

    let result = [];
    let lastIndex = 0;
    let textLower = mainText.toLowerCase();
    const sortedPhrases = [...mainEmphasisPhrases].sort((a, b) => b.length - a.length);
    
    for (const phrase of sortedPhrases) {
      const phraseLower = phrase.toLowerCase();
      const index = textLower.indexOf(phraseLower);
      
      if (index !== -1) {
        if (index > lastIndex) {
          result.push(mainText.substring(lastIndex, index));
        }
        const foundPhrase = mainText.substring(index, index + phrase.length);
        result.push(
          <span key={index} className="font-editorial italic" style={textColorStyle}>
            {foundPhrase}
          </span>
        );
        lastIndex = index + phrase.length;
        textLower = textLower.substring(lastIndex);
      }
    }
    
    if (lastIndex < mainText.length) {
      result.push(mainText.substring(lastIndex));
    }
    
    return result.length > 0 ? result : mainText;
  };

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
          <div
            className={`transition-all duration-700 ease-out ${
              hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="text-center mb-6">
              <span 
                className="text-sm uppercase tracking-wider font-helvetica"
                style={lightMutedTextColorStyle}
              >
                {preTitle}
              </span>
              <h2 
                className="text-2xl font-medium mt-2 font-helvetica"
                style={textColorStyle}
              >
                {titleParts[0]}
                <span className="font-editorial italic" style={textColorStyle}>
                  {italicWord}
                </span>
                {titleParts[1]}
              </h2>
            </div>

            <p 
              className="text-base leading-relaxed font-helvetica"
              style={mutedTextColorStyle}
            >
              {renderMainText()}
            </p>

            <div className="mt-6 pt-4 border-t" style={borderColorStyle}>
              <p 
                className="text-base font-medium leading-relaxed font-helvetica"
                style={textColorStyle}
              >
                {closingText}
              </p>
            </div>

            {/* Image Section */}
            <div className="mt-8 w-full relative aspect-[16/9]">
              <Image
                src={imageUrl}
                alt="Story Foundation bridge illustration showing brand transformation from audit to foundation"
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

      <div className="relative z-10 max-w-3xl mx-auto">
        <div
          className={`transition-all duration-700 ease-out ${
            hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-10">
            <span 
              className="text-sm uppercase tracking-wider font-helvetica"
              style={lightMutedTextColorStyle}
            >
              {preTitle}
            </span>
            <h2 
              className="text-3xl md:text-4xl font-medium mt-3 font-helvetica"
              style={textColorStyle}
            >
              {titleParts[0]}
              <span className="font-editorial italic" style={textColorStyle}>
                {italicWord}
              </span>
              {titleParts[1]}
            </h2>
          </div>

          <p 
            className="text-xl md:text-2xl leading-relaxed font-helvetica"
            style={mutedTextColorStyle}
          >
            {renderMainText()}
          </p>

          <div className="mt-10 pt-6 border-t" style={borderColorStyle}>
            <p 
              className="text-xl md:text-2xl font-medium leading-relaxed font-helvetica"
              style={textColorStyle}
            >
              {closingText}
            </p>
            <div 
              className="w-16 h-px mt-6"
              style={{ backgroundColor: `${settings.text_color}15` }}
            />
          </div>

          {/* Image Section */}
          <div className="mt-12 w-full relative aspect-[15/9]">
            <Image
              src={imageUrl}
              alt="Story Foundation bridge illustration showing brand transformation from scattered messaging to unified foundation"
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