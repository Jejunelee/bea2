"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bell, MessageCircle, Heart, Clock, Wifi, Battery, Signal } from 'lucide-react';
import { supabase } from "@/app/lib/supabase/client";
import type { Section3Settings } from "@/app/types/peoplesection3";

// Helper component to render the appropriate icon
const IconRenderer = ({ iconName, className }: { iconName: string; className: string }) => {
  switch (iconName) {
    case 'MessageCircle':
      return <MessageCircle className={className} />;
    case 'Heart':
      return <Heart className={className} />;
    case 'Bell':
      return <Bell className={className} />;
    default:
      return <MessageCircle className={className} />;
  }
};

export default function Section3() {
  const [settings, setSettings] = useState<Partial<Section3Settings>>({});
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const phoneContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('section3_settings')
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

  // 3D Tilt effect for desktop
  useEffect(() => {
    if (isMobile || loading) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!phoneContainerRef.current) return;
      
      const phoneRect = phoneContainerRef.current.getBoundingClientRect();
      const phoneCenterX = phoneRect.left + phoneRect.width / 2;
      const phoneCenterY = phoneRect.top + phoneRect.height / 2;
      
      const diffX = e.clientX - phoneCenterX;
      const diffY = e.clientY - phoneCenterY;
      
      const maxAngle = 12;
      const maxDistance = 400;
      
      let rotateY = (diffX / maxDistance) * maxAngle;
      let rotateX = -(diffY / maxDistance) * maxAngle;
      
      rotateY = Math.max(Math.min(rotateY, maxAngle), -maxAngle);
      rotateX = Math.max(Math.min(rotateX, maxAngle), -maxAngle);
      
      setRotation({ x: rotateX, y: rotateY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile, loading]);

  if (loading) {
    return <div className="w-full py-24" style={{ backgroundColor: '#E9E7E2' }}></div>;
  }

  const displayBullets = settings.bullets || [
    "AI Workflow Audit For Your Specific Business",
    "Prompting Frameworks Built Around Your Brand Voice",
    "Tools Stack And Step-By-Step Implementation"
  ];

  // ========== MOBILE LAYOUT ==========
  if (isMobile) {
    return (
      <section 
        ref={sectionRef}
        className="w-full relative overflow-hidden py-12 px-4" 
        style={{ 
          backgroundColor: settings.background_color || '#E9E7E2',
          fontFamily: 'Helvetica' 
        }}
      >
        <div className="max-w-7xl mx-auto">
          
          {/* IPHONE MOCKUP */}
          <div
            className={`relative flex justify-center mb-10 transition-all duration-800 delay-300 ease-out ${
              hasAnimated
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
          >
            <div className="relative w-[280px] h-[560px]">
              <div className="absolute -left-[2px] top-[60px] w-[2px] h-5 bg-[#3a3a3c] rounded-l-full z-30"></div>
              <div className="absolute -left-[2px] top-[85px] w-[2px] h-8 bg-[#3a3a3c] rounded-l-full z-30"></div>
              <div className="absolute -left-[2px] top-[120px] w-[2px] h-8 bg-[#3a3a3c] rounded-l-full z-30"></div>
              <div className="absolute -left-[2px] top-[170px] w-[2px] h-6 bg-[#3a3a3c] rounded-l-full z-30"></div>
              <div className="absolute -right-[2px] top-[85px] w-[2px] h-10 bg-[#3a3a3c] rounded-r-full z-30"></div>
              
              <div className="relative w-full h-full bg-[#1c1c1e] rounded-[40px] overflow-hidden shadow-2xl shadow-black/30">
                <div className="absolute inset-0 rounded-[40px] border border-white/10 pointer-events-none"></div>
                <div className="absolute inset-[3px] bg-black rounded-[36px] overflow-hidden">
                  <div className="absolute inset-0 w-full h-full">
                    <img 
                      src={settings.phone_wallpaper_url || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=1600&fit=crop"} 
                      alt="Wallpaper"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20"></div>
                  </div>
                  
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[80px] h-[28px] bg-black rounded-b-xl z-20 flex items-center justify-center">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1c1c1e]"></div>
                      <div className="w-8 h-1.5 rounded-full bg-[#1c1c1e]"></div>
                    </div>
                  </div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="pt-8 px-4 pb-2 flex justify-between text-xs font-semibold text-white">
                      <span className="text-sm font-medium">9:41</span>
                      <div className="flex gap-1 items-center">
                        <Signal className="w-3 h-3 text-white" />
                        <Wifi className="w-3 h-3 text-white" />
                        <Battery className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div className="px-4 pb-3 flex items-center justify-between mt-1">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center">
                          <Bell className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Notifications</h3>
                      </div>
                      <span className="text-xs text-white font-medium bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full">2 new</span>
                    </div>

                    <div className="flex-1 px-4 py-2 space-y-2 overflow-y-auto">
                      <div className="group flex gap-2 bg-white/95 backdrop-blur-md rounded-xl p-2 shadow-lg">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A6C437] to-[#6B7F1A] flex items-center justify-center flex-shrink-0 shadow-lg">
                          <IconRenderer iconName={settings.phone_notification1_icon || 'MessageCircle'} className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-semibold text-black text-xs">{settings.phone_notification1_name || 'Entrepreneur, Manila'}</span>
                            <span className="text-[10px] text-gray-500">{settings.phone_notification1_time || '2 min ago'}</span>
                          </div>
                          <p className="text-[11px] text-gray-800 leading-relaxed">
                            {settings.phone_notification1_message || '"I finally understand how to use AI for my actual business - not just a generic demo."'}
                          </p>
                        </div>
                      </div>

                      <div className="group flex gap-2 bg-white backdrop-blur-md rounded-xl p-2 border-l-2 border-[#6B7F1A] shadow-lg">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A6C437] to-[#6B7F1A] flex items-center justify-center flex-shrink-0 shadow-lg">
                          <IconRenderer iconName={settings.phone_notification2_icon || 'Heart'} className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-0.5">
                            <div className="flex items-center gap-1">
                              <span className="font-semibold text-black text-xs">{settings.phone_notification2_name || 'Founder, London'}</span>
                              {settings.phone_notification2_badge && (
                                <span className="text-[8px] bg-[#6B7F1A] text-white px-1 py-0.5 rounded-full font-semibold">{settings.phone_notification2_badge}</span>
                              )}
                            </div>
                            <span className="text-[10px] text-gray-600">{settings.phone_notification2_time || '1 hour ago'}</span>
                          </div>
                          <p className="text-[11px] text-gray-800 leading-relaxed">
                            {settings.phone_notification2_message || '"Bea helped me build a content system using AI that still sounds completely like me."'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pb-4 pt-1 flex justify-center">
                      <div className="w-24 h-1 bg-white/30 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 flex gap-1">
                  <div className="w-0.5 h-0.5 rounded-full bg-[#3a3a3c]"></div>
                  <div className="w-3 h-0.5 rounded-full bg-[#3a3a3c]"></div>
                  <div className="w-0.5 h-0.5 rounded-full bg-[#3a3a3c]"></div>
                </div>
                <div className="absolute top-1.5 right-3 w-1.5 h-1.5 rounded-full bg-[#3a3a3c]"></div>
              </div>
            </div>
          </div>

          {/* TEXT CONTENT */}
          <div>
            <div
              className={`transition-all duration-700 ease-out ${
                hasAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <p className="text-sm tracking-widest uppercase mb-4" style={{ color: settings.badge_text_color || '#000000' }}>
                {settings.badge_text || 'AI For Marketing Normies'}
              </p>
            </div>

            <div
              className={`transition-all duration-700 delay-75 ease-out ${
                hasAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <h2 className="text-2xl font-medium leading-tight mb-4" style={{ color: settings.title_color || '#6B7F1A' }}>
                {settings.title_prefix || 'AI Should Make You Sound More Like Yourself,'}
                <br />
                {settings.title_suffix || 'Not Less.'}
              </h2>
            </div>

            <div
              className={`transition-all duration-700 delay-150 ease-out ${
                hasAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <p className="text-sm mb-4" style={{ color: settings.description_color || '#000000' }}>
                {settings.description || 'Two Entrepreneurs Came To Me Recently Asking Me To Teach Them AI — Specifically For Their Business Development And Marketing Processes. Not The Overwhelming, Jargon-Heavy Stuff. Just How To Actually Make It Work In Their Day-To-Day Without Losing Their Voice.'}
              </p>
            </div>

            <ul className="space-y-1.5 mb-6 text-sm">
              {displayBullets.map((item, idx) => (
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

            <div
              className={`transition-all duration-700 delay-500 ease-out ${
                hasAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <button 
                className="text-sm font-medium px-5 py-1.5 rounded-full border border-black shadow-sm transition"
                style={{ 
                  backgroundColor: settings.button_background_color || '#A6C437',
                  color: settings.button_text_color || '#000000'
                }}
                onMouseEnter={(e) => {
                  if (settings.button_hover_color) {
                    e.currentTarget.style.backgroundColor = settings.button_hover_color;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = settings.button_background_color || '#A6C437';
                }}
              >
                {settings.button_text || 'From £500 / 1:1 session'}
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
      className="w-full relative overflow-hidden" 
      style={{ 
        backgroundColor: settings.background_color || '#E9E7E2',
        fontFamily: 'Helvetica' 
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-[1.2fr_0.8fr] gap-16 items-start">
  
        {/* LEFT CONTENT */}
        <div className="pt-8">
          <div
            className={`transition-all duration-700 ease-out ${
              hasAnimated
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <p className="text-2xl tracking-widest uppercase mb-6" style={{ color: settings.badge_text_color || '#000000' }}>
              {settings.badge_text || 'AI For Marketing Normies'}
            </p>
          </div>

          <div
            className={`transition-all duration-700 delay-75 ease-out ${
              hasAnimated
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-medium leading-tight mb-6" style={{ color: settings.title_color || '#6B7F1A' }}>
              {settings.title_prefix || 'AI Should Make You Sound More Like Yourself,'}
              <br />
              {settings.title_suffix || 'Not Less.'}
            </h2>
          </div>

          <div
            className={`transition-all duration-700 delay-150 ease-out ${
              hasAnimated
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
              }`}
          >
            <p className="text-xl text-black/80 max-w-2xl mb-6" style={{ color: settings.description_color || '#000000' }}>
              {settings.description || 'Two Entrepreneurs Came To Me Recently Asking Me To Teach Them AI — Specifically For Their Business Development And Marketing Processes. Not The Overwhelming, Jargon-Heavy Stuff. Just How To Actually Make It Work In Their Day-To-Day Without Losing Their Voice In The Process. So I Said Yes, And Now It\'s A Proper Offer.'}
            </p>
          </div>

          <ul className="space-y-2 mb-8 text-xl">
            {displayBullets.map((item, idx) => (
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

          <div
            className={`transition-all duration-700 delay-500 ease-out ${
              hasAnimated
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
              }`}
          >
            <button 
              className="text-xl font-medium px-6 py-1.5 rounded-full border border-black shadow-sm transition"
              style={{ 
                backgroundColor: settings.button_background_color || '#A6C437',
                color: settings.button_text_color || '#000000'
              }}
              onMouseEnter={(e) => {
                if (settings.button_hover_color) {
                  e.currentTarget.style.backgroundColor = settings.button_hover_color;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = settings.button_background_color || '#A6C437';
              }}
            >
              {settings.button_text || 'From £500 / 1:1 session'}
            </button>
          </div>
        </div>
  
        {/* RIGHT IPHONE MOCKUP - 3D Tilt */}
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
            <div className="relative w-[480px] h-[950px]">
              
              <div className="absolute -inset-10 rounded-full bg-black/20 blur-xl -z-10"
                style={{
                  transform: `translate(${rotation.y * 2}px, ${rotation.x * 2}px)`,
                  transition: 'transform 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1)'
                }}
              ></div>
              
              <div className="absolute -left-[3px] top-[100px] w-[3px] h-8 bg-[#3a3a3c] rounded-l-full z-30"></div>
              <div className="absolute -left-[3px] top-[140px] w-[3px] h-12 bg-[#3a3a3c] rounded-l-full z-30"></div>
              <div className="absolute -left-[3px] top-[200px] w-[3px] h-12 bg-[#3a3a3c] rounded-l-full z-30"></div>
              <div className="absolute -left-[3px] top-[280px] w-[3px] h-10 bg-[#3a3a3c] rounded-l-full z-30"></div>
              <div className="absolute -right-[3px] top-[140px] w-[3px] h-16 bg-[#3a3a3c] rounded-r-full z-30"></div>
              
              <div className="relative w-full h-full bg-[#1c1c1e] rounded-[60px] overflow-hidden shadow-2xl shadow-black/30">
                
                <div className="absolute inset-0 rounded-[60px] border border-white/10 pointer-events-none"></div>
                
                <div className="absolute inset-0 rounded-[60px] pointer-events-none overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0"
                    style={{
                      transform: `translate(${rotation.y * 0.3}px, ${rotation.x * 0.3}px)`,
                    }}
                  ></div>
                </div>
                
                <div className="absolute inset-[4px] bg-black rounded-[56px] overflow-hidden">
                  
                  <div className="absolute inset-0 w-full h-full">
                    <img 
                      src={settings.phone_wallpaper_url || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=1600&fit=crop"} 
                      alt="Wallpaper"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20"></div>
                  </div>
                  
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[108px] h-[34px] bg-black rounded-b-2xl z-20 flex items-center justify-center">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#1c1c1e]"></div>
                      <div className="w-10 h-2 rounded-full bg-[#1c1c1e]"></div>
                    </div>
                  </div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    
                    <div className="pt-10 px-6 pb-2 flex justify-between text-sm font-semibold text-white">
                      <span className="text-base font-medium">9:41</span>
                      <div className="flex gap-1.5 items-center">
                        <Signal className="w-3.5 h-3.5 text-white" />
                        <Wifi className="w-3.5 h-3.5 text-white" />
                        <Battery className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    <div className="px-6 pb-4 flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center">
                          <Bell className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-2xl font-semibold text-white">Notifications</h3>
                      </div>
                      <span className="text-sm text-white font-medium bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">2 new</span>
                    </div>

                    <div className="flex-1 px-6 py-2 space-y-3 overflow-y-auto">
                      
                      <div className="group flex gap-3 bg-white/95 backdrop-blur-md rounded-2xl p-3 transition-all hover:bg-white shadow-lg">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#A6C437] to-[#6B7F1A] flex items-center justify-center flex-shrink-0 shadow-lg">
                          <IconRenderer iconName={settings.phone_notification1_icon || 'MessageCircle'} className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-black text-sm">{settings.phone_notification1_name || 'Entrepreneur, Manila'}</span>
                            <span className="text-xs text-gray-500">{settings.phone_notification1_time || '2 min ago'}</span>
                          </div>
                          <p className="text-sm text-gray-800 leading-relaxed">
                            {settings.phone_notification1_message || '"I finally understand how to use AI for my actual business - not just a generic demo."'}
                          </p>
                        </div>
                      </div>

                      <div className="group flex gap-3 bg-white backdrop-blur-md rounded-2xl p-3 border-l-4 border-[#6B7F1A] shadow-lg">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#A6C437] to-[#6B7F1A] flex items-center justify-center flex-shrink-0 shadow-lg">
                          <IconRenderer iconName={settings.phone_notification2_icon || 'Heart'} className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-black text-sm">{settings.phone_notification2_name || 'Founder, London'}</span>
                              {settings.phone_notification2_badge && (
                                <span className="text-[10px] bg-[#6B7F1A] text-white px-1.5 py-0.5 rounded-full font-semibold">{settings.phone_notification2_badge}</span>
                              )}
                            </div>
                            <span className="text-xs text-gray-600">{settings.phone_notification2_time || '1 hour ago'}</span>
                          </div>
                          <p className="text-sm text-gray-800 leading-relaxed">
                            {settings.phone_notification2_message || '"Bea helped me build a content system using AI that still sounds completely like me."'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pb-6 pt-2 flex justify-center">
                      <div className="w-32 h-1 bg-white/30 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-[#3a3a3c]"></div>
                  <div className="w-4 h-1 rounded-full bg-[#3a3a3c]"></div>
                  <div className="w-1 h-1 rounded-full bg-[#3a3a3c]"></div>
                </div>
                <div className="absolute top-2 right-4 w-2 h-2 rounded-full bg-[#3a3a3c]"></div>
              </div>
            </div>
          </div>
        </div>
  
      </div>
    </section>
  );
}