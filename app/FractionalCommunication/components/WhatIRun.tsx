// app/components/fractional/WhatIRun.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { FractionalServicesSettings, FractionalService } from "@/app/types/FractionalCommunication/WhatIRun";
import Image from "next/image";

export default function WhatIRun() {
  const [settings, setSettings] = useState<Partial<FractionalServicesSettings>>({});
  const [services, setServices] = useState<FractionalService[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const defaultServices: FractionalService[] = [
    { id: 1, title: "Brand messaging and positioning", description: "Work as the business evolves.", display_order: 1 },
    { id: 2, title: "Content strategy and execution", description: "Across newsletters, Substack, LinkedIn, and social.", display_order: 2 },
    { id: 3, title: "Public relations", description: "Including press kit development, media outreach, and spokesperson moments.", display_order: 3 },
    { id: 4, title: "Partnerships and brand collaborations", description: "That expand reach in the food and hospitality space.", display_order: 4 },
    { id: 5, title: "Launch and event communications", description: "Including campaign planning and live activation.", display_order: 5 },
    { id: 6, title: "Founder voice work", description: "Including ghostwriting and editorial coaching.", display_order: 6 },
    { id: 7, title: "Communications operations", description: "Including briefs, content calendars, approval flows, and AI workflows that turn the brand into a repeatable system.", display_order: 7 },
    { id: 8, title: "Hiring and managing specialists", description: "The writers, designers, and specialists who extend the brand without losing voice.", display_order: 8 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const { data: settingsData } = await supabase.from('fractional_services_settings').select('*').eq('id', 1).single();
      if (settingsData) setSettings(settingsData);

      const { data: servicesData } = await supabase.from('fractional_services').select('*').order('display_order', { ascending: true });
      if (servicesData && servicesData.length > 0) setServices(servicesData);
      else setServices(defaultServices);

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

  const displayServices = services.length > 0 ? services : defaultServices;

  const renderTitle = (title: string) => {
    const emphasisMap: Record<string, string> = {
      "Brand messaging and positioning": "messaging and positioning",
      "Content strategy and execution": "strategy and execution",
      "Public relations": "relations",
      "Partnerships and brand collaborations": "collaborations",
      "Launch and event communications": "communications",
      "Founder voice work": "voice",
      "Communications operations": "operations",
      "Hiring and managing specialists": "specialists"
    };
    
    const emphasisWord = emphasisMap[title];
    if (emphasisWord) {
      const parts = title.split(emphasisWord);
      return <>{parts[0]}<span className="font-editorial italic text-black">{emphasisWord}</span>{parts[1]}</>;
    }
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
            <h2 className="text-xl font-medium text-black tracking-tight font-helvetica">What I <span className="font-editorial italic">run</span> for clients on retainer</h2>
            <div className="w-12 h-px bg-black/20 mx-auto mt-3" />
          </div>
          <div className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="space-y-4">
              {displayServices.map((service, idx) => (
                <div key={service.id} className={`flex items-start gap-3 transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`} style={{ transitionDelay: `${idx * 50}ms` }}>
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-black/10 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-black/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-black mb-0.5 font-helvetica">{renderTitle(service.title)}</h3>
                    <p className="text-xs text-black/50 leading-relaxed font-helvetica">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image and quote section - mobile (stacked, below the list) */}
          <div className="mt-10">
            <div className="w-full relative aspect-[16/9] rounded-lg overflow-hidden shadow-lg mb-6">
              <Image
                src="/FractionalComms/2.png"
                alt="Fractional communications services illustration"
                fill
                className="object-cover "
                style={{ objectPosition: '50% 13%' }}
                priority={false}
              />
            </div>
            <div className="relative bg-black/5 rounded-lg p-6">
              <svg className="w-6 h-6 text-[#e9c08f]/50 absolute top-4 left-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-base italic text-black/80 leading-relaxed font-editorial px-4 py-8">
                A fractional communications leader who runs the work so founders can stay in their zone of genius — building the business.
              </p>
              <svg className="w-6 h-6 text-[#e9c08f]/50 absolute bottom-4 right-4 rotate-180" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <div className="mt-2 w-12 h-px bg-[#e9c08f] mx-auto" />
            </div>
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
            What I <span className="font-editorial italic">run</span> for clients on retainer
          </h2>
          <div className="w-16 h-px bg-black/20 mx-auto mt-4" />
        </div>
        <div className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="grid md:grid-cols-2 gap-6">
            {displayServices.map((service, idx) => (
              <div key={service.id} className={`flex items-start gap-3 transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`} style={{ transitionDelay: `${idx * 50}ms` }}>
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-black/5 flex items-center justify-center mt-1">
                  <svg className="w-3 h-3 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-black mb-1 font-helvetica">
                    {renderTitle(service.title)}
                  </h3>
                  <p className="text-sm md:text-base text-black/50 leading-relaxed font-helvetica">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Image left, quote right - desktop version (below the list) */}
          <div className="mt-16 grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="w-full relative aspect-[11/12] rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/FractionalComms/2.png"
                alt="Fractional communications services illustration"
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
                A fractional communications leader who runs the work so founders can stay in their zone of genius — building the business.
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