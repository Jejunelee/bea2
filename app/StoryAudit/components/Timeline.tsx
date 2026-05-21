"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { TimelineSettings, TimelineWeek } from "@/app/types/audit";

export default function Timeline() {
  const [settings, setSettings] = useState<Partial<TimelineSettings>>({});
  const [weeks, setWeeks] = useState<TimelineWeek[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Default weeks fallback
  const defaultWeeks: TimelineWeek[] = [
    {
      id: 1,
      week_number: 1,
      title: "Kickoff and review",
      description: "We start with a 60-minute call to learn the business. Over the following days, I review every public-facing channel your brand lives on and build the audit.",
      display_order: 1,
    },
    {
      id: 2,
      week_number: 2,
      title: "Delivery and walkthrough",
      description: "I deliver the written audit and the 30- to 90-day action plan, and we schedule a 60-minute walkthrough call to discuss the recommendations. Email follow-up is open for two weeks afterwards.",
      display_order: 2,
    },
  ];

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
      } else {
        setWeeks(defaultWeeks);
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
    return <div className="w-full py-16" style={{ backgroundColor: '#fefdf8' }}></div>;
  }

  const displayWeeks = weeks.length > 0 ? weeks : defaultWeeks;
  const sectionTitle = settings.section_title || "How the two weeks run";

  // ========== MOBILE LAYOUT ==========
  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full py-16 px-4 overflow-hidden"
        style={{ backgroundColor: '#fefdf8' }}
      >
        {/* Warm glow blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#e9c08f]/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#e6ee9c]/15 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Header with editorial italic */}
          <div className="mb-8 text-center">
            <h2 className="text-xl font-medium text-black tracking-tight font-helvetica">
              How the <span className="font-editorial italic">two weeks</span> run
            </h2>
            <div className="w-12 h-px bg-black/20 mx-auto mt-3" />
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
                  {/* Week number circle - larger */}
                  <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-2xl font-medium font-helvetica mb-4 shadow-md">
                    {week.week_number}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-black mb-2 font-helvetica">
                    {week.title}
                  </h3>
                  
                  <p className="text-sm text-black/60 leading-relaxed font-helvetica max-w-xs">
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
      style={{ backgroundColor: '#fefdf8' }}
    >
      {/* Warm glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-[10%] w-[350px] h-[350px] bg-[#e9c08f]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-[5%] w-[400px] h-[400px] bg-[#e6ee9c]/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/40 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header with editorial italic */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl md:text-3xl font-medium text-black tracking-tight font-helvetica">
            How the <span className="font-editorial italic">two weeks</span> run
          </h2>
          <div className="w-16 h-px bg-black/20 mx-auto mt-4" />
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
                {/* Week number circle - larger */}
                <div className="w-28 h-28 rounded-full bg-black text-white flex items-center justify-center text-3xl md:text-4xl font-medium font-helvetica mx-auto mb-6 shadow-lg">
                  {week.week_number}
                </div>
                
                <h3 className="text-xl md:text-2xl font-semibold text-black mb-3 font-helvetica">
                  {week.title}
                </h3>
                
                <p className="text-base md:text-lg text-black/60 leading-relaxed font-helvetica">
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