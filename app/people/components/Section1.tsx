"use client";

import { useEffect, useRef, useState } from "react";

export default function Section1() {
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
    if (!currentSection) return;

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
  }, [hasAnimated]);

  // ========== MOBILE LAYOUT (Condensed) ==========
  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        className="w-full bg-[#FFFBE7] py-12"
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
              src="/people/computer.png"
              alt="Messaging audit preview"
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
              <p className="text-sm tracking-widest uppercase text-black mb-4">
                Most Popular | Messaging Audit
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
              <h2 className="text-2xl font-medium text-[#FF7A95] leading-tight mb-4">
                One Session. One Direction. Real Clarity.
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
              <p className="text-base text-black/80 mb-4">
                A Focused 90-Minute Deep Dive Into Your Brand, Your Story Gaps, And One
                Clear Path Forward. You Leave The Session Knowing Exactly What To Say
                And, Just As Importantly, What To Stop Saying.
              </p>
            </div>

            {/* Bullet points */}
            <ul className="space-y-1.5 text-black/90 mb-6 text-sm">
              {["Pre-Session Brand And Content Review", "Live 90-Minute Strategy Session", "Written Brief And Next-Step Roadmap"].map((item, idx) => (
                <li
                  key={idx}
                  className={`transition-all duration-700 ease-out ${
                    hasAnimated
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-4"
                  }`}
                  style={{ transitionDelay: `${200 + idx * 100}ms` }}
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
              <button className="text-sm bg-[#FF7A95] text-black font-medium px-5 py-1.5 rounded-full border border-black shadow-sm hover:opacity-90 transition">
                £500 / one-off, flat fee
              </button>
            </div>
          </div>

        </div>
      </section>
    );
  }

  // ========== DESKTOP LAYOUT (Original) ==========
  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#FFFBE7] py-12"
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
            <p className="text-2xl tracking-widest uppercase text-black mb-6">
              Most Popular | Messaging Audit
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
            <h2 className="text-4xl md:text-5xl font-medium text-[#FF7A95] leading-tight mb-6">
              One Session. One Direction. Real Clarity.
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
            <p className="text-xl text-black/80 mb-6 max-w-xl">
              A Focused 90-Minute Deep Dive Into Your Brand, Your Story Gaps, And One
              Clear Path Forward. You Leave The Session Knowing Exactly What To Say
              And, Just As Importantly, What To Stop Saying.
            </p>
          </div>

          {/* Bullet points - staggered fade in */}
          <ul className="space-y-2 text-black/90 mb-8 text-xl">
            {["Pre-Session Brand And Content Review", "Live 90-Minute Strategy Session", "Written Brief And Next-Step Roadmap"].map((item, idx) => (
              <li
                key={idx}
                className={`transition-all duration-700 ease-out ${
                  hasAnimated
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4"
                }`}
                style={{ transitionDelay: `${200 + idx * 100}ms` }}
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
            <button className="text-xl bg-[#FF7A95] text-black font-medium px-6 py-1.5 rounded-full border border-black shadow-sm hover:opacity-90 transition">
              £500 / one-off, flat fee
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
            src="/people/computer.png"
            alt="Messaging audit preview"
            className="object-cover w-full h-full rounded-3xl shadow-md"
          />
        </div>

      </div>
    </section>
  );
}