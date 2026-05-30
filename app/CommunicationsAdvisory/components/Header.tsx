"use client";

import { useEffect, useState } from "react";
import Header from '@/app/components/Header';
import { supabase } from "@/app/lib/supabase/client";
import type { AdvisoryHeroSettings } from "@/app/types/CommunicationsAdvisory/Header";

export default function AdvisoryHero() {
  const [settings, setSettings] = useState<Partial<AdvisoryHeroSettings>>({});
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('advisory_hero_settings')
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

  const createCalendarEvent = () => {
    const bookingUrl = settings.booking_url || "https://calendar.app.google/kZ2VsHYE7Nz9WFZ77";
    window.open(bookingUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div 
        className="relative w-full min-h-screen" 
        style={{ backgroundColor: settings.background_color || '#ffffff' }}
      />
    );
  }

  // Dynamic styles
  const gradientColors = settings.background_gradient_colors || [
    '#ffffff',
    '#ffffff',
    '#fdf4e3',
    '#f0e0c4',
    '#e8c8a0'
  ];
  
  const backgroundGradient = `radial-gradient(circle at center, ${gradientColors.join(', ')})`;
  
  const textColorStyle = {
    color: settings.text_color || '#000000',
  };
  
  const mutedTextColorStyle = {
    color: settings.muted_text_color || 'rgba(0, 0, 0, 0.8)',
  };
  
  const accentColor = settings.accent_color || '#e9c08f';
  
  const buttonStyle = {
    backgroundColor: settings.button_background_color || '#000000',
    color: settings.button_text_color || '#ffffff',
  };
  
  // Get content from settings or use defaults
  const headline = settings.headline || "Communications leadership for founders who have a team but need a sharper mind in the room.";
  const italicWords = settings.italic_words || ['sharper mind'];
  const description = settings.description || "Communications Advisory is a monthly retainer for food and hospitality founders who are past the DIY stage and already have a team, but need a senior comms partner to hold the strategy, pressure-test decisions, and keep the brand sharp as the business grows. Your team runs the execution — I make sure it's moving in the right direction.";
  const buttonText = settings.button_text || "Book a call";

  // Helper to render headline with italic emphasis
  const renderHeadline = () => {
    if (!italicWords.length) return headline;

    let result = [];
    let lastIndex = 0;
    let headlineLower = headline.toLowerCase();
    const sortedWords = [...italicWords].sort((a, b) => b.length - a.length);
    
    for (const word of sortedWords) {
      const wordLower = word.toLowerCase();
      const index = headlineLower.indexOf(wordLower);
      
      if (index !== -1) {
        if (index > lastIndex) {
          result.push(headline.substring(lastIndex, index));
        }
        const foundWord = headline.substring(index, index + word.length);
        result.push(
          <span key={index} className="font-editorial italic" style={textColorStyle}>
            {foundWord}
          </span>
        );
        lastIndex = index + word.length;
        headlineLower = headlineLower.substring(lastIndex);
      }
    }
    
    if (lastIndex < headline.length) {
      result.push(headline.substring(lastIndex));
    }
    
    return result.length > 0 ? result : headline;
  };

  // ========== MOBILE LAYOUT ==========
  if (isMobile) {
    return (
      <section className="relative w-full min-h-screen py-12 px-4 flex flex-col items-center justify-center overflow-hidden font-helvetica">
        <Header />
        
        <div
          className="absolute inset-0"
          style={{ background: backgroundGradient }}
        />

        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute top-[20%] left-[10%] w-[200px] h-[200px] rounded-full blur-[100px]"
            style={{ backgroundColor: `${accentColor}40` }}
          />
          <div 
            className="absolute bottom-[10%] right-[15%] w-[250px] h-[250px] rounded-full blur-[100px]"
            style={{ backgroundColor: `${accentColor}35` }}
          />
          <div 
            className="absolute top-[60%] left-[30%] w-[180px] h-[180px] rounded-full blur-[80px]"
            style={{ backgroundColor: `${accentColor}30` }}
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div 
            className="w-[400px] h-[400px] blur-[100px] rounded-full"
            style={{ 
              backgroundColor: settings.glow_color || '#f0c090',
              opacity: (settings.glow_intensity || 35) / 100
            }}
          />
        </div>
        
        <div className="relative z-10 w-full px-4 text-center">
          {/* Headline */}
          <h1 
            className="opacity-0 animate-fade-in-up text-2xl md:text-3xl leading-tight font-medium"
            style={{ 
              ...textColorStyle,
              animationDelay: "0.4s", 
              animationFillMode: "forwards" 
            }}
          >
            {renderHeadline()}
          </h1>

          {/* Description */}
          <p 
            className="opacity-0 animate-fade-in-up text-base leading-relaxed mt-6 px-2"
            style={{ 
              ...mutedTextColorStyle,
              animationDelay: "0.8s", 
              animationFillMode: "forwards" 
            }}
          >
            {description}
          </p>

          <div 
            className="opacity-0 animate-fade-in-up mt-8"
            style={{ animationDelay: "1.2s", animationFillMode: "forwards" }}
          >
            <button
              onClick={createCalendarEvent}
              className="group relative rounded-full text-base font-medium px-6 py-2.5 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 overflow-hidden"
              style={buttonStyle}
            >
              <span className="relative z-10 flex items-center gap-2">
                {buttonText}
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
        `}</style>
      </section>
    );
  }

  // ========== DESKTOP LAYOUT ==========
  return (
    <section className="relative w-full min-h-screen py-20 px-4 sm:px-8 lg:px-12 flex flex-col items-center justify-center overflow-hidden font-helvetica">
      <Header />
      
      <div
        className="absolute inset-0"
        style={{ background: backgroundGradient }}
      />

      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-[15%] left-[5%] w-[300px] h-[300px] rounded-full blur-[120px]"
          style={{ backgroundColor: `${accentColor}35` }}
        />
        <div 
          className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] rounded-full blur-[120px]"
          style={{ backgroundColor: `${accentColor}35` }}
        />
        <div 
          className="absolute top-[50%] left-[70%] w-[250px] h-[250px] rounded-full blur-[100px]"
          style={{ backgroundColor: `${accentColor}30` }}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="w-[700px] h-[700px] blur-[140px] rounded-full"
          style={{ 
            backgroundColor: settings.glow_color || '#f0c090',
            opacity: (settings.glow_intensity || 30) / 100
          }}
        />
      </div>
      
      <div className="relative z-10 w-full max-w-5xl px-6 md:px-8 lg:px-12 text-center">
        {/* Headline */}
        <h1 
          className="opacity-0 animate-fade-in-up text-4xl md:text-5xl lg:text-5xl leading-tight font-medium"
          style={{ 
            ...textColorStyle,
            animationDelay: "0.4s", 
            animationFillMode: "forwards" 
          }}
        >
          {renderHeadline()}
        </h1>

        {/* Description */}
        <p 
          className="opacity-0 animate-fade-in-up text-base md:text-lg lg:text-xl leading-relaxed mt-8 max-w-4xl mx-auto"
          style={{ 
            ...mutedTextColorStyle,
            animationDelay: "0.8s", 
            animationFillMode: "forwards" 
          }}
        >
          {description}
        </p>

        <div 
          className="opacity-0 animate-fade-in-up mt-10"
          style={{ animationDelay: "1.2s", animationFillMode: "forwards" }}
        >
          <button
            onClick={createCalendarEvent}
            className="group relative rounded-full text-base md:text-lg lg:text-xl font-medium px-8 py-3 lg:px-10 lg:py-4 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 overflow-hidden"
            style={buttonStyle}
          >
            <span className="relative z-10 flex items-center gap-2">
              {buttonText}
              <svg
                className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </section>
  );
}