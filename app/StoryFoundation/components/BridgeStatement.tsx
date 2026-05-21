// app/components/foundation/BridgeStatement.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { BridgeStatementSettings } from "@/app/types/StoryFoundation/BridgeStatement";

export default function BridgeStatement() {
  const [settings, setSettings] = useState<Partial<BridgeStatementSettings>>({});
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('foundation_bridge_settings')
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

  // ========== MOBILE LAYOUT ==========
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
            <div className="text-center mb-6">
              <span className="text-sm uppercase tracking-wider text-black/30 font-helvetica">A brand audit tells you what is wrong.</span>
              <h2 className="text-2xl font-medium text-black mt-2 font-helvetica">The Foundation <span className="font-editorial italic">fixes it.</span></h2>
            </div>

            <p className="text-base text-black/70 leading-relaxed font-helvetica">
              Most founders get stuck here because rebuilding messaging means rewriting your website, your deck, your kit, your bios, and your sales emails, and doing all of it in one consistent voice. That is a lot of writing, and the cost of doing it inconsistently is a brand that feels splintered across every channel a customer or investor will ever see.
            </p>

            <div className="mt-6 pt-4 border-t border-black/10">
              <p className="text-base text-black font-medium leading-relaxed font-helvetica">
                The Foundation is how you stop patching the brand and start operating from a single source of truth.
              </p>
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
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-[10%] w-[350px] h-[350px] bg-[#e9c08f]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-[5%] w-[400px] h-[400px] bg-[#e6ee9c]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <div
          className={`transition-all duration-700 ease-out ${
            hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-10">
            <span className="text-sm uppercase tracking-wider text-black/30 font-helvetica">A brand audit tells you what is wrong.</span>
            <h2 className="text-3xl md:text-4xl font-medium text-black mt-3 font-helvetica">
              The foundation <span className="font-editorial italic">fixes it.</span>
            </h2>
          </div>

          <p className="text-xl md:text-2xl text-black/70 leading-relaxed font-helvetica">
            Most founders get stuck here because rebuilding messaging means rewriting your website, your deck, your kit, your bios, and your sales emails, and doing all of it in one consistent voice. That is a lot of writing, and the cost of doing it inconsistently is a brand that feels splintered across every channel a customer or investor will ever see.
          </p>

          <div className="mt-10 pt-6 border-t border-black/10">
            <p className="text-xl md:text-2xl text-black font-medium leading-relaxed font-helvetica">
              The Foundation is how you stop patching the brand and start operating from a single source of truth.
            </p>
            <div className="w-16 h-px bg-black/15 mt-6" />
          </div>
        </div>
      </div>
    </section>
  );
}