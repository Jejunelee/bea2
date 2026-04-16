"use client";

import React, { useState, useEffect } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
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
      {/* Background Image - NOW SCROLLS WITH PAGE (not fixed) */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/BG/MainBG.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

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
              
              {/* Logo - Responsive sizing */}
              <div className="flex items-center shrink-0">
                <img 
                  src="/Logo.png" 
                  alt="Logo" 
                  className="h-8 sm:h-10 md:h-12 w-auto transition-all duration-200"
                />
              </div>

              {/* Desktop Navigation - Hidden on mobile/tablet */}
              <div className="hidden md:flex items-center gap-6 lg:gap-10">
                <div className="flex items-center gap-6 lg:gap-10">
                  <a 
                    href="#" 
                    className="text-gray-800 hover:text-black text-base lg:text-lg font-medium transition-all duration-200 hover:scale-105"
                  >
                    For Brands
                  </a>
                  <a 
                    href="#" 
                    className="text-gray-800 hover:text-black text-base lg:text-lg font-medium transition-all duration-200 hover:scale-105"
                  >
                    For Individuals
                  </a>
                  <a 
                    href="#" 
                    className="text-gray-800 hover:text-black text-base lg:text-lg font-medium transition-all duration-200 hover:scale-105 whitespace-nowrap"
                  >
                    For Work
                  </a>
                </div>
              </div>

              {/* CTA Button - Responsive sizing */}
              <button className="bg-black text-white text-xs sm:text-sm md:text-base px-4 sm:px-5 py-1.5 sm:py-2 rounded-full hover:bg-gray-800 transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 font-medium">
                Start Here →
              </button>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
                aria-label="Toggle menu"
              >
                <span className={`w-6 h-0.5 bg-black transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}></span>
                <span className={`w-6 h-0.5 bg-black transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : ""
                }`}></span>
                <span className={`w-6 h-0.5 bg-black transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}></span>
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
      <div className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-white z-50 shadow-2xl transition-transform duration-300 transform md:hidden ${
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="flex flex-col pt-20 px-6 gap-4">
          {/* Mobile Logo */}
          <div className="pb-4 mb-2 border-b border-gray-100">
            <img 
              src="/Logo.png" 
              alt="Logo" 
              className="h-10 w-auto"
            />
          </div>
          
          {/* Mobile Navigation Links - Larger touch targets */}
          <a 
            href="#" 
            className="text-gray-800 hover:text-black text-xl font-medium py-3 px-2 hover:bg-gray-50 rounded-lg transition-all"
            onClick={() => setIsMenuOpen(false)}
          >
            For Brands
          </a>
          <a 
            href="#" 
            className="text-gray-800 hover:text-black text-xl font-medium py-3 px-2 hover:bg-gray-50 rounded-lg transition-all"
            onClick={() => setIsMenuOpen(false)}
          >
            For Individuals
          </a>
          <a 
            href="#" 
            className="text-gray-800 hover:text-black text-xl font-medium py-3 px-2 hover:bg-gray-50 rounded-lg transition-all"
            onClick={() => setIsMenuOpen(false)}
          >
            For Work
          </a>

          {/* Mobile CTA */}
          <div className="pt-6 mt-4 border-t border-gray-100">
            <button className="w-full bg-black text-white text-base px-6 py-3 rounded-full hover:bg-gray-800 transition-all font-medium">
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