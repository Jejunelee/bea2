"use client";

import { useState, useCallback, useRef, useEffect } from 'react';

interface Episode {
  title: string;
  subtitle: string;
  embedUrl: string;
  episodeNumber: number;
}

export default function Section2() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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
    episodes[episodes.length - 1], // last episode clone at start
    ...episodes,
    episodes[0]  // first episode clone at end
  ];
  
  // Adjust index to account for the clone at the beginning
  const getAdjustedIndex = useCallback((): number => {
    return currentIndex + 1; // +1 because of the clone at index 0
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

  // Handle infinite loop wrapping without visible jumps
  useEffect(() => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    if (isTransitioning) {
      transitionTimeoutRef.current = setTimeout(() => {
        // When we go beyond the last real episode (past the clone)
        if (currentIndex >= episodes.length) {
          // Jump back to the first real episode without animation
          setIsTransitioning(false);
          setCurrentIndex(0);
        } 
        // When we go before the first real episode (into the starting clone)
        else if (currentIndex < 0) {
          // Jump to the last real episode without animation
          setIsTransitioning(false);
          setCurrentIndex(episodes.length - 1);
        }
        else {
          // Normal transition end
          setIsTransitioning(false);
        }
        
        transitionTimeoutRef.current = null;
      }, 500); // Match this with the CSS transition duration
    }

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [currentIndex, episodes.length, isTransitioning]);

  // Auto-play every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 8000);

    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="w-full bg-black text-white py-24" style={{ fontFamily: 'Helvetica' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Stack on mobile, side-by-side on large screens with proper gaps */}
        <div className="flex flex-col lg:flex-row lg:gap-12 items-center">
          
          {/* LEFT CONTENT - takes full width on mobile, half on desktop */}
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
            <p className="text-2xl tracking-widest uppercase text-white/70 mb-6">
              Origin Series
            </p>

            <h2 className="text-4xl md:text-5xl font-medium text-[#F4D35E] leading-tight mb-6">
              Your Story On Camera.
              <br />
              Done Properly.
            </h2>

            <p className="text-xl text-white/80 max-w-xl mb-6">
              A 3-Part Founder Story Series Scripted And Built For Social. Your
              Origin, Your Why, And Your World. This Is The Kind Of Content That
              Makes People Follow You And Actually Stay — Because It Shows Them
              Who You Are, Not Just What You Sell.
            </p>

            <ul className="space-y-2 text-white/90 mb-8 text-xl">
              <li>• Story Extraction And Scripting</li>
              <li>• 3-Episode Production Brief</li>
              <li>• Distribution And Repurposing Guide</li>
            </ul>

            <button className="text-xl bg-[#F4C400] text-black font-medium px-6 py-1.5 rounded-full border border-white shadow-sm hover:opacity-90 transition">
              From £800 / project-based
            </button>
          </div>

          {/* RIGHT CAROUSEL - takes full width on mobile, half on desktop */}
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            {/* Carousel container - shows exactly one episode */}
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
                        {/* Episode title header */}
                        <div className="p-5 bg-gradient-to-r from-[#1DB954] to-[#191414] p-4">
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
                        
                        {/* Small padding between title header and Spotify embed */}
                        <div className="pt-2 bg-black"></div>
                        
                        <iframe
  src={episode.embedUrl}
  width="100%"
  height="352"
  frameBorder="0"
  allowFullScreen
  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
  loading="lazy"
  className="w-full bg-black overflow-hidden"  // ← add rounded + overflow-hidden
/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
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