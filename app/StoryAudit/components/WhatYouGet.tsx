"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { WhatYouGetSettings, Deliverable } from "@/app/types/StoryAudit/WhatYouGet";

export default function WhatYouGet() {
  const [settings, setSettings] = useState<Partial<WhatYouGetSettings>>({});
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Default deliverables fallback
  const defaultDeliverables: Deliverable[] = [
    {
      id: 1,
      title: "Kickoff call",
      description: "A 60-minute kickoff call to walk through the business, the goals, and what is currently in flight.",
      display_order: 1,
    },
    {
      id: 2,
      title: "Written audit document",
      description: "A written audit document covering the four areas above, with specific examples and screenshots from your existing assets across your website, email, and active social channels.",
      display_order: 2,
    },
    {
      id: 3,
      title: "Prioritised action plan",
      description: "A prioritised action plan covering the 30, 60, and 90-day moves that will sharpen your communications fastest.",
      display_order: 3,
    },
    {
      id: 4,
      title: "Walkthrough call",
      description: "A 60-minute walkthrough call where I present the audit, take your questions, and pressure-test the recommendations against your business reality.",
      display_order: 4,
    },
    {
      id: 5,
      title: "Email follow-up",
      description: "Two weeks of email follow-up after delivery, in case anything comes up once you start running the plan.",
      display_order: 5,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      // Fetch settings
      const { data: settingsData } = await supabase
        .from('audit_deliverables_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (settingsData) setSettings(settingsData);

      // Fetch deliverables
      const { data: deliverablesData } = await supabase
        .from('audit_deliverables')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (deliverablesData && deliverablesData.length > 0) {
        setDeliverables(deliverablesData);
      } else {
        setDeliverables(defaultDeliverables);
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
    return <div className="w-full py-16" style={{ backgroundColor: '#000000' }}></div>;
  }

  const displayDeliverables = deliverables.length > 0 ? deliverables : defaultDeliverables;
  const sectionTitle = settings.section_title || "What you get";

  // Helper to render title with italic emphasis
  const renderTitle = (title: string) => {
    if (title === "Kickoff call") {
      return <>Kickoff <span className="font-editorial italic text-white">call</span></>;
    }
    if (title === "Written audit document") {
      return <>Written audit <span className="font-editorial italic text-white">document</span></>;
    }
    if (title === "Prioritised action plan") {
      return <>Prioritised action <span className="font-editorial italic text-white">plan</span></>;
    }
    if (title === "Walkthrough call") {
      return <>Walkthrough <span className="font-editorial italic text-white">call</span></>;
    }
    if (title === "Email follow-up") {
      return <>Email <span className="font-editorial italic text-white">follow-up</span></>;
    }
    return title;
  };

  // Helper to render description with italic emphasis on key phrases
  const renderDescription = (description: string) => {
    const emphasisPhrases = [
      "walk through the business",
      "specific examples and screenshots",
      "30, 60, and 90-day",
      "pressure-test the recommendations",
      "in case anything comes up"
    ];

    let result = [];
    let lastIndex = 0;
    let currentText = description;
    
    for (const phrase of emphasisPhrases) {
      const index = currentText.toLowerCase().indexOf(phrase.toLowerCase());
      if (index !== -1) {
        if (index > lastIndex) {
          result.push(currentText.substring(lastIndex, index));
        }
        const foundPhrase = currentText.substring(index, index + phrase.length);
        result.push(
          <span key={index} className="font-editorial italic text-white/90">
            {foundPhrase}
          </span>
        );
        lastIndex = index + phrase.length;
      }
    }
    
    if (lastIndex < currentText.length) {
      result.push(currentText.substring(lastIndex));
    }
    
    return result.length > 0 ? result : description;
  };

  // ========== MOBILE LAYOUT ==========
  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full py-16 px-4 overflow-hidden"
        style={{ backgroundColor: '#000000' }}
      >
        {/* Subtle glow blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#e9c08f]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#e6ee9c]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Header with editorial italic */}
          <div className="mb-8 text-center">
            <h2 className="text-xl font-medium text-white tracking-tight font-helvetica">
              What you <span className="font-editorial italic">get</span>
            </h2>
            <div className="w-12 h-px bg-white/20 mx-auto mt-3" />
          </div>

          <div
            className={`transition-all duration-700 ease-out ${
              hasAnimated
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <div className="space-y-5">
              {displayDeliverables.map((item, idx) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-3 transition-all duration-700 ease-out ${
                    hasAnimated
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-4"
                  }`}
                  style={{ transitionDelay: `${idx * 75}ms` }}
                >
                  {/* Checkmark */}
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1 font-helvetica">
                      {renderTitle(item.title)}
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed font-helvetica">
                      {renderDescription(item.description)}
                    </p>
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
      className="relative w-full py-28 px-6 overflow-hidden"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Subtle glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-[5%] w-[300px] h-[300px] bg-[#e9c08f]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[10%] w-[400px] h-[400px] bg-[#e6ee9c]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header with editorial italic */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight font-helvetica">
            What you <span className="font-editorial italic">get</span>
          </h2>
          <div className="w-16 h-px bg-white/20 mx-auto mt-4" />
        </div>

        <div
          className={`transition-all duration-700 ease-out ${
            hasAnimated
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="grid md:grid-cols-2 gap-8">
            {displayDeliverables.map((item, idx) => (
              <div
                key={item.id}
                className={`flex items-start gap-4 transition-all duration-700 ease-out ${
                  hasAnimated
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-6"
                }`}
                style={{ transitionDelay: `${idx * 75}ms` }}
              >
                {/* Checkmark circle */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2 font-helvetica">
                    {renderTitle(item.title)}
                  </h3>
                  <p className="text-base md:text-lg text-white/60 leading-relaxed font-helvetica">
                    {renderDescription(item.description)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}