"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { TestimonialsSettings, Testimonial } from "@/app/types/StoryAudit/Testimonials";

export default function Testimonials() {
  const [settings, setSettings] = useState<Partial<TestimonialsSettings>>({});
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Default testimonials fallback
  const defaultTestimonials: Testimonial[] = [
    {
      id: 1,
      quote: "The audit gave me clarity I'd been missing for two years. Within weeks, we had a completely different response from press and partners.",
      author: "Angely Dub",
      role: "Founder",
      company: "",
      display_order: 1,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const { data: settingsData } = await supabase
        .from('audit_testimonials_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (settingsData) setSettings(settingsData);

      const { data: testimonialsData } = await supabase
        .from('audit_testimonials')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (testimonialsData && testimonialsData.length > 0) {
        setTestimonials(testimonialsData);
      } else {
        setTestimonials(defaultTestimonials);
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
    return <div className="w-full py-16" style={{ backgroundColor: '#f5f3ef' }}></div>;
  }

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;
  const count = displayTestimonials.length;

  // Determine grid layout based on number of testimonials
  const getGridClass = () => {
    if (count === 1) return "md:grid-cols-1 max-w-3xl mx-auto";
    if (count === 2) return "md:grid-cols-2 max-w-4xl mx-auto";
    return "md:grid-cols-3 max-w-6xl mx-auto";
  };

  // Helper to render quote with emphasis on key phrases
  const renderQuoteWithEmphasis = (quote: string) => {
    const emphasisPhrases = [
      "clarity I'd been missing",
      "completely different response"
    ];

    let result = [];
    let lastIndex = 0;
    
    for (const phrase of emphasisPhrases) {
      const index = quote.toLowerCase().indexOf(phrase.toLowerCase());
      if (index !== -1) {
        if (index > lastIndex) {
          result.push(quote.substring(lastIndex, index));
        }
        const foundPhrase = quote.substring(index, index + phrase.length);
        result.push(
          <span key={index} className="font-editorial italic text-black">
            {foundPhrase}
          </span>
        );
        lastIndex = index + phrase.length;
      }
    }
    
    if (lastIndex < quote.length) {
      result.push(quote.substring(lastIndex));
    }
    
    return result.length > 0 ? result : quote;
  };

  // ========== MOBILE LAYOUT ==========
  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full py-16 px-4 overflow-hidden"
        style={{ 
          background: `linear-gradient(to bottom, #ffffff 0%, #f5f3ef 30%, #f5f3ef 100%)`,
        }}
      >
        {/* Warm glow blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#e9c08f]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#e6ee9c]/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-xl font-medium text-black tracking-tight font-helvetica">
              What <span className="font-editorial italic">clients</span> say
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
            <div className="space-y-8">
              {displayTestimonials.map((testimonial, idx) => (
                <div
                  key={testimonial.id}
                  className={`transition-all duration-700 ease-out ${
                    hasAnimated
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  <div className="text-center">
                    <p className="text-xl text-black/70 leading-relaxed font-helvetica mb-4">
                      {renderQuoteWithEmphasis(testimonial.quote)}
                    </p>
                    {testimonial.author && (
                      <p className="text-base text-black/40 font-helvetica">
                        — {testimonial.author}
                      </p>
                    )}
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
      style={{ 
        background: `linear-gradient(to bottom, #ffffff 0%, #f5f3ef 30%, #f5f3ef 100%)`,
      }}
    >
      {/* Warm glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-[10%] w-[300px] h-[300px] bg-[#e9c08f]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[10%] w-[400px] h-[400px] bg-[#e6ee9c]/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/40 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl md:text-3xl font-medium text-black tracking-tight font-helvetica">
            What <span className="font-editorial italic">clients</span> say
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
          <div className={`grid ${getGridClass()} gap-8`}>
            {displayTestimonials.map((testimonial, idx) => (
              <div
                key={testimonial.id}
                className={`transition-all duration-700 ease-out ${
                  hasAnimated
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="text-center">
                  <p className="text-2xl md:text-3xl text-black/70 leading-relaxed font-helvetica mb-5">
                    {renderQuoteWithEmphasis(testimonial.quote)}
                  </p>
                  {testimonial.author && (
                    <div className="pt-4">
                      <p className="text-base md:text-lg text-black/40 font-helvetica">
                        — {testimonial.author}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}