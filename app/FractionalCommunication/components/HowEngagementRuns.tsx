// app/components/fractional/HowEngagementRuns.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { FractionalEngagementSettings, EngagementStep } from "@/app/types/fractional";

export default function HowEngagementRuns() {
  const [settings, setSettings] = useState<Partial<FractionalEngagementSettings>>({});
  const [steps, setSteps] = useState<EngagementStep[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const defaultSteps: EngagementStep[] = [
    { id: 1, title: "A discovery call", description: "A 30-minute conversation to understand the business, the goal, and whether we are a fit.", display_order: 1 },
    { id: 2, title: "A scoped proposal", description: "A written proposal within 48 hours covering monthly priorities, deliverables, and rate.", display_order: 2 },
    { id: 3, title: "A three-month minimum", description: "Engagements start at three months and are reviewed quarterly so we can both calibrate as the work develops.", display_order: 3 },
    { id: 4, title: "Async-first communication", description: "Weekly or fortnightly syncs depending on scope, with async support in between. I commit to a 48-hour response time on async messages during business days.", display_order: 4 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const { data: settingsData } = await supabase.from('fractional_engagement_settings').select('*').eq('id', 1).single();
      if (settingsData) setSettings(settingsData);
      const { data: stepsData } = await supabase.from('fractional_engagement_steps').select('*').order('display_order', { ascending: true });
      if (stepsData && stepsData.length > 0) setSteps(stepsData);
      else setSteps(defaultSteps);
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
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting && !hasAnimated) setHasAnimated(true); }); },
      { threshold: 0.2, rootMargin: "0px 0px -100px 0px" }
    );
    observer.observe(currentSection);
    return () => { if (currentSection) observer.unobserve(currentSection); };
  }, [hasAnimated, loading]);

  if (loading) return <div className="w-full py-16" style={{ backgroundColor: '#000000' }}></div>;

  const displaySteps = steps.length > 0 ? steps : defaultSteps;

  const renderTitle = (title: string) => {
    const emphasisMap: Record<string, string> = {
      "A discovery call": "discovery call",
      "A scoped proposal": "scoped proposal",
      "A three-month minimum": "three-month minimum",
      "Async-first communication": "Async-first"
    };
    
    const emphasisWord = emphasisMap[title];
    if (emphasisWord) {
      const parts = title.split(emphasisWord);
      return <>{parts[0]}<span className="font-editorial italic text-white">{emphasisWord}</span>{parts[1]}</>;
    }
    return title;
  };

  if (isMobile) {
    return (
      <section ref={sectionRef} className="relative w-full py-16 px-4 overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#e9c08f]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#e6ee9c]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-medium text-white tracking-tight font-helvetica">How the engagement <span className="font-editorial italic">runs</span></h2>
            <div className="w-12 h-px bg-white/20 mx-auto mt-3" />
          </div>
          <div className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="space-y-8">
              {displaySteps.map((step, idx) => (
                <div key={step.id} className={`flex flex-col items-center text-center transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: `${idx * 150}ms` }}>
                  <div className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center text-lg font-medium font-helvetica mb-3">
                    {idx + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 font-helvetica">{renderTitle(step.title)}</h3>
                  <p className="text-sm text-white/60 leading-relaxed font-helvetica">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative w-full py-28 px-6 sm:px-8 lg:px-12 overflow-hidden" style={{ backgroundColor: '#000000' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-[5%] w-[300px] h-[300px] bg-[#e9c08f]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[10%] w-[400px] h-[400px] bg-[#e6ee9c]/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium text-white tracking-tight font-helvetica">
            How the engagement <span className="font-editorial italic">runs</span>
          </h2>
          <div className="w-16 h-px bg-white/20 mx-auto mt-4" />
        </div>
        <div className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displaySteps.map((step, idx) => (
              <div key={step.id} className={`text-center transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: `${idx * 100}ms` }}>
                <div className="w-16 h-16 rounded-full bg-white/10 text-white flex items-center justify-center text-2xl font-medium font-helvetica mx-auto mb-4">
                  {idx + 1}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 font-helvetica">
                  {renderTitle(step.title)}
                </h3>
                <p className="text-base text-white/60 leading-relaxed font-helvetica">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}