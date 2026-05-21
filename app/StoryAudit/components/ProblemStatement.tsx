"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { ProblemStatementSettings } from "@/app/types/StoryAudit/ProblemStatement";

export default function ProblemStatement() {
  const [settings, setSettings] = useState<Partial<ProblemStatementSettings>>({});
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('audit_problem_statement')
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

  if (loading) {
    return <div className="w-full py-16" style={{ backgroundColor: '#f5f3ef' }}></div>;
  }

  // ========== MOBILE LAYOUT ==========
  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full py-16 px-4 overflow-hidden"
        style={{ backgroundColor: '#f5f3ef' }}
      >
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '30px'
          }} />
        </div>

        {/* Warm glow blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#e9c08f]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#e6ee9c]/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Header with editorial italic - matching original design */}
          <div className="mb-8 text-center">
            <h2 className="text-xl font-medium text-black tracking-tight font-helvetica">
              The <span className="font-editorial italic">real</span> problem
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
            {/* Opening statement */}
            <div className="relative">
              <span className="absolute -top-4 -left-2 text-5xl text-black/10 font-editorial">"</span>
              <p className="text-base text-black/80 leading-relaxed font-helvetica relative z-10">
                Most early-stage food brands aren't underperforming because of a bad product. They are underperforming because their messaging grew piece by piece, on different days, in different moods, with <span className="font-editorial italic text-black">no underlying story holding it together.</span>
              </p>
            </div>

            {/* Fragmented list */}
            <div className="my-8 space-y-2 pl-3 border-l-2 border-black/15">
              <p className="text-sm text-black/40 font-helvetica">A website written two years ago.</p>
              <p className="text-sm text-black/40 font-helvetica">Captions written last week.</p>
              <p className="text-sm text-black/40 font-helvetica">A pitch deck written for one specific investor.</p>
              <p className="text-sm text-black/40 font-helvetica">A press kit nobody has opened since launch.</p>
            </div>

            {/* Consequence statement */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 my-6 border border-black/5 shadow-sm">
              <p className="text-base text-black/80 leading-relaxed font-helvetica">
                That is <span className="font-editorial italic text-black font-medium">expensive.</span> It costs you press hits. It costs you partnership conversations. It costs you customers who <span className="font-editorial italic text-black">would have stayed</span> if the brand had been clearer.
              </p>
            </div>

            {/* Resolution statement */}
            <div className="mt-8 pt-4">
              <p className="text-base text-black font-medium leading-relaxed font-helvetica">
                The audit is how you find out exactly where the story is breaking down, and what to do about it.
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
      style={{ backgroundColor: '#f5f3ef' }}
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '40px'
        }} />
      </div>

      {/* Warm glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-[10%] w-[400px] h-[400px] bg-[#e9c08f]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-[5%] w-[500px] h-[500px] bg-[#e6ee9c]/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header with editorial italic - matching original design pattern */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-medium text-black tracking-tight font-helvetica">
            The <span className="font-editorial italic">real</span> problem
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
          {/* Opening paragraph with decorative quote */}
          <div className="relative">
            <span className="absolute -top-10 -left-8 text-8xl text-black/8 font-editorial select-none">"</span>
            <p className="text-xl md:text-2xl text-black/70 leading-relaxed font-helvetica relative z-10">
              Most early-stage food brands aren't underperforming because of a bad product. They are underperforming because their messaging grew piece by piece, on different days, in different moods, with <span className="font-editorial italic text-black">no underlying story holding it together.</span>
            </p>
          </div>

          {/* Fragmented list */}
          <div className="my-12 space-y-3 pl-8 border-l-2 border-black/15">
            <p className="text-base md:text-lg text-black/35 font-helvetica">A website written two years ago.</p>
            <p className="text-base md:text-lg text-black/35 font-helvetica">Captions written last week.</p>
            <p className="text-base md:text-lg text-black/35 font-helvetica">A pitch deck written for one specific investor.</p>
            <p className="text-base md:text-lg text-black/35 font-helvetica">A press kit nobody has opened since launch.</p>
          </div>

          {/* Consequence statement */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 my-10 border border-white/20 shadow-sm">
            <p className="text-xl md:text-2xl text-black/70 leading-relaxed font-helvetica">
              That is <span className="font-editorial italic text-black font-medium">expensive.</span> It costs you press hits. It costs you partnership conversations. It costs you customers who <span className="font-editorial italic text-black">would have stayed</span> if the brand had been clearer.
            </p>
          </div>

          {/* Resolution statement */}
          <div className="mt-12 pt-6 text-center">
            <div className="inline-block">
              <p className="text-xl md:text-2xl text-black font-medium leading-relaxed font-helvetica">
                The audit is how you find out exactly where the story is breaking down, and what to do about it.
              </p>
              <div className="w-full h-px bg-black/15 mt-5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}