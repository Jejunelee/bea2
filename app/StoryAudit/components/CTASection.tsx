"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { CTASectionSettings } from "@/app/types/StoryAudit/CTASection";

export default function CTASection() {
  const [settings, setSettings] = useState<Partial<CTASectionSettings>>({});
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('audit_cta_settings')
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

  const createCalendarEvent = () => {
    const startDate = new Date();
    startDate.setHours(startDate.getHours() + 1);
    
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);
    
    const formatDateForGoogle = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const startTime = formatDateForGoogle(startDate);
    const endTime = formatDateForGoogle(endDate);
    
    const url = 
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      `&text=${encodeURIComponent(settings.calendar_event_title || 'Story Audit Discovery Call')}` +
      `&dates=${startTime}/${endTime}` +
      `&details=${encodeURIComponent(settings.calendar_event_details || 'Hi, I\'m interested in the Story Audit for my brand. Let\'s find a time to discuss.')}` +
      `&location=${encodeURIComponent(settings.calendar_event_location || 'Google Meet')}` +
      `&add=${settings.calendar_event_email || 'bea@gmail.com'}`;
    
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return <div className="w-full py-16" style={{ backgroundColor: '#000000' }}></div>;
  }

  const headline = settings.headline || "Start the audit";
  const subheadline = settings.subheadline || "If your messaging feels like it's doing a lot but not landing, the Story Audit is the fastest way to find out why and what to do about it.";
  const buttonText = settings.button_text || "Book your audit";

  // Split headline to isolate "audit"
  const headlineParts = headline.split("audit");
  const hasAudit = headlineParts.length > 1;

  // ========== MOBILE LAYOUT ==========
  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full py-20 px-4 overflow-hidden"
        style={{ backgroundColor: '#000000' }}
      >
        {/* Subtle glow blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-0 left-0 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div
            className={`transition-all duration-700 ease-out ${
              hasAnimated
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <h2 className="text-2xl font-medium text-white mb-3 font-helvetica tracking-tight">
              {hasAudit ? (
                <>
                  {headlineParts[0]}
                  <span className="font-editorial italic">audit</span>
                  {headlineParts[1]}
                </>
              ) : (
                headline
              )}
            </h2>
            
            <p className="text-base text-white/60 leading-relaxed mb-8 font-helvetica max-w-md mx-auto">
              {subheadline}
            </p>
            
            <button
              onClick={createCalendarEvent}
              className="group relative rounded-full bg-white text-black text-base font-medium px-8 py-3 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                {buttonText}
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ========== DESKTOP LAYOUT ==========
  return (
    <section
      ref={sectionRef}
      className="relative w-full py-32 px-6 overflow-hidden"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Subtle glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-[15%] w-[300px] h-[300px] bg-white/8 rounded-full blur-3xl" />
        <div className="absolute top-10 left-[10%] w-[250px] h-[250px] bg-white/8 rounded-full blur-3xl" />
        <div className="absolute top-[30%] right-[30%] w-[200px] h-[200px] bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div
          className={`transition-all duration-700 ease-out ${
            hasAnimated
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-medium text-white mb-4 font-helvetica tracking-tight">
            {hasAudit ? (
              <>
                {headlineParts[0]}
                <span className="font-editorial italic">audit</span>
                {headlineParts[1]}
              </>
            ) : (
              headline
            )}
          </h2>
          
          <p className="text-lg md:text-xl text-white/60 leading-relaxed mb-10 font-helvetica max-w-2xl mx-auto">
            {subheadline}
          </p>
          
          <button
            onClick={createCalendarEvent}
            className="group relative rounded-full bg-white text-black text-base md:text-lg font-medium px-10 py-4 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              {buttonText}
              <svg
                className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}