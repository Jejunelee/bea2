"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Header2() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDarkBackground, setIsDarkBackground] = useState(false);
  const pathname = usePathname();
  
  // Check if we're on the homepage
  const isHomepage = pathname === "/";

  // Handle scroll effect and check background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      
      // Check background color of the section the header is currently over
      const header = document.querySelector('nav');
      if (header) {
        // Get the element directly below the header (what the header is overlapping)
        const headerRect = header.getBoundingClientRect();
        const centerX = headerRect.left + headerRect.width / 2;
        const centerY = headerRect.bottom + 10; // Just below the header
        
        const elementAtPoint = document.elementFromPoint(centerX, centerY);
        if (elementAtPoint) {
          // Find the nearest section or div with background
          let currentElement: Element | null = elementAtPoint;
          let bgColor = null;
          
          while (currentElement && currentElement !== document.body) {
            const bg = window.getComputedStyle(currentElement as Element).backgroundColor;
            if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
              bgColor = bg;
              break;
            }
            currentElement = currentElement.parentElement;
          }
          
          if (bgColor) {
            const rgb = bgColor.match(/\d+/g);
            if (rgb) {
              const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
              setIsDarkBackground(brightness < 128);
            }
          }
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    // Call once on mount to set initial state
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on resize if screen becomes desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Background Image - ONLY on homepage */}
      {isHomepage && (
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/BG/MainBG.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}

      <nav className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${
        scrolled ? "py-3" : "py-0"
      }`}>
        {/* Island container - appears on scroll */}
        <div className={`transition-all duration-500 ease-out ${
          scrolled 
            ? "max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8" 
            : "px-0"
        }`}>
          <div className={`transition-all duration-500 ease-out ${
            scrolled 
              ? "bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20" 
              : "bg-transparent"
          }`}>
            <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
              
              {/* Logo - Responsive sizing with link to homepage */}
              <Link href="/" className="flex items-center shrink-0 cursor-pointer">
                <img 
                  src="/Logo.png" 
                  alt="Logo" 
                  className="h-8 sm:h-10 md:h-12 w-auto transition-all duration-200"
                />
              </Link>

              {/* Desktop Navigation - Hidden on mobile/tablet */}
              <div className="hidden md:flex items-center gap-6 lg:gap-10">
                <div className="flex items-center gap-6 lg:gap-10">
                  <a 
                    href="brands" 
                    className={`${
                      isDarkBackground 
                        ? "text-white hover:text-gray-200" 
                        : "text-gray-800 hover:text-black"
                    } text-base lg:text-lg font-medium transition-all duration-200 hover:scale-105`}
                  >
                    For Brands
                  </a>
                  <a 
                    href="people" 
                    className={`${
                      isDarkBackground 
                        ? "text-white hover:text-gray-200" 
                        : "text-gray-800 hover:text-black"
                    } text-base lg:text-lg font-medium transition-all duration-200 hover:scale-105`}
                  >
                    For Individuals
                  </a>
                  <a 
                    href="work" 
                    className={`${
                      isDarkBackground 
                        ? "text-white hover:text-gray-200" 
                        : "text-gray-800 hover:text-black"
                    } text-base lg:text-lg font-medium transition-all duration-200 hover:scale-105 whitespace-nowrap`}
                  >
                    For Work
                  </a>
                </div>
              </div>

              {/* CTA Button - Responsive sizing */}
              <button className={`${
                isDarkBackground && !scrolled
                  ? "bg-white text-black hover:bg-gray-100" 
                  : "bg-black text-white hover:bg-gray-800"
              } text-xs sm:text-sm md:text-base px-4 sm:px-5 py-1.5 sm:py-2 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 font-medium`}>
                Start Here →
              </button>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`md:hidden flex flex-col gap-1.5 p-2 rounded-lg transition-colors shrink-0 ${
                  isDarkBackground ? "hover:bg-white/10" : "hover:bg-gray-100"
                }`}
                aria-label="Toggle menu"
              >
                <span className={`w-6 h-0.5 transition-all duration-300 ${
                  isDarkBackground ? "bg-white" : "bg-black"
                } ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
                <span className={`w-6 h-0.5 transition-all duration-300 ${
                  isDarkBackground ? "bg-white" : "bg-black"
                } ${isMenuOpen ? "opacity-0" : ""}`}></span>
                <span className={`w-6 h-0.5 transition-all duration-300 ${
                  isDarkBackground ? "bg-white" : "bg-black"
                } ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black/50 z-40 transition-all duration-300 md:hidden ${
        isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`} onClick={() => setIsMenuOpen(false)} />

      {/* Mobile Menu Panel */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-80 z-50 shadow-2xl transition-transform duration-300 transform md:hidden ${
        isDarkBackground ? "bg-gray-900" : "bg-white"
      } ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col pt-20 px-6 gap-4">
          {/* Mobile Logo with link */}
          <Link href="/" className={`pb-4 mb-2 border-b block ${
            isDarkBackground ? "border-gray-700" : "border-gray-100"
          }`} onClick={() => setIsMenuOpen(false)}>
            <img 
              src="/Logo.png" 
              alt="Logo" 
              className="h-10 w-auto"
            />
          </Link>
          
          {/* Mobile Navigation Links - Larger touch targets */}
          <a 
            href="brands" 
            className={`${
              isDarkBackground 
                ? "text-white hover:bg-gray-800" 
                : "text-gray-800 hover:bg-gray-50 hover:text-black"
            } text-xl font-medium py-3 px-2 rounded-lg transition-all`}
            onClick={() => setIsMenuOpen(false)}
          >
            For Brands
          </a>
          <a 
            href="people" 
            className={`${
              isDarkBackground 
                ? "text-white hover:bg-gray-800" 
                : "text-gray-800 hover:bg-gray-50 hover:text-black"
            } text-xl font-medium py-3 px-2 rounded-lg transition-all`}
            onClick={() => setIsMenuOpen(false)}
          >
            For Individuals
          </a>
          <a 
            href="work" 
            className={`${
              isDarkBackground 
                ? "text-white hover:bg-gray-800" 
                : "text-gray-800 hover:bg-gray-50 hover:text-black"
            } text-xl font-medium py-3 px-2 rounded-lg transition-all`}
            onClick={() => setIsMenuOpen(false)}
          >
            For Work
          </a>

          {/* Mobile CTA */}
          <div className={`pt-6 mt-4 border-t ${
            isDarkBackground ? "border-gray-700" : "border-gray-100"
          }`}>
            <button className={`w-full ${
              isDarkBackground 
                ? "bg-white text-black hover:bg-gray-100" 
                : "bg-black text-white hover:bg-gray-800"
            } text-base px-6 py-3 rounded-full transition-all font-medium`}>
              Start Here →
            </button>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-14 sm:h-16 md:h-20"></div>
    </>
  );
}