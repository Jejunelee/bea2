"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { Section1Settings } from "@/app/types/peoplesection1";

export default function Section1() {
  const [settings, setSettings] = useState<Partial<Section1Settings>>({});
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('section1_settings')
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
    return <div className="w-full py-12" style={{ backgroundColor: '#FFFBE7' }}></div>;
  }

  // ========== MOBILE LAYOUT ==========
  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        className="w-full py-12"
        style={{ backgroundColor: settings.background_color || '#FFFBE7' }}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col gap-8">
          
          {/* IMAGE - First on mobile */}
          <div
            className={`relative w-full h-[300px] transition-all duration-800 delay-300 ease-out ${
              hasAnimated
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95"
            }`}
          >
            <img
              src={settings.image_url || '/people/computer.png'}
              alt={settings.image_alt || 'Messaging audit preview'}
              className="object-cover w-full h-full rounded-2xl shadow-md"
            />
          </div>

          {/* CONTENT */}
          <div>
            {/* Popular badge */}
            <div
              className={`transition-all duration-700 ease-out ${
                hasAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <p className="text-sm tracking-widest uppercase mb-4" style={{ color: settings.badge_text_color || '#000000' }}>
                {settings.badge_text || 'Most Popular | Messaging Audit'}
              </p>
            </div>

            {/* Heading */}
            <div
              className={`transition-all duration-700 delay-75 ease-out ${
                hasAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <h2 className="text-2xl font-medium leading-tight mb-4" style={{ color: settings.title_color || '#FF7A95' }}>
                {settings.title || 'One Session. One Direction. Real Clarity.'}
              </h2>
            </div>

            {/* Description */}
            <div
              className={`transition-all duration-700 delay-150 ease-out ${
                hasAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <p className="text-base mb-4" style={{ color: settings.description_color || '#000000' }}>
                {settings.description || 'A Focused 90-Minute Deep Dive Into Your Brand, Your Story Gaps, And One Clear Path Forward. You Leave The Session Knowing Exactly What To Say And, Just As Importantly, What To Stop Saying.'}
              </p>
            </div>

            {/* Bullet points */}
            <ul className="space-y-1.5 mb-6 text-sm">
              {(settings.bullets || []).map((item, idx) => (
                <li
                  key={idx}
                  className={`transition-all duration-700 ease-out ${
                    hasAnimated
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-4"
                  }`}
                  style={{ transitionDelay: `${200 + idx * 100}ms`, color: settings.bullet_color || '#000000' }}
                >
                  • {item}
                </li>
              ))}
            </ul>

            {/* Button */}
            <div
              className={`transition-all duration-700 delay-500 ease-out ${
                hasAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <button 
                className="text-sm font-medium px-5 py-1.5 rounded-full border border-black shadow-sm hover:opacity-90 transition"
                style={{ 
                  backgroundColor: settings.button_background_color || '#FF7A95',
                  color: settings.button_text_color || '#000000'
                }}
              >
                {settings.button_text || '£500 / one-off, flat fee'}
              </button>
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
      className="w-full py-12"
      style={{ backgroundColor: settings.background_color || '#FFFBE7' }}
    >
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        
        {/* LEFT CONTENT */}
        <div>
          {/* Popular badge - fade up */}
          <div
            className={`transition-all duration-700 ease-out ${
              hasAnimated
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <p className="text-2xl tracking-widest uppercase mb-6" style={{ color: settings.badge_text_color || '#000000' }}>
              {settings.badge_text || 'Most Popular | Messaging Audit'}
            </p>
          </div>

          {/* Heading - fade up with delay */}
          <div
            className={`transition-all duration-700 delay-75 ease-out ${
              hasAnimated
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-medium leading-tight mb-6" style={{ color: settings.title_color || '#FF7A95' }}>
              {settings.title || 'One Session. One Direction. Real Clarity.'}
            </h2>
          </div>

          {/* Description - fade up with delay */}
          <div
            className={`transition-all duration-700 delay-150 ease-out ${
              hasAnimated
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <p className="text-xl mb-6 max-w-xl" style={{ color: settings.description_color || '#000000' }}>
              {settings.description || 'A Focused 90-Minute Deep Dive Into Your Brand, Your Story Gaps, And One Clear Path Forward. You Leave The Session Knowing Exactly What To Say And, Just As Importantly, What To Stop Saying.'}
            </p>
          </div>

          {/* Bullet points - staggered fade in */}
          <ul className="space-y-2 mb-8 text-xl">
            {(settings.bullets || []).map((item, idx) => (
              <li
                key={idx}
                className={`transition-all duration-700 ease-out ${
                  hasAnimated
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4"
                }`}
                style={{ transitionDelay: `${200 + idx * 100}ms`, color: settings.bullet_color || '#000000' }}
              >
                • {item}
              </li>
            ))}
          </ul>

          {/* Button - fade up with delay */}
          <div
            className={`transition-all duration-700 delay-500 ease-out ${
              hasAnimated
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <button 
              className="text-xl font-medium px-6 py-1.5 rounded-full border border-black shadow-sm hover:opacity-90 transition"
              style={{ 
                backgroundColor: settings.button_background_color || '#FF7A95',
                color: settings.button_text_color || '#000000'
              }}
            >
              {settings.button_text || '£500 / one-off, flat fee'}
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE - fade in with scale */}
        <div
          className={`relative w-full h-[420px] md:h-[520px] transition-all duration-800 delay-300 ease-out ${
            hasAnimated
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95"
          }`}
        >
          <img
            src={settings.image_url || '/people/computer.png'}
            alt={settings.image_alt || 'Messaging audit preview'}
            className="object-cover w-full h-full rounded-3xl shadow-md"
          />
        </div>

      </div>
    </section>
  );
}