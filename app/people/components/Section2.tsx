"use client";

import { useState, useCallback, useRef, useEffect } from 'react';

interface Episode {
  title: string;
  subtitle: string;
  embedUrl: string;
  episodeNumber: number;
}

export default function Section2() {
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const episodes: Episode[] = [
    {
      episodeNumber: 1,
      title: "Episode 01 — Where It Started:",
      subtitle: "The Origin",
      embedUrl: "https://open.spotify.com/embed/episode/5s5ZBx5isGUg2kActdsuln?utm_source=generator"
    },
    {
      episodeNumber: 2,
      title: "Episode 02 — The Obsession:",
      subtitle: "Why This, Why You",
      embedUrl: "https://open.spotify.com/embed/episode/0987654321?utm_source=generator"
    },
    {
      episodeNumber: 3,
      title: "Episode 03 — The World:",
      subtitle: "What Comes Next",
      embedUrl: "https://open.spotify.com/embed/episode/5555555555?utm_source=generator"
    }
  ];

  // Create infinite loop by adding clones at both ends
  const extendedEpisodes: Episode[] = [
    episodes[episodes.length - 1],
    ...episodes,
    episodes[0]
  ];
  
  const getAdjustedIndex = useCallback((): number => {
    return currentIndex + 1;
  }, [currentIndex]);

  const nextSlide = useCallback((): void => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex: number) => prevIndex + 1);
  }, [isTransitioning]);

  const prevSlide = useCallback((): void => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex: number) => prevIndex - 1);
  }, [isTransitioning]);

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
    if (!hasAnimated) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 8000);

    return () => clearInterval(interval);
  }, [nextSlide, hasAnimated]);

  // Intersection Observer
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

  // ========== MOBILE LAYOUT (Carousel on top, text below) ==========
  if (isMobile) {
    return (
      <section 
        ref={sectionRef}
        className="w-full bg-black text-white py-16 px-4" 
        style={{ fontFamily: 'Helvetica' }}
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
                  {extendedEpisodes.map((episode: Episode, idx: number) => (
                    <div 
                      key={idx} 
                      className="flex-shrink-0 w-full"
                      style={{ width: '100%' }}
                    >
                      <div className="w-full bg-white rounded-xl shadow-2xl overflow-hidden">
                        {/* Episode title header - Smaller */}
                        <div className="p-4 bg-gradient-to-r from-[#1DB954] to-[#191414]">
                          <p className="text-white font-semibold text-xs">
                            Episode {episode.episodeNumber}
                          </p>
                          <p className="text-white text-base font-bold">
                            {episode.title}
                          </p>
                          <p className="text-white/80 text-xs">
                            {episode.subtitle}
                          </p>
                        </div>
                        
                        <div className="pt-2 bg-black"></div>
                        
                        <iframe
                          src={episode.embedUrl}
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

            {/* Navigation buttons - Smaller */}
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
            {/* Origin Series badge */}
            <div
              className={`transition-all duration-700 ease-out ${
                hasAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <p className="text-sm tracking-widest uppercase text-white/70 mb-4">
                Origin Series
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
              <h2 className="text-2xl font-medium text-[#F4D35E] leading-tight mb-4">
                Your Story On Camera. Done Properly.
              </h2>
            </div>

            {/* Description - Condensed */}
            <div
              className={`transition-all duration-700 delay-150 ease-out ${
                hasAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <p className="text-sm text-white/80 mb-4">
                A 3-Part Founder Story Series Scripted And Built For Social. Your
                Origin, Your Why, And Your World. This Is The Kind Of Content That
                Makes People Follow You And Actually Stay.
              </p>
            </div>

            {/* Bullet points - Smaller */}
            <ul className="space-y-1.5 text-white/90 mb-6 text-sm">
              {["Story Extraction And Scripting", "3-Episode Production Brief", "Distribution And Repurposing Guide"].map((item, idx) => (
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
              <button className="text-sm bg-[#F4C400] text-black font-medium px-5 py-1.5 rounded-full border border-white shadow-sm hover:opacity-90 transition">
                From £800 / project-based
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
      className="w-full bg-black text-white py-24" 
      style={{ fontFamily: 'Helvetica' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:gap-12 items-center">
          
          {/* LEFT CONTENT */}
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
            {/* Origin Series badge */}
            <div
              className={`transition-all duration-700 ease-out ${
                hasAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <p className="text-2xl tracking-widest uppercase text-white/70 mb-6">
                Origin Series
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
              <h2 className="text-4xl md:text-5xl font-medium text-[#F4D35E] leading-tight mb-6">
                Your Story On Camera.
                <br />
                Done Properly.
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
              <p className="text-xl text-white/80 max-w-xl mb-6">
                A 3-Part Founder Story Series Scripted And Built For Social. Your
                Origin, Your Why, And Your World. This Is The Kind Of Content That
                Makes People Follow You And Actually Stay — Because It Shows Them
                Who You Are, Not Just What You Sell.
              </p>
            </div>

            {/* Bullet points */}
            <ul className="space-y-2 text-white/90 mb-8 text-xl">
              {["Story Extraction And Scripting", "3-Episode Production Brief", "Distribution And Repurposing Guide"].map((item, idx) => (
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
              <button className="text-xl bg-[#F4C400] text-black font-medium px-6 py-1.5 rounded-full border border-white shadow-sm hover:opacity-90 transition">
                From £800 / project-based
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
                  {extendedEpisodes.map((episode: Episode, idx: number) => (
                    <div 
                      key={idx} 
                      className="flex-shrink-0 w-full transition-transform duration-300 hover:scale-105"
                      style={{ width: '100%' }}
                    >
                      <div className="w-full bg-white rounded-xl shadow-2xl overflow-hidden">
                        <div className="p-5 bg-gradient-to-r from-[#1DB954] to-[#191414]">
                          <p className="text-white font-semibold text-sm">
                            Episode {episode.episodeNumber}
                          </p>
                          <p className="text-white text-lg font-bold">
                            {episode.title}
                          </p>
                          <p className="text-white/80 text-sm">
                            {episode.subtitle}
                          </p>
                        </div>
                        
                        <div className="pt-2 bg-black"></div>
                        
                        <iframe
                          src={episode.embedUrl}
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