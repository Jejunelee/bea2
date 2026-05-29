// app/components/advisory/WhatAdvisoryIncludes.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { AdvisoryIncludesSettings, AdvisoryInclude } from "@/app/types/CommunicationsAdvisory/WhatAdvisoryIncludes";
import Image from "next/image";

export default function WhatAdvisoryIncludes() {
  const [settings, setSettings] = useState<Partial<AdvisoryIncludesSettings>>({});
  const [includes, setIncludes] = useState<AdvisoryInclude[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const defaultIncludes: AdvisoryInclude[] = [
    { 
      id: 1, 
      title: "One 90-minute strategy session per month",
      description: "A focused working session built around your current priorities: messaging decisions, campaign planning, brand positioning, content strategy, or whatever the business needs most that month.",
      display_order: 1 
    },
    { 
      id: 2, 
      title: "Async support between sessions",
      description: "Direct access for quick decisions, copy reviews, and strategic questions that cannot wait until the next session. I commit to a 48-hour response time on async messages during business days.",
      display_order: 2 
    },
    { 
      id: 3, 
      title: "A monthly priorities brief",
      description: "A short written document after each session, capturing decisions made, priorities for the month, and what to watch. So the thinking doesn't stay on the call.",
      display_order: 3 
    },
    { 
      id: 4, 
      title: "Quarterly brand health check",
      description: "Every three months, a structured review of how the brand is showing up across channels: what is working, what has drifted, and what to sharpen going into the next quarter.",
      display_order: 4 
    },
  ];

  const renderTitle = (title: string) => {
    if (title === "One 90-minute strategy session per month") {
      return <>One 90-minute strategy <span className="font-editorial italic text-white">session per month</span></>;
    }
    if (title === "Async support between sessions") {
      return <>Async <span className="font-editorial italic text-white">support between sessions</span></>;
    }
    if (title === "A monthly priorities brief") {
      return <>A monthly priorities <span className="font-editorial italic text-white">brief</span></>;
    }
    if (title === "Quarterly brand health check") {
      return <>Quarterly brand health <span className="font-editorial italic text-white">check</span></>;
    }
    return title;
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: settingsData } = await supabase.from('advisory_includes_settings').select('*').eq('id', 1).single();
      if (settingsData) setSettings(settingsData);

      const { data: includesData } = await supabase.from('advisory_includes').select('*').order('display_order', { ascending: true });
      if (includesData && includesData.length > 0) setIncludes(includesData);
      else setIncludes(defaultIncludes);

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

  const displayIncludes = includes.length > 0 ? includes : defaultIncludes;

  if (isMobile) {
    return (
      <section ref={sectionRef} className="relative w-full py-16 px-4 overflow-hidden" style={{ backgroundColor: '#fefdf8' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#e9c08f]/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#e6ee9c]/15 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-medium text-black tracking-tight font-helvetica">What Advisory <span className="font-editorial italic">includes</span></h2>
            <div className="w-12 h-px bg-black/20 mx-auto mt-3" />
          </div>

          <div className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="space-y-6">
              {displayIncludes.map((item, idx) => (
                <div key={item.id} className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: `${idx * 100}ms` }}>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-black/10 flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-black/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-black mb-1 font-helvetica">{renderTitle(item.title)}</h3>
                      <p className="text-sm text-black/60 leading-relaxed font-helvetica">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image and quote section - mobile (stacked, below the list) */}
          <div className="mt-10">
            <div className="w-full relative aspect-[16/9] rounded-lg overflow-hidden shadow-lg mb-6">
              <Image
                src="/CommsAdvisory/2.png"
                alt="Communications advisory services illustration"
                fill
                className="object-cover"
                priority={false}
              />
            </div>
            <div className="relative bg-black/5 rounded-lg p-6">
              <svg className="w-6 h-6 text-[#e9c08f]/50 absolute top-4 left-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-base italic text-black/80 leading-relaxed font-editorial px-4 py-8">
                A senior partner who has already built brands in this category — not someone learning your industry on your time.
              </p>
              <svg className="w-6 h-6 text-[#e9c08f]/50 absolute bottom-4 right-4 rotate-180" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <div className="mt-2 w-12 h-px bg-[#e9c08f] mx-auto" />
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-black/10">
            <p className="text-sm text-black/50 leading-relaxed font-helvetica">
              If you need someone in the business running the work, I'd recommend <a href="/fractional" className="text-black underline font-medium">Fractional Comms →</a>
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative w-full py-28 px-6 sm:px-8 lg:px-12 overflow-hidden" style={{ backgroundColor: '#fefdf8' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-[10%] w-[350px] h-[350px] bg-[#e9c08f]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-[5%] w-[400px] h-[400px] bg-[#e6ee9c]/15 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium text-black tracking-tight font-helvetica">
            What Advisory <span className="font-editorial italic">includes</span>
          </h2>
          <div className="w-16 h-px bg-black/20 mx-auto mt-4" />
        </div>

        <div className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
            {displayIncludes.map((item, idx) => (
              <div key={item.id} className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: `${idx * 100}ms` }}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-black/5 flex items-center justify-center mt-1">
                    <svg className="w-5 h-5 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold text-black mb-2 font-helvetica">
                      {renderTitle(item.title)}
                    </h3>
                    <p className="text-base md:text-lg text-black/60 leading-relaxed font-helvetica">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Image left, quote right - desktop version (below the list) */}
          <div className="mt-16 grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="w-full relative aspect-[11/12] rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/CommsAdvisory/2.png"
                alt="Communications advisory services illustration"
                fill
                className="object-cover"
                priority={false}
              />
            </div>
            <div className="relative bg-black/5 rounded-lg p-8">
              <svg className="w-8 h-8 text-[#e9c08f]/50 absolute top-6 left-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-xl lg:text-4xl italic text-black/80 leading-relaxed font-editorial px-6 py-28">
                A senior partner who has already built brands in this category — not someone learning your industry on your time.
              </p>
              <svg className="w-8 h-8 text-[#e9c08f]/50 absolute bottom-6 right-6 rotate-180" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <div className="mt-4 w-12 h-px bg-[#e9c08f] mx-auto" />
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-black/10 text-center">
            <p className="text-base md:text-lg text-black/50 leading-relaxed font-helvetica">
              If you need someone in the business running the work, I'd recommend <a href="/FractionalCommunication" className="text-black underline font-medium hover:no-underline transition-all">Fractional Comms →</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}