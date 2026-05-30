"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { TimelineSettings, TimelineWeek } from "@/app/types/StoryAudit/Timeline";

export default function Timeline() {
  const [settings, setSettings] = useState<Partial<TimelineSettings>>({});
  const [weeks, setWeeks] = useState<TimelineWeek[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch settings
      const { data: settingsData } = await supabase
        .from('audit_timeline_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (settingsData) setSettings(settingsData);

      // Fetch timeline weeks
      const { data: weeksData } = await supabase
        .from('audit_timeline_weeks')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (weeksData && weeksData.length > 0) {
        setWeeks(weeksData);
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

  const displayWeeks = weeks.length > 0 ? weeks : [];
  
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
  
  const circleStyle = {
    backgroundColor: settings.circle_background_color || '#000000',
    color: settings.circle_text_color || '#ffffff',
  };
  
  const accentColor = settings.accent_color || '#e9c08f';
  const glowIntensity = (settings.glow_intensity || 30) / 100;
  
  // Get content from settings or use defaults
  const sectionTitle = settings.section_title || "How the two weeks run";
  const italicWord = settings.italic_word || "two weeks";
  const titleParts = sectionTitle.split(italicWord);

  if (displayWeeks.length === 0) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full py-16 px-4 overflow-hidden"
        style={sectionStyle}
      >
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p style={textColorStyle}>No timeline weeks available yet.</p>
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
            <div className="space-y-8">
              {displayWeeks.map((week, idx) => (
                <div
                  key={week.id}
                  className={`flex flex-col items-center text-center transition-all duration-700 ease-out ${
                    hasAnimated
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  {/* Week number circle */}
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-medium font-helvetica mb-4 shadow-md"
                    style={circleStyle}
                  >
                    {week.week_number}
                  </div>
                  
                  <h3 
                    className="text-lg font-semibold mb-2 font-helvetica"
                    style={textColorStyle}
                  >
                    {week.title}
                  </h3>
                  
                  <p 
                    className="text-sm leading-relaxed font-helvetica max-w-xs"
                    style={mutedTextColorStyle}
                  >
                    {week.description}
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
          <div className="flex justify-center gap-16 md:gap-20">
            {displayWeeks.map((week, idx) => (
              <div
                key={week.id}
                className={`flex-1 max-w-sm text-center transition-all duration-700 ease-out ${
                  hasAnimated
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                {/* Week number circle */}
                <div 
                  className="w-28 h-28 rounded-full flex items-center justify-center text-3xl md:text-4xl font-medium font-helvetica mx-auto mb-6 shadow-lg"
                  style={circleStyle}
                >
                  {week.week_number}
                </div>
                
                <h3 
                  className="text-xl md:text-2xl font-semibold mb-3 font-helvetica"
                  style={textColorStyle}
                >
                  {week.title}
                </h3>
                
                <p 
                  className="text-base md:text-lg leading-relaxed font-helvetica"
                  style={mutedTextColorStyle}
                >
                  {week.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}