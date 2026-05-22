// app/fractional/page.tsx
"use client";

import { useEffect, useState } from "react";
import Header from '@/app/components/Header';
import { supabase } from "@/app/lib/supabase/client";
import type { FractionalHeroSettings } from "@/app/types/FractionalCommunication/Header";

export default function FractionalHero() {
  const [settings, setSettings] = useState<Partial<FractionalHeroSettings>>({});
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('fractional_hero_settings')
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

  // UPDATED: Direct link to Google Calendar appointment page
  const createCalendarEvent = () => {
    window.open("https://calendar.app.google/kZ2VsHYE7Nz9WFZ77", "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return <div className="relative w-full min-h-screen bg-white"></div>;
  }

  // ========== MOBILE LAYOUT ==========
  if (isMobile) {
    return (
      <section className="relative w-full min-h-screen py-12 px-4 flex flex-col items-center justify-center overflow-hidden font-helvetica">
        <Header />
        
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at center, #ffffff 0%, #ffffff 25%, #fdf4e3 50%, #f0e0c4 75%, #e8c8a0 100%)`,
          }}
        />

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-[200px] h-[200px] bg-[#f0d5a8]/40 blur-[100px] rounded-full" />
          <div className="absolute bottom-[10%] right-[15%] w-[250px] h-[250px] bg-[#e8b88a]/40 blur-[100px] rounded-full" />
          <div className="absolute top-[60%] left-[30%] w-[180px] h-[180px] bg-[#fdf4e3]/50 blur-[80px] rounded-full" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div 
            className="w-[400px] h-[400px] blur-[100px] rounded-full"
            style={{ backgroundColor: '#f0c090', opacity: 0.35 }}
          />
        </div>
        
        <div className="relative z-10 w-full px-4 text-center">
          {/* Headline: font-editorial italic only, no bold */}
          <h1 
            className="opacity-0 animate-fade-in-up text-2xl md:text-3xl text-black leading-tight"
            style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
          >
            Senior Brand & Comms Director <span className="font-editorial italic">embedded</span> in your business, without the full-time hire.
          </h1>

          {/* Description: bold/semibold only, no font-editorial */}
          <p 
            className="opacity-0 animate-fade-in-up text-base text-black leading-relaxed mt-6 px-2"
            style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
          >
            Fractional Comms is a quarterly retainer for food-forward founders who've outgrown DIY communications and need an experienced partner to lead strategy, manage messaging, content, partnerships, and launches while pulling in specialists when needed.
          </p>

          <div 
            className="opacity-0 animate-fade-in-up mt-8"
            style={{ animationDelay: "1.2s", animationFillMode: "forwards" }}
          >
            <button
              onClick={createCalendarEvent}
              className="group relative rounded-full bg-black text-white text-base font-medium px-6 py-2.5 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Book a call
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
        `}</style>
      </section>
    );
  }

  // ========== DESKTOP LAYOUT ==========
  return (
    <section className="relative w-full min-h-screen py-20 px-4 sm:px-8 lg:px-12 flex flex-col items-center justify-center overflow-hidden font-helvetica">
      <Header />
      
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, #ffffff 0%, #ffffff 25%, #fdf4e3 50%, #f0e0c4 75%, #e8c8a0 100%)`,
        }}
      />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[15%] left-[5%] w-[300px] h-[300px] bg-[#f0d5a8]/35 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] bg-[#e8b88a]/35 blur-[120px] rounded-full" />
        <div className="absolute top-[50%] left-[70%] w-[250px] h-[250px] bg-[#fdf4e3]/40 blur-[100px] rounded-full" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="w-[700px] h-[700px] blur-[140px] rounded-full"
          style={{ backgroundColor: '#f0c090', opacity: 0.3 }}
        />
      </div>
      
      <div className="relative z-10 w-full max-w-5xl px-6 md:px-8 lg:px-12 text-center">
        {/* Headline: font-editorial italic only, no bold */}
        <h1 
          className="opacity-0 animate-fade-in-up text-4xl md:text-5xl lg:text-5xl text-black leading-tight font-medium"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          Senior Brand & Comms Director <span className="font-editorial italic">embedded</span> in your business, without the full-time hire.
        </h1>

        {/* Description: bold/semibold only, no font-editorial */}
        <p 
          className="opacity-0 animate-fade-in-up text-base md:text-lg lg:text-xl text-black leading-relaxed mt-8 max-w-4xl mx-auto"
          style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
        >
          Fractional Comms is a quarterly retainer for food-forward founders who've outgrown DIY communications and need an experienced partner to lead strategy, manage messaging, content, partnerships, and launches while pulling in specialists when needed.
        </p>

        <div 
          className="opacity-0 animate-fade-in-up mt-10"
          style={{ animationDelay: "1.2s", animationFillMode: "forwards" }}
        >
          <button
            onClick={createCalendarEvent}
            className="group relative rounded-full bg-black text-white text-base md:text-lg lg:text-xl font-medium px-8 py-3 lg:px-10 lg:py-4 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Book a call
              <svg
                className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </section>
  );
}