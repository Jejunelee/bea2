"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bell, MessageCircle, Heart, Clock, Wifi, Battery, Signal } from 'lucide-react';

export default function Section3() {
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const phoneContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!phoneContainerRef.current) return;
      
      // Get the phone's position on screen
      const phoneRect = phoneContainerRef.current.getBoundingClientRect();
      const phoneCenterX = phoneRect.left + phoneRect.width / 2;
      const phoneCenterY = phoneRect.top + phoneRect.height / 2;
      
      // Calculate cursor position relative to phone center
      const cursorX = e.clientX;
      const cursorY = e.clientY;
      
      // Calculate difference from phone center (in pixels)
      const diffX = cursorX - phoneCenterX;
      const diffY = cursorY - phoneCenterY;
      
      // Convert to rotation angle (max 12 degrees for subtle effect)
      const maxAngle = 12;
      const maxDistance = 400; // Max distance in pixels for full tilt
      
      let rotateY = (diffX / maxDistance) * maxAngle;
      let rotateX = -(diffY / maxDistance) * maxAngle;
      
      // Clamp to max angles
      rotateY = Math.max(Math.min(rotateY, maxAngle), -maxAngle);
      rotateX = Math.max(Math.min(rotateX, maxAngle), -maxAngle);
      
      setRotation({ x: rotateX, y: rotateY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Intersection Observer for scroll animation
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

  return (
    <section 
      ref={sectionRef}
      className="w-full bg-[#E9E7E2] relative overflow-hidden" 
      style={{ fontFamily: 'Helvetica' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-[1.2fr_0.8fr] gap-16 items-start">
  
        {/* LEFT CONTENT */}
        <div className="pt-8">
          {/* Badge */}
          <div
            className={`transition-all duration-700 ease-out ${
              hasAnimated
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <p className="text-2xl tracking-widest uppercase text-black/70 mb-6">
              AI For Marketing Normies
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
            <h2 className="text-4xl md:text-5xl font-medium text-[#6B7F1A] leading-tight mb-6">
              AI Should Make You Sound
              <br />
              More Like Yourself, Not Less.
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
            <p className="text-xl text-black/80 max-w-2xl mb-6">
              Two Entrepreneurs Came To Me Recently Asking Me To Teach Them AI —
              Specifically For Their Business Development And Marketing Processes.
              Not The Overwhelming, Jargon-Heavy Stuff. Just How To Actually Make It
              Work In Their Day-To-Day Without Losing Their Voice In The Process.
              So I Said Yes, And Now It's A Proper Offer.
            </p>
          </div>

          {/* Bullet points */}
          <ul className="space-y-2 text-black/90 mb-8 text-xl">
            {["AI Workflow Audit For Your Specific Business", "Prompting Frameworks Built Around Your Brand Voice", "Tools Stack And Step-By-Step Implementation"].map((item, idx) => (
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
            <button className="text-xl bg-[#A6C437] text-black font-medium px-6 py-1.5 rounded-full border border-black shadow-sm hover:opacity-90 transition">
              From £500 / 1:1 session
            </button>
          </div>
        </div>
  
        {/* RIGHT IPHONE MOCKUP - 3D Tilt following cursor */}
        <div 
          className={`relative flex justify-end transition-all duration-800 delay-300 ease-out ${
            hasAnimated
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-12"
          }`}
          ref={phoneContainerRef}
        >
          <div 
            className="relative -mb-100"
            style={{
              transform: `perspective(5000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              transition: 'transform 0.1s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
              transformStyle: 'preserve-3d'
            }}
          >
            {/* iPhone 15 Pro Mockup */}
            <div className="relative w-[480px] h-[950px]">
              
              {/* Shadow that moves with the tilt */}
              <div className="absolute -inset-10 rounded-full bg-black/20 blur-xl -z-10"
                style={{
                  transform: `translate(${rotation.y * 2}px, ${rotation.x * 2}px)`,
                  transition: 'transform 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1)'
                }}
              ></div>
              
              {/* Physical Buttons - Left Side (Volume) */}
              <div className="absolute -left-[3px] top-[100px] w-[3px] h-8 bg-[#3a3a3c] rounded-l-full z-30"></div>
              <div className="absolute -left-[3px] top-[140px] w-[3px] h-12 bg-[#3a3a3c] rounded-l-full z-30"></div>
              <div className="absolute -left-[3px] top-[200px] w-[3px] h-12 bg-[#3a3a3c] rounded-l-full z-30"></div>
              
              {/* Physical Buttons - Left Side (Action Button) */}
              <div className="absolute -left-[3px] top-[280px] w-[3px] h-10 bg-[#3a3a3c] rounded-l-full z-30"></div>
              
              {/* Physical Buttons - Right Side (Power) */}
              <div className="absolute -right-[3px] top-[140px] w-[3px] h-16 bg-[#3a3a3c] rounded-r-full z-30"></div>
              
              {/* Phone Frame with Titanium finish */}
              <div className="relative w-full h-full bg-[#1c1c1e] rounded-[60px] overflow-hidden shadow-2xl shadow-black/30">
                
                {/* Outer bezel ring */}
                <div className="absolute inset-0 rounded-[60px] border border-white/10 pointer-events-none"></div>
                
                {/* Reflective shine that moves with tilt */}
                <div className="absolute inset-0 rounded-[60px] pointer-events-none overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0"
                    style={{
                      transform: `translate(${rotation.y * 0.3}px, ${rotation.x * 0.3}px)`,
                    }}
                  ></div>
                </div>
                
                {/* True Screen (slightly inset) */}
                <div className="absolute inset-[4px] bg-black rounded-[56px] overflow-hidden">
                  
                  {/* Wallpaper - Covers entire screen */}
                  <div className="absolute inset-0 w-full h-full">
                    <img 
                      src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=1600&fit=crop" 
                      alt="Wallpaper"
                      className="w-full h-full object-cover"
                    />
                    {/* Subtle gradient overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20"></div>
                  </div>
                  
                  {/* Dynamic Island */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[108px] h-[34px] bg-black rounded-b-2xl z-20 flex items-center justify-center">
                    {/* Dynamic Island inner details */}
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#1c1c1e]"></div>
                      <div className="w-10 h-2 rounded-full bg-[#1c1c1e]"></div>
                    </div>
                  </div>
                  
                  {/* Screen Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    
                    {/* Status Bar - iOS style */}
                    <div className="pt-10 px-6 pb-2 flex justify-between text-sm font-semibold text-white">
                      <span className="text-base font-medium">9:41</span>
                      <div className="flex gap-1.5 items-center">
                        <Signal className="w-3.5 h-3.5 text-white" />
                        <Wifi className="w-3.5 h-3.5 text-white" />
                        <Battery className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* Header */}
                    <div className="px-6 pb-4 flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center">
                          <Bell className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-2xl font-semibold text-white">Notifications</h3>
                      </div>
                      <span className="text-sm text-[white] font-medium bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">2 new</span>
                    </div>

                    {/* Notifications List - Black text */}
                    <div className="flex-1 px-6 py-2 space-y-3 overflow-y-auto">
                      
                      {/* Notification 1 */}
                      <div className="group flex gap-3 bg-white/95 backdrop-blur-md rounded-2xl p-3 transition-all hover:bg-white shadow-lg">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#A6C437] to-[#6B7F1A] flex items-center justify-center flex-shrink-0 shadow-lg">
                          <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-black text-sm">Entrepreneur, Manila</span>
                            <span className="text-xs text-gray-500">2 min ago</span>
                          </div>
                          <p className="text-sm text-gray-800 leading-relaxed">
                            "I finally understand how to use AI for my actual business - not just a generic demo."
                          </p>
                        </div>
                      </div>

                      {/* Notification 2 - Unread indicator */}
                      <div className="group flex gap-3 bg-[white] backdrop-blur-md rounded-2xl p-3 border-l-4 border-[#6B7F1A] shadow-lg">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#A6C437] to-[#6B7F1A] flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Heart className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-black text-sm">Founder, London</span>
                              <span className="text-[10px] bg-[#6B7F1A] text-white px-1.5 py-0.5 rounded-full font-semibold">NEW</span>
                            </div>
                            <span className="text-xs text-gray-600">1 hour ago</span>
                          </div>
                          <p className="text-sm text-gray-800 leading-relaxed">
                            "Bea helped me build a content system using AI that still sounds completely like me."
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Home Indicator */}
                    <div className="pb-6 pt-2 flex justify-center">
                      <div className="w-32 h-1 bg-white/30 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                {/* Bottom speaker grills */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-[#3a3a3c]"></div>
                  <div className="w-4 h-1 rounded-full bg-[#3a3a3c]"></div>
                  <div className="w-1 h-1 rounded-full bg-[#3a3a3c]"></div>
                </div>
                
                {/* Camera lens details */}
                <div className="absolute top-2 right-4 w-2 h-2 rounded-full bg-[#3a3a3c]"></div>
              </div>
            </div>
          </div>
        </div>
  
      </div>
    </section>
  );
}