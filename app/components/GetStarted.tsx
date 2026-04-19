"use client";

import { useEffect, useState, useRef } from "react";

export default function GetStarted() {
  const sectionRef = useRef<HTMLElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [smoothPos, setSmoothPos] = useState({ x: 0, y: 0 });
  const [isInside, setIsInside] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);

  // CREATE CALENDAR EVENT - Using Google Calendar URL
  const createCalendarEvent = () => {
    // Get current date and time for the event (default to 1 hour from now)
    const startDate = new Date();
    startDate.setHours(startDate.getHours() + 1);
    
    // Set end time to 1 hour after start
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);
    
    // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ format)
    const formatDateForGoogle = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const startTime = formatDateForGoogle(startDate);
    const endTime = formatDateForGoogle(endDate);
    
    // Create the Google Calendar URL
    const url = 
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=Exploratory+Call" +
      `&dates=${startTime}/${endTime}` +
      "&details=Hi,+I'm+reaching+you+from+your+website+and+I'm+interested." +
      "&location=Google+Meet" +
      "&add=bea@gmail.com";
    
    // Open in new window
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
            #f5f3ef 0%,
            #f5f3ef 40%,
            #f5f3ef 100%
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
            width: 80,
            height: 80,
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
          Ready to get{" "}
          <span className="italic font-editorial font-medium">
            started?
          </span>
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
            className="relative bg-black text-white px-8 py-4 rounded-full text-base font-medium transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden group"
            style={{
              transform: `scale(${buttonScale})`,
            }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <span className="relative z-10 flex items-center gap-2">
              Book a call
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