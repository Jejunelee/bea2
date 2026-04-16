"use client";

import { useEffect, useState, useRef } from "react";

export default function GetStarted() {
  const sectionRef = useRef<HTMLElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [smoothPos, setSmoothPos] = useState({ x: 0, y: 0 });
  const [isInside, setIsInside] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);

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

  // Normalized position (0-1) relative to section
  const percentX = sectionRef.current && smoothPos.x
    ? smoothPos.x / sectionRef.current.offsetWidth
    : 0.5;
  
  const percentY = sectionRef.current && smoothPos.y
    ? smoothPos.y / sectionRef.current.offsetHeight
    : 0.5;

  // Radial gradient follows cursor
  const gradientX = percentX * 100;
  const gradientY = percentY * 100;

  // Button scale effect based on proximity
  const buttonScale = isHoveringButton ? 1.05 : 1;

  // X-ray cursor position
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
            #fafaf9 0%,
            #f5f5f0 40%,
            #e8e8e0 100%
          )
        `,
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-black/20 rounded-full"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 23) % 100}%`,
              transform: `translate(${(percentX - 0.5) * 20 * (i % 3)}px, ${
                (percentY - 0.5) * 20 * (i % 3)
              }px)`,
              transition: "transform 0.3s ease-out",
            }}
          />
        ))}
      </div>

      {/* Subtle moving glow behind button */}
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        style={{
          transform: `translate(${(percentX - 0.5) * 30}px, ${
            (percentY - 0.5) * 30
          }px)`,
        }}
      >
        <div className="w-[500px] h-[500px] bg-amber-200/30 blur-[100px] rounded-full" />
      </div>

      {/* X-ray cursor effect - only outer ring (no black dot) */}
      {isInside && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            left: cursorX,
            top: cursorY,
            width: 200,
            height: 200,
            borderRadius: "50%",
            transform: `translate(-50%, -50%) scale(${1 + percentY * 0.1})`,
            background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,248,225,0.8) 50%, rgba(255,242,204,0.4) 100%)",
            mixBlendMode: "difference",
            boxShadow: "0 0 0 2px rgba(0,0,0,0.1), 0 0 0 6px rgba(255,255,255,0.3)",
            transition: "transform 0.05s linear",
          }}
        />
      )}

      {/* Content - now centered vertically and horizontally */}
      <div className="relative max-w-5xl mx-auto text-center z-10 px-6">
        <h2
          className="text-4xl md:text-6xl font-medium text-black transition-transform duration-300"
          style={{
            transform: `translate(${(percentX - 0.5) * 8}px, ${
              (percentY - 0.5) * 8
            }px)`,
          }}
        >
          Ready to get{" "}
          <span className="italic font-serif bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
            started?
          </span>
        </h2>

        <p
          className="mt-6 text-neutral-600 max-w-md mx-auto"
          style={{
            transform: `translate(${(percentX - 0.5) * 6}px, ${
              (percentY - 0.5) * 6
            }px)`,
          }}
        >
          Let's transform your digital presence. Book a free consultation call.
        </p>

        <div
          className="mt-12"
          style={{
            transform: `translate(${(percentX - 0.5) * 4}px, ${
              (percentY - 0.5) * 4
            }px)`,
          }}
        >
          <button
            onMouseEnter={() => setIsHoveringButton(true)}
            onMouseLeave={() => setIsHoveringButton(false)}
            className="
              relative
              bg-black
              text-white
              px-8
              py-4
              rounded-full
              text-base
              font-medium
              transition-all
              duration-300
              ease-out
              shadow-lg
              hover:shadow-xl
              overflow-hidden
              group
            "
            style={{
              transform: `scale(${buttonScale})`,
            }}
          >
            {/* Button hover effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Button text */}
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

        {/* Trust indicator */}
        <div
          className="mt-16 flex items-center justify-center gap-8 text-xs text-neutral-400"
          style={{
            transform: `translate(${(percentX - 0.5) * 3}px, ${
              (percentY - 0.5) * 3
            }px)`,
          }}
        >
          <span>✨ No obligation</span>
          <span>⚡ 30-min discovery call</span>
          <span>🎯 Strategy focused</span>
        </div>
      </div>
    </section>
  );
}