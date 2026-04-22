"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { GetStartedSettings } from "@/app/types/getstarted";

export default function GetStarted() {
  const [settings, setSettings] = useState<Partial<GetStartedSettings>>({});
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [smoothPos, setSmoothPos] = useState({ x: 0, y: 0 });
  const [isInside, setIsInside] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('get_started_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (data) setSettings(data);
      setLoading(false);
    };

    fetchSettings();
  }, []);

  // CREATE CALENDAR EVENT - Using Google Calendar URL
  const createCalendarEvent = () => {
    const startDate = new Date();
    startDate.setHours(startDate.getHours() + 1);
    
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);
    
    const formatDateForGoogle = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const startTime = formatDateForGoogle(startDate);
    const endTime = formatDateForGoogle(endDate);
    
    const url = 
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      `&text=${encodeURIComponent(settings.calendar_event_title || 'Exploratory Call')}` +
      `&dates=${startTime}/${endTime}` +
      `&details=${encodeURIComponent(settings.calendar_event_details || 'Hi, I\'m reaching you from your website and I\'m interested.')}` +
      `&location=${encodeURIComponent(settings.calendar_event_location || 'Google Meet')}` +
      `&add=${settings.calendar_event_email || 'bea@gmail.com'}`;
    
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Smooth interpolation
  useEffect(() => {
    let raf: number;
    const animate = () => {
      setSmoothPos(prev => ({
        x: prev.x + (pos.x - prev.x) * 0.12,
        y: prev.y + (pos.y - prev.y) * 0.12,
      }));
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, [pos]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();

      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      setIsInside(inside);

      if (!inside) return;

      setPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (loading) {
    return <div className="relative min-h-screen w-full bg-[#f5f3ef]"></div>;
  }

  const percentX =
    sectionRef.current && smoothPos.x
      ? smoothPos.x / sectionRef.current.offsetWidth
      : 0.5;

  const percentY =
    sectionRef.current && smoothPos.y
      ? smoothPos.y / sectionRef.current.offsetHeight
      : 0.5;

  const gradientX = percentX * 100;
  const gradientY = percentY * 100;

  const buttonScale = isHoveringButton ? 1.05 : 1;

  const cursorX = sectionRef.current
    ? sectionRef.current.getBoundingClientRect().left + smoothPos.x
    : 0;

  const cursorY = sectionRef.current
    ? sectionRef.current.getBoundingClientRect().top + smoothPos.y
    : 0;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
      style={{
        cursor: isInside ? "none" : "auto",
        background: `
          radial-gradient(
            circle at ${gradientX}% ${gradientY}%, 
            ${settings.background_color_start || '#f5f3ef'} 0%,
            ${settings.background_color_mid || '#f5f3ef'} 40%,
            ${settings.background_color_end || '#f5f3ef'} 100%
          )
        `,
      }}
    >
      {/* particles */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-black/20 rounded-full"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 23) % 100}%`,
              transform: `translate(${(percentX - 0.5) * 20 * (i % 3)}px,
              ${(percentY - 0.5) * 20 * (i % 3)}px)`,
              transition: "transform 0.3s ease-out",
            }}
          />
        ))}
      </div>

      {/* glow */}
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        style={{
          transform: `translate(${(percentX - 0.5) * 30}px,
          ${(percentY - 0.5) * 30}px)`,
        }}
      >
        <div className="w-[500px] h-[500px] bg-amber-200/30 blur-[100px] rounded-full" />
      </div>

      {/* cursor */}
      {isInside && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            left: cursorX,
            top: cursorY,
            width: 160,
            height: 160,
            borderRadius: "50%",
            transform: `translate(-50%, -50%) scale(${1 + percentY * 0.1})`,
            background:
              "radial-gradient(circle, white 0%, #fff8e1 50%, rgba(255,242,204,0.4) 100%)",
            mixBlendMode: "difference",
            boxShadow:
              "0 0 0 2px rgba(0,0,0,0.1), 0 0 0 6px rgba(255,255,255,0.3)",
          }}
        />
      )}

      {/* content */}
      <div className="relative max-w-5xl mx-auto text-center z-10 px-6">
        <h2
          className="text-3xl md:text-5xl font-medium text-black"
          style={{
            transform: `translate(${(percentX - 0.5) * 8}px,
            ${(percentY - 0.5) * 8}px)`,
          }}
        >
          {settings.title_prefix || 'Ready to get'}{" "}
          <span className="italic font-editorial font-medium">
            {settings.title_italic || 'started?'}
          </span>
          {settings.title_suffix}
        </h2>

        <div
          className="mt-12"
          style={{
            transform: `translate(${(percentX - 0.5) * 4}px,
            ${(percentY - 0.5) * 4}px)`,
          }}
        >
          <button
            onClick={createCalendarEvent}
            onMouseEnter={() => setIsHoveringButton(true)}
            onMouseLeave={() => setIsHoveringButton(false)}
            className="relative rounded-full text-base font-medium transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden group"
            style={{
              backgroundColor: settings.button_background_color || '#000000',
              color: settings.button_text_color || '#FFFFFF',
              transform: `scale(${buttonScale})`,
              padding: '1rem 2rem',
            }}
          >
            <span 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(to right, ${settings.button_hover_color_start || '#d97706'}, ${settings.button_hover_color_end || '#92400e'})`,
              }}
            />

            <span className="relative z-10 flex items-center gap-2">
              {settings.button_text || 'Book a call'}
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}