"use client";

import { useEffect, useState } from "react";

export default function Footer() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ========== MOBILE LAYOUT (Horizontal style) ==========
  if (isMobile) {
    return (
      <footer className="w-full bg-[white] px-4 py-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Top Row: Logo and Picture */}
          <div className="flex justify-between items-center mb-4">
            <img
              src="/Logo.png"
              alt="Type Harder"
              className="w-[120px]"
            />
            <img
              src="/1.JPG"
              alt="Radial decoration"
              className="w-14 h-14 rounded-full object-cover"
            />
          </div>

          {/* Location */}
          <div className="mb-4">
            <p className="text-xs text-black tracking-wide">
              Manila · London · Type Harder Studio 2026
            </p>
          </div>
          
          {/* Social Links - Horizontal */}
          <div className="flex flex-wrap justify-center gap-4 text-black text-xs">
            <a
              href="https://onyourplate.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:opacity-70 transition"
            >
              Substack
            </a>

            <a
              href="https://instagram.com/beatrinidad"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:opacity-70 transition"
            >
              Instagram
            </a>

            <a
              href="#"
              className="underline underline-offset-4 hover:opacity-70 transition"
            >
              LinkedIn
            </a>

            <a
              href="#"
              className="underline underline-offset-4 hover:opacity-70 transition"
            >
              Book a call
            </a>
          </div>
        </div>
      </footer>
    );
  }

  // ========== DESKTOP LAYOUT (Original) ==========
  return (
    <footer className="w-full bg-[#ffc5d1] px-6 md:px-16 py-14">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">

        {/* Left */}
        <div className="flex flex-col gap-4">
          <img
            src="/Logo.png"
            alt="Type Harder"
            className="w-[170px] md:w-[200px]"
          />

          <p className="text-sm md:text-base text-black tracking-wide">
            Manila · London · Type Harder Studio 2026
          </p>
        </div>

        {/* Right - Container for radial image and links */}
        <div className="flex flex-col md:flex-row items-start gap-6">
          
          {/* Radial Image */}
          <img
            src="/1.JPG"
            alt="Radial decoration"
            className="w-24 h-24 md:w-32 md:h-32 rounded-full mt-2 object-cover flex-shrink-0"
          />
          
          {/* Links - Now aligned left */}
          <div className="flex flex-col items-start gap-3 text-black text-sm md:text-base">
            <a
              href="https://onyourplate.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:opacity-70 transition"
            >
              onyourplate.substack.com
            </a>

            <a
              href="https://instagram.com/beatrinidad"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:opacity-70 transition"
            >
              @beatrinidad
            </a>

            <a
              href="#"
              className="underline underline-offset-4 hover:opacity-70 transition"
            >
              LinkedIn
            </a>

            <a
              href="#"
              className="underline underline-offset-4 hover:opacity-70 transition"
            >
              Book a call
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}