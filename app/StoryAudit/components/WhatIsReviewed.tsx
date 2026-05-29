"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { WhatIsReviewedSettings, ReviewArea } from "@/app/types/StoryAudit/WhatIsReviewed";
import Image from "next/image";

export default function WhatIsReviewed() {
  const [settings, setSettings] = useState<Partial<WhatIsReviewedSettings>>({});
  const [reviewAreas, setReviewAreas] = useState<ReviewArea[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Default review areas fallback
  const defaultReviewAreas: ReviewArea[] = [
    {
      id: 1,
      title: "Story clarity",
      description: "Can a stranger explain what your brand stands for in one sentence after five minutes on your site? If they cannot, that is the first problem.",
      display_order: 1,
    },
    {
      id: 2,
      title: "Voice consistency",
      description: "Does your website sound like your Instagram? Does your deck sound like your founder bio? Most brands fail this test, and most do not realise until somebody points it out.",
      display_order: 2,
    },
    {
      id: 3,
      title: "Channel performance",
      description: "Where is the brand earning attention, and where is it burning effort? Which channels deserve more investment, and which deserve less?",
      display_order: 3,
    },
    {
      id: 4,
      title: "Strategic gaps",
      description: "What story elements are missing entirely? What positioning territory is sitting wide open that you have not claimed yet?",
      display_order: 4,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      // Fetch settings
      const { data: settingsData } = await supabase
        .from('audit_review_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (settingsData) setSettings(settingsData);

      // Fetch review areas
      const { data: areasData } = await supabase
        .from('audit_review_areas')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (areasData && areasData.length > 0) {
        setReviewAreas(areasData);
      } else {
        setReviewAreas(defaultReviewAreas);
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

  const displayAreas = reviewAreas.length > 0 ? reviewAreas : defaultReviewAreas;
  const sectionTitle = settings.section_title || "What the audit reviews";

  // Helper to render title with italic emphasis
  const renderTitle = (title: string) => {
    if (title === "Story clarity") {
      return <>Story <span className="font-editorial italic">clarity</span></>;
    }
    if (title === "Voice consistency") {
      return <>Voice <span className="font-editorial italic">consistency</span></>;
    }
    if (title === "Channel performance") {
      return <>Channel <span className="font-editorial italic">performance</span></>;
    }
    if (title === "Strategic gaps") {
      return <>Strategic <span className="font-editorial italic">gaps</span></>;
    }
    return title;
  };

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
              What the audit <span className="font-editorial italic">reviews</span>
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
            <div className="space-y-6">
              {displayAreas.map((area, idx) => (
                <div
                  key={area.id}
                  className={`transition-all duration-700 ease-out ${
                    hasAnimated
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  <h3 className="text-lg font-semibold text-black mb-2 font-helvetica">
                    {renderTitle(area.title)}
                  </h3>
                  <p className="text-base text-black/60 leading-relaxed font-helvetica">
                    {area.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Image + Quote Section - Mobile (stacked, below the list) */}
            <div className="mt-12">
              {/* Image Container - using aspect-[16/9] like WhatIRun mobile */}
              <div className="w-full relative aspect-[16/9] rounded-lg overflow-hidden shadow-lg mb-6">
                <Image
                  src="/StoryAudit/2.png"
                  alt="Story audit review process illustration showing brand analysis"
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
                  Most brands don't have a story problem. They have a clarity problem. The audit shows you exactly where the story is breaking down.
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

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header with editorial italic */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl md:text-3xl font-medium text-black tracking-tight font-helvetica">
            What the audit <span className="font-editorial italic">reviews</span>
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
          {/* Review Areas Grid */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {displayAreas.map((area, idx) => (
              <div
                key={area.id}
                className={`transition-all duration-700 ease-out ${
                  hasAnimated
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-start gap-3">
                  {/* Decorative number */}
                  <span className="text-4xl font-editorial italic text-black/10">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-semibold text-black mb-3 font-helvetica">
                      {renderTitle(area.title)}
                    </h3>
                    <p className="text-base md:text-lg text-black/60 leading-relaxed font-helvetica">
                      {area.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Image + Quote Section - Desktop (side-by-side grid layout like WhatIRun) */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image Container - using aspect-[11/12] like WhatIRun desktop (portrait orientation) */}
            <div className=" w-full relative aspect-[11/12] rounded-lg overflow-hidden shadow-lg order-1">
              <Image
                src="/StoryAudit/2.png"
                alt="Story audit review process illustration showing brand analysis across different channels"
                fill
                className="object-cover"
                priority={false}
              />
            </div>
            
            {/* Quote Container */}
            <div className="relative bg-black/5 rounded-lg p-8 py-24 order-2">
              <svg className="w-8 h-8 text-[#e9c08f]/50 absolute top-6 left-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-xl lg:text-3xl italic text-black/80 leading-relaxed font-editorial px-6 py-20">
                Most brands don't have a story problem. They have a clarity problem. The audit shows you exactly where the story is breaking down.
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