"use client";

import React, { useRef, useEffect } from "react";

export default function Hero() {
  const leftPolaroidRef = useRef<HTMLDivElement>(null);
  const rightPolaroidRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // 10x faster movement - max scroll ~500px means they move ~400px
      const speed = 0.8; // 10x faster than before (was 0.08)
      
      // Left polaroid flies right and up toward center
      if (leftPolaroidRef.current) {
        const leftMoveX = Math.min(scrollY * speed, 1000); // Max 300px right
        const leftMoveY = Math.min(scrollY * speed * 0.6, 180); // Max 180px up
        const leftRotate = Math.max(0, 6 - scrollY * 0.03); // Rotate flattens out
        leftPolaroidRef.current.style.transform = `translate(${leftMoveX}px, -${leftMoveY}px) rotate(${leftRotate}deg)`;
        leftPolaroidRef.current.style.zIndex = Math.min(20, Math.floor(scrollY / 20) + 5).toString();
      }
      
      // Right polaroid flies left and up toward center
      if (rightPolaroidRef.current) {
        const rightMoveX = Math.min(scrollY * speed, 1000); // Max 300px left
        const rightMoveY = Math.min(scrollY * speed * 0.6, 180); // Max 180px up
        const rightRotate = Math.max(0, -6 + scrollY * 0.03); // Rotate flattens out
        rightPolaroidRef.current.style.transform = `translate(-${rightMoveX}px, -${rightMoveY}px) rotate(${rightRotate}deg)`;
        rightPolaroidRef.current.style.zIndex = Math.min(20, Math.floor(scrollY / 20) + 5).toString();
      }
      
      // Main content fades out as polaroids take over
      if (contentRef.current) {
        const opacity = Math.max(0, 1 - scrollY * 0.008);
        const scale = Math.max(0.8, 1 - scrollY * 0.002);
        contentRef.current.style.opacity = opacity.toString();
        contentRef.current.style.transform = `scale(${scale})`;
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-visible px-4 sm:px-6 py-12 sm:py-16">
      {/* Left polaroid - flies to center and overlaps */}
      <div 
        ref={leftPolaroidRef}
        className="hidden lg:block absolute left-1 xl:left-4 bottom-40 lg:bottom-48 xl:bottom-60 rotate-[6deg] bg-white p-2 lg:p-2.5 pb-6 lg:pb-8 shadow-2xl rounded-sm transition-transform duration-75 will-change-transform cursor-pointer hover:scale-105 hover:z-30"
        style={{ transform: 'rotate(6deg)', transition: 'transform 0.1s linear' }}
      >
        <img
          src="/1.JPG"
          alt="Person"
          className="w-48 lg:w-56 xl:w-64 h-48 lg:h-56 xl:h-64 object-cover"
        />
        <div className="h-5 lg:h-6"></div>
        <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-mono whitespace-nowrap">✦ bhutan ✦</p>
      </div>

      {/* Right polaroid - flies to center and overlaps */}
      <div 
        ref={rightPolaroidRef}
        className="hidden lg:block absolute right-1 xl:right-2 top-10 lg:top-12 xl:top-14 rotate-[-6deg] bg-white p-2 lg:p-2.5 pb-6 lg:pb-8 shadow-2xl rounded-sm transition-transform duration-75 will-change-transform cursor-pointer hover:scale-105 hover:z-30"
        style={{ transform: 'rotate(-6deg)', transition: 'transform 0.1s linear' }}
      >
        <img
          src="/2.JPG"
          alt="Person"
          className="w-48 lg:w-56 xl:w-64 h-48 lg:h-56 xl:h-64 object-cover"
        />
        <div className="h-5 lg:h-6"></div>
        <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-mono whitespace-nowrap">✦ australia ✦</p>
      </div>

      {/* Main Content - fades as polaroids collide */}
      <div 
        ref={contentRef}
        className="mt-10 relative z-10 w-full max-w-3xl mx-auto text-center px-2 sm:px-4 transition-all duration-75 will-change-transform"
      >
        {/* Name/Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-semibold tracking-tight leading-tight text-black">
          Bea Trinidad · <br className="block sm:hidden" />
          <span className="whitespace-nowrap">Type Harder Studio</span>
        </h1>

        {/* Main message */}
        <h2 className="font-semibold mt-1 sm:mt-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight text-black">
          Story is your{" "}
          <span className="bg-pink-200 px-2 sm:px-3 italic text-black">sharpest</span>{" "}
          business tool.
        </h2>

        {/* Description */}
        <p className="mt-4 sm:mt-5 md:mt-6 text-sm sm:text-base md:text-md text-black leading-relaxed max-w-2xl mx-auto px-4 sm:px-6">
          I'm a communications strategist who helps food businesses and ambitious
          professionals figure out what they actually stand for and say it in a
          way that moves people. 12 years, 4 countries, one obsession: the
          stories that make businesses grow.
        </p>

        {/* Buttons */}
        <div className="mt-6 sm:mt-7 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center">
          <button 
            className="border-2 px-5 sm:px-6 py-2 rounded-full bg-yellow-400 font-medium shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200 active:scale-95 text-sm sm:text-base text-black"
            onClick={() => console.log('Work with me clicked')}
          >
            Work with me
          </button>

          <button 
            className="border-2 px-5 sm:px-6 py-2 rounded-full bg-green-200 font-medium shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200 active:scale-95 text-sm sm:text-base text-black"
            onClick={() => console.log('Read my thinking clicked')}
          >
            Read my thinking
          </button>
        </div>
        {/* Footer text */}
        <p className="mt-10 sm:mt-12 md:mt-40 text-base sm:text-lg md:text-xl text-black leading-relaxed">
          Philippines · UK · Australia · Bhutan
          <br />
          12 years in food communications
        </p>
      </div>
      
    </section>
  );
}