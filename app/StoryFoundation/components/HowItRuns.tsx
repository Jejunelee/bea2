// app/components/foundation/HowItRuns.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { HowItRunsSettings, Phase } from "@/app/types/StoryFoundation/HowItRuns";
import Image from "next/image";

export default function HowItRuns() {
  const [settings, setSettings] = useState<Partial<HowItRunsSettings>>({});
  const [phases, setPhases] = useState<Phase[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const defaultPhases: Phase[] = [
    { id: 1, title: "The audit.", description: "The full Story Audit, included as the first phase. We start with a 60 minute kickoff call, then I review every public-facing channel your brand currently lives on and deliver a written audit and a 30 to 90 day action plan. We get on a walkthrough call to talk through the recommendations and align on what the Foundation needs to address.", display_order: 1 },
    { id: 2, title: "The messaging architecture.", description: "This is where the rebuild happens. I write out your brand story, value proposition, positioning statement, audience definitions, key messages, and voice and tone guidelines. You review and approve in two structured rounds. By the end of phase two, you have a single document your team can use as the source of truth for everything you write, from now on.", display_order: 2 },
    { id: 3, title: "Activation across three priority assets.", description: "You choose three assets to rebuild, and I rewrite them to match the new messaging. Most founders pick some combination of website copy, pitch deck, press kit, founder bio, sales one-pager, or launch communications plan. Each asset is delivered fully written and ready to ship.", display_order: 3 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const { data: settingsData } = await supabase.from('foundation_phases_settings').select('*').eq('id', 1).single();
      if (settingsData) setSettings(settingsData);
      const { data: phasesData } = await supabase.from('foundation_phases').select('*').order('display_order', { ascending: true });
      if (phasesData && phasesData.length > 0) setPhases(phasesData);
      else setPhases(defaultPhases);
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

  if (loading) return <div className="w-full py-16" style={{ backgroundColor: '#fefdf8' }}></div>;

  const displayPhases = phases.length > 0 ? phases : defaultPhases;

  const renderTitle = (title: string) => {
    if (title === "The audit.") return <>The <span className="font-editorial italic">audit.</span></>;
    if (title === "The messaging architecture.") return <>The messaging <span className="font-editorial italic">architecture.</span></>;
    if (title === "Activation across three priority assets.") return <>Activation across three priority <span className="font-editorial italic">assets.</span></>;
    return title;
  };

  if (isMobile) {
    return (
      <section ref={sectionRef} className="relative w-full py-16 px-4 overflow-hidden" style={{ backgroundColor: '#fefdf8' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#e9c08f]/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#e6ee9c]/15 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-medium text-black tracking-tight font-helvetica">How the engagement <span className="font-editorial italic">runs</span></h2>
            <div className="w-12 h-px bg-black/20 mx-auto mt-3" />
            <p className="text-sm text-black/50 mt-3">The Foundation runs in three phases over four to six weeks. Each phase ends with a deliverable and a checkpoint, so you always know exactly where the work stands.</p>
          </div>
          <div className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="space-y-8">
              {displayPhases.map((phase, idx) => (
                <div key={phase.id} className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: `${idx * 100}ms` }}>
                  <div className="flex items-start gap-3">
                    <span className="text-3xl font-editorial italic text-black/20">{String(idx + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-black mb-2 font-helvetica">{renderTitle(phase.title)}</h3>
                      <p className="text-sm text-black/60 leading-relaxed font-helvetica">{phase.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Image + Quote Section - Mobile (stacked, below the phases) */}
            <div className="mt-12">
              {/* Image Container */}
              <div className="w-full relative aspect-[16/9] rounded-lg overflow-hidden shadow-lg mb-6">
                <Image
                  src="/StoryFoundation/2.png"
                  alt="Story Foundation engagement process illustration"
                  fill
                  className="object-cover"
                  style={{ objectPosition: '50% 30%' }}
                  priority={false}
                />
              </div>
              
              {/* Quote Container */}
              <div className="relative bg-black/5 rounded-lg p-6">
                <svg className="w-6 h-6 text-[#e9c08f]/50 absolute top-4 left-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-base italic text-black/80 leading-relaxed font-editorial px-4 py-8">
                  The Foundation gives you a complete brand system, not just another document for your Google Drive. Every phase delivers something you can actually use.
                </p>
                <svg className="w-6 h-6 text-[#e9c08f]/50 absolute bottom-4 right-4 rotate-180" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <div className="mt-2 w-12 h-px bg-[#e9c08f] mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative w-full py-28 px-6 overflow-hidden" style={{ backgroundColor: '#fefdf8' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-[10%] w-[350px] h-[350px] bg-[#e9c08f]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-[5%] w-[400px] h-[400px] bg-[#e6ee9c]/15 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-2xl md:text-3xl font-medium text-black tracking-tight font-helvetica">How the engagement <span className="font-editorial italic">runs</span></h2>
          <div className="w-16 h-px bg-black/20 mx-auto mt-4" />
          <p className="text-base md:text-lg text-black/50 mt-4 max-w-2xl mx-auto">The Foundation runs in three phases over four to six weeks. Each phase ends with a deliverable and a checkpoint, so you always know exactly where the work stands.</p>
        </div>
        <div className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {/* Phases Grid */}
          <div className="space-y-10 mb-16">
            {displayPhases.map((phase, idx) => (
              <div key={phase.id} className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: `${idx * 100}ms` }}>
                <div className="flex items-start gap-5">
                  <span className="text-5xl font-editorial italic text-black/10">{String(idx + 1).padStart(2, '0')}</span>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-semibold text-black mb-3 font-helvetica">{renderTitle(phase.title)}</h3>
                    <p className="text-base md:text-lg text-black/60 leading-relaxed font-helvetica">{phase.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Image + Quote Section - Desktop (side-by-side grid layout) */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image Container */}
            <div className="w-full relative aspect-[11/12] rounded-lg overflow-hidden shadow-lg order-1">
              <Image
                src="/StoryFoundation/2.png"
                alt="Story Foundation engagement process illustration showing phased brand transformation"
                fill
                className="object-cover"
                priority={false}
              />
            </div>
            
            {/* Quote Container */}
            <div className="py-24 relative bg-black/5 rounded-lg p-8 order-2">
              <svg className="w-8 h-8 text-[#e9c08f]/50 absolute top-6 left-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-xl lg:text-3xl italic text-black/80 leading-relaxed font-editorial px-6 py-20">
                The Foundation gives you a complete brand system, not just another document for your Google Drive. Every phase delivers something you can actually use.
              </p>
              <svg className="w-8 h-8 text-[#e9c08f]/50 absolute bottom-6 right-6 rotate-180" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <div className="mt-4 w-12 h-px bg-[#e9c08f] mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}