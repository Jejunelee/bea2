"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { OutcomesSettings, Outcome } from "@/app/types/audit";

export default function Outcomes() {
  const [settings, setSettings] = useState<Partial<OutcomesSettings>>({});
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Default outcomes fallback
  const defaultOutcomes: Outcome[] = [
    {
      id: 1,
      text: "A clear-eyed view of what your brand is currently communicating, and to whom.",
      display_order: 1,
    },
    {
      id: 2,
      text: "A specific list of what is quietly costing you across your website, your social channels, your press materials, and your founder's presence.",
      display_order: 2,
    },
    {
      id: 3,
      text: "A prioritised plan for what to fix first, what to build next, and what to leave alone for now.",
      display_order: 3,
    },
    {
      id: 4,
      text: "The confidence to either run with the recommendations yourself, hire someone to execute them, or roll the audit into a full messaging rebuild with me.",
      display_order: 4,
    },
  ];

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
      } else {
        setOutcomes(defaultOutcomes);
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
    return <div className="w-full py-16" style={{ backgroundColor: '#ffffff' }}></div>;
  }

  const displayOutcomes = outcomes.length > 0 ? outcomes : defaultOutcomes;
  const sectionTitle = settings.section_title || "What you walk away with";

  const processNoteText = "This is not a generic content audit with a template attached. Every recommendation is specific to your business, your audience, and the gap between where your brand is now and where it could be.";

  // Helper to render process note with emphasis
  const renderProcessNote = (text: string) => {
    const emphasisPhrases = [
      "not a generic content audit",
      "specific to your business",
      "your audience",
      "the gap"
    ];

    let result = [];
    let lastIndex = 0;
    
    for (const phrase of emphasisPhrases) {
      const index = text.toLowerCase().indexOf(phrase.toLowerCase());
      if (index !== -1) {
        if (index > lastIndex) {
          result.push(text.substring(lastIndex, index));
        }
        const foundPhrase = text.substring(index, index + phrase.length);
        result.push(
          <span key={index} className="font-editorial italic text-black">
            {foundPhrase}
          </span>
        );
        lastIndex = index + phrase.length;
      }
    }
    
    if (lastIndex < text.length) {
      result.push(text.substring(lastIndex));
    }
    
    return result.length > 0 ? result : text;
  };

  // ========== MOBILE LAYOUT ==========
  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full py-16 px-4 overflow-hidden"
        style={{ backgroundColor: '#ffffff' }}
      >
        {/* Warm glow blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#e9c08f]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#e6ee9c]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Header with editorial italic */}
          <div className="mb-8 text-center">
            <h2 className="text-xl font-medium text-black tracking-tight font-helvetica">
              What you walk away <span className="font-editorial italic">with</span>
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
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-black/10 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-black/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-black/70 leading-relaxed font-helvetica flex-1">
                    {outcome.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Process Note Callout - without asterisk */}
            <div className="mt-8 pt-6 border-t border-black/10">
              <div className="bg-black/5 rounded-lg p-4">
                <p className="text-xs text-black/60 leading-relaxed font-helvetica italic">
                  {renderProcessNote(processNoteText)}
                </p>
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
      style={{ backgroundColor: '#ffffff' }}
    >
      {/* Warm glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-[5%] w-[300px] h-[300px] bg-[#e9c08f]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[10%] w-[400px] h-[400px] bg-[#e6ee9c]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-black/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header with editorial italic */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl md:text-3xl font-medium text-black tracking-tight font-helvetica">
            What you walk away <span className="font-editorial italic">with</span>
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
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-base md:text-lg text-black/70 leading-relaxed font-helvetica flex-1">
                  {outcome.text}
                </p>
              </div>
            ))}
          </div>

          {/* Process Note Callout - without asterisk */}
          <div className="mt-12 pt-8 border-t border-black/10">
            <div className="bg-black/5 rounded-xl p-6 max-w-2xl mx-auto">
              <p className="text-sm md:text-base text-black/60 leading-relaxed font-helvetica italic text-center">
                {renderProcessNote(processNoteText)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}