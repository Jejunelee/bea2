"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from "@/app/lib/supabase/client";
import type { Section2Settings, Section2Episode } from "@/app/types/peoplesection2";

export default function Section2() {
  const [settings, setSettings] = useState<Partial<Section2Settings>>({});
  const [episodes, setEpisodes] = useState<Section2Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const { data: settingsData } = await supabase
        .from('section2_settings')
        .select('*')
        .eq('id', 1)
        .single();
      if (settingsData) setSettings(settingsData);

      const { data: episodesData } = await supabase
        .from('section2_episodes')
        .select('*')
        .order('display_order', { ascending: true });
      if (episodesData) setEpisodes(episodesData);

      setLoading(false);
    };

    fetchData();
  }, []);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Create infinite loop by adding clones at both ends
  const extendedEpisodes: Section2Episode[] = episodes.length > 0 ? [
    episodes[episodes.length - 1],
    ...episodes,
    episodes[0]
  ] : [];
  
  const getAdjustedIndex = useCallback((): number => {
    return currentIndex + 1;
  }, [currentIndex]);

  const nextSlide = useCallback((): void => {
    if (isTransitioning || episodes.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex: number) => prevIndex + 1);
  }, [isTransitioning, episodes.length]);

  const prevSlide = useCallback((): void => {
    if (isTransitioning || episodes.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex: number) => prevIndex - 1);
  }, [isTransitioning, episodes.length]);

  // Handle infinite loop wrapping
  useEffect(() => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    if (isTransitioning) {
      transitionTimeoutRef.current = setTimeout(() => {
        if (currentIndex >= episodes.length) {
          setIsTransitioning(false);
          setCurrentIndex(0);
        } 
        else if (currentIndex < 0) {
          setIsTransitioning(false);
          setCurrentIndex(episodes.length - 1);
        }
        else {
          setIsTransitioning(false);
        }
        
        transitionTimeoutRef.current = null;
      }, 500);
    }

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [currentIndex, episodes.length, isTransitioning]);

  // Auto-play
  useEffect(() => {
    if (!hasAnimated || episodes.length === 0) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 8000);

    return () => clearInterval(interval);
  }, [nextSlide, hasAnimated, episodes.length]);

  // Intersection Observer
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
    return <div className="w-full py-24" style={{ backgroundColor: '#000000' }}></div>;
  }

  const displayBullets = settings.bullets || [
    "Story Extraction And Scripting",
    "3-Episode Production Brief",
    "Distribution And Repurposing Guide"
  ];

  // ========== MOBILE LAYOUT ==========
  if (isMobile) {
    return (
      <section 
        ref={sectionRef}
        className="w-full py-16 px-4" 
        style={{ 
          backgroundColor: settings.background_color || '#000000',
          fontFamily: 'Helvetica' 
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* CAROUSEL - On top */}
          <div
            className={`w-full transition-all duration-800 delay-300 ease-out mb-10 ${
              hasAnimated
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
          >
            <div className="w-full max-w-[340px] mx-auto">
              <div className="overflow-hidden rounded-xl">
                <div 
                  className="flex transition-transform duration-500 ease-out"
                  style={{ 
                    transform: `translateX(-${getAdjustedIndex() * 100}%)`,
                    transition: isTransitioning ? 'transform 500ms ease-out' : 'none'
                  }}
                >
                  {extendedEpisodes.map((episode: Section2Episode, idx: number) => (
                    <div 
                      key={idx} 
                      className="flex-shrink-0 w-full"
                      style={{ width: '100%' }}
                    >
                      <div className="w-full bg-white rounded-xl shadow-2xl overflow-hidden">
                        <div className="p-4 bg-gradient-to-r from-[#1DB954] to-[#191414]">
                          <p className="text-white font-semibold text-xs">
                            Episode {episode.episode_number}
                          </p>
                          <p className="text-white text-base font-bold">
                            Episode {episode.episode_number} — {episode.title}
                          </p>
                          <p className="text-white/80 text-xs">
                            {episode.subtitle}
                          </p>
                        </div>
                        
                        <div className="pt-2 bg-black"></div>
                        
                        <iframe
                          src={episode.embed_url}
                          width="100%"
                          height="280"
                          frameBorder="0"
                          allowFullScreen
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          loading="lazy"
                          className="w-full bg-black"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3 mt-6 w-full">
              <button 
                onClick={prevSlide}
                disabled={isTransitioning}
                className="bg-black/60 hover:bg-[#F4C400] text-[#F4C400] hover:text-black p-2 rounded-full transition-all duration-300 shadow-lg backdrop-blur-sm border border-[#F4C400]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous slide"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                onClick={nextSlide}
                disabled={isTransitioning}
                className="bg-black/60 hover:bg-[#F4C400] text-[#F4C400] hover:text-black p-2 rounded-full transition-all duration-300 shadow-lg backdrop-blur-sm border border-[#F4C400]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next slide"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* TEXT CONTENT - Below carousel */}
          <div>
            <div
              className={`transition-all duration-700 ease-out ${
                hasAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <p className="text-sm tracking-widest uppercase mb-4" style={{ color: settings.badge_text_color || '#FFFFFF' }}>
                {settings.badge_text || 'Origin Series'}
              </p>
            </div>

            <div
              className={`transition-all duration-700 delay-75 ease-out ${
                hasAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <h2 className="text-2xl font-medium leading-tight mb-4" style={{ color: settings.title_color || '#F4D35E' }}>
                {settings.title_prefix || 'Your Story On Camera.'}
                <br />
                {settings.title_suffix || 'Done Properly.'}
              </h2>
            </div>

            <div
              className={`transition-all duration-700 delay-150 ease-out ${
                hasAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <p className="text-sm mb-4" style={{ color: settings.description_color || '#FFFFFF' }}>
                {settings.description || 'A 3-Part Founder Story Series Scripted And Built For Social. Your Origin, Your Why, And Your World. This Is The Kind Of Content That Makes People Follow You And Actually Stay.'}
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
                  style={{ transitionDelay: `${200 + idx * 100}ms`, color: settings.bullet_color || '#FFFFFF' }}
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
                className="text-sm font-medium px-5 py-1.5 rounded-full border border-white shadow-sm transition"
                style={{ 
                  backgroundColor: settings.button_background_color || '#F4C400',
                  color: settings.button_text_color || '#000000'
                }}
                onMouseEnter={(e) => {
                  if (settings.button_hover_color) {
                    e.currentTarget.style.backgroundColor = settings.button_hover_color;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = settings.button_background_color || '#F4C400';
                }}
              >
                {settings.button_text || 'From £800 / project-based'}
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
      className="w-full py-24" 
      style={{ 
        backgroundColor: settings.background_color || '#000000',
        fontFamily: 'Helvetica' 
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:gap-12 items-center">
          
          {/* LEFT CONTENT */}
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
            <div
              className={`transition-all duration-700 ease-out ${
                hasAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <p className="text-2xl tracking-widest uppercase mb-6" style={{ color: settings.badge_text_color || '#FFFFFF' }}>
                {settings.badge_text || 'Origin Series'}
              </p>
            </div>

            <div
              className={`transition-all duration-700 delay-75 ease-out ${
                hasAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <h2 className="text-4xl md:text-5xl font-medium leading-tight mb-6" style={{ color: settings.title_color || '#F4D35E' }}>
                {settings.title_prefix || 'Your Story On Camera.'}
                <br />
                {settings.title_suffix || 'Done Properly.'}
              </h2>
            </div>

            <div
              className={`transition-all duration-700 delay-150 ease-out ${
                hasAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <p className="text-xl max-w-xl mb-6" style={{ color: settings.description_color || '#FFFFFF' }}>
                {settings.description || 'A 3-Part Founder Story Series Scripted And Built For Social. Your Origin, Your Why, And Your World. This Is The Kind Of Content That Makes People Follow You And Actually Stay — Because It Shows Them Who You Are, Not Just What You Sell.'}
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
                  style={{ transitionDelay: `${200 + idx * 100}ms`, color: settings.bullet_color || '#FFFFFF' }}
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
                className="text-xl font-medium px-6 py-1.5 rounded-full border border-white shadow-sm transition"
                style={{ 
                  backgroundColor: settings.button_background_color || '#F4C400',
                  color: settings.button_text_color || '#000000'
                }}
                onMouseEnter={(e) => {
                  if (settings.button_hover_color) {
                    e.currentTarget.style.backgroundColor = settings.button_hover_color;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = settings.button_background_color || '#F4C400';
                }}
              >
                {settings.button_text || 'From £800 / project-based'}
              </button>
            </div>
          </div>

          {/* RIGHT CAROUSEL */}
          <div
            className={`w-full lg:w-1/2 flex flex-col items-center transition-all duration-800 delay-300 ease-out ${
              hasAnimated
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
          >
            <div className="w-full max-w-[380px] mx-auto">
              <div className="overflow-hidden rounded-2xl">
                <div 
                  className="flex transition-transform duration-500 ease-out"
                  style={{ 
                    transform: `translateX(-${getAdjustedIndex() * 100}%)`,
                    transition: isTransitioning ? 'transform 500ms ease-out' : 'none'
                  }}
                >
                  {extendedEpisodes.map((episode: Section2Episode, idx: number) => (
                    <div 
                      key={idx} 
                      className="flex-shrink-0 w-full transition-transform duration-300 hover:scale-105"
                      style={{ width: '100%' }}
                    >
                      <div className="w-full bg-white rounded-xl shadow-2xl overflow-hidden">
                        <div className="p-5 bg-gradient-to-r from-[#1DB954] to-[#191414]">
                          <p className="text-white font-semibold text-sm">
                            Episode {episode.episode_number}
                          </p>
                          <p className="text-white text-lg font-bold">
                            Episode {episode.episode_number} — {episode.title}
                          </p>
                          <p className="text-white/80 text-sm">
                            {episode.subtitle}
                          </p>
                        </div>
                        
                        <div className="pt-2 bg-black"></div>
                        
                        <iframe
                          src={episode.embed_url}
                          width="100%"
                          height="352"
                          frameBorder="0"
                          allowFullScreen
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          loading="lazy"
                          className="w-full bg-black overflow-hidden"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-8 w-full">
              <button 
                onClick={prevSlide}
                disabled={isTransitioning}
                className="bg-black/60 hover:bg-[#F4C400] text-[#F4C400] hover:text-black p-3 rounded-full transition-all duration-300 shadow-lg backdrop-blur-sm border border-[#F4C400]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous slide"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                onClick={nextSlide}
                disabled={isTransitioning}
                className="bg-black/60 hover:bg-[#F4C400] text-[#F4C400] hover:text-black p-3 rounded-full transition-all duration-300 shadow-lg backdrop-blur-sm border border-[#F4C400]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next slide"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}