// app/components/fractional/BridgeStatement.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { FractionalBridgeSettings } from "@/app/types/FractionalCommunication/BridgeStatement";

export default function BridgeStatement() {
  const [settings, setSettings] = useState<Partial<FractionalBridgeSettings>>({});
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('fractional_bridge_settings')
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
      { threshold: 0.2, rootMargin: "0px 0px -100px 0px" }
    );

    observer.observe(currentSection);
    return () => { if (currentSection) observer.unobserve(currentSection); };
  }, [hasAnimated, loading]);

  if (loading) {
    return <div className="w-full py-16" style={{ backgroundColor: '#ffffff' }}></div>;
  }

  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full py-16 px-4 overflow-hidden"
        style={{ backgroundColor: '#ffffff' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#e9c08f]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#e6ee9c]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div
            className={`transition-all duration-700 ease-out ${
              hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="space-y-4">
              <p className="text-base text-black/70 leading-relaxed font-helvetica">
                Hiring a head of communications too early is expensive and slow. Hiring a freelancer per task produces a brand that sounds like five different people wrote it. Hiring an agency means paying overhead for a team that does not actually understand your category.
              </p>
              <p className="text-base text-black/70 leading-relaxed font-helvetica">
                What most early-stage food-forward founders need is a senior Brand & Comms Director embedded in the business. Someone who shows up consistently, holds the strategy across every channel, runs the work, and pulls in specialists only when the project actually needs them.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-black/10">
              <p className="text-base text-black font-medium leading-relaxed font-helvetica">
                That is what Fractional Comms is built for.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-28 px-6 sm:px-8 lg:px-12 overflow-hidden"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-[10%] w-[350px] h-[350px] bg-[#e9c08f]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-[5%] w-[400px] h-[400px] bg-[#e6ee9c]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div
          className={`transition-all duration-700 ease-out ${
            hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="space-y-6">
            <p className="text-xl md:text-2xl lg:text-3xl text-black/70 leading-relaxed font-helvetica">
              Hiring a head of communications too early is expensive and slow. Hiring a freelancer per task produces a brand that sounds like five different people wrote it. Hiring an agency means paying overhead for a team that does not actually understand your category.
            </p>
            <p className="text-xl md:text-2xl lg:text-3xl text-black/70 leading-relaxed font-helvetica">
              What most early-stage food-forward founders need is a senior Brand & Comms Director embedded in the business. Someone who shows up consistently, holds the strategy across every channel, runs the work, and pulls in specialists only when the project actually needs them.
            </p>
          </div>

          <div className="mt-10 pt-6 border-t border-black/10">
            <p className="text-xl md:text-2xl lg:text-3xl text-black font-medium leading-relaxed font-helvetica">
              That is what Fractional Comms is built for.
            </p>
            <div className="w-16 h-px bg-black/15 mt-6" />
          </div>
        </div>
      </div>
    </section>
  );
}