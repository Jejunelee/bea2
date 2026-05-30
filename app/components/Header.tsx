"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import UserTypeModal from "./UserTypeModal";

export default function Header2() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDarkBackground, setIsDarkBackground] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const pathname = usePathname();
  
  const isHomepage = pathname === "/";

  const handleUserTypeSelect = (userType: "brand" | "individual") => {
    setIsModalOpen(false);
    if (userType === "brand") {
      window.location.href = "/brands";
    } else {
      window.location.href = "/people";
    }
  };

  // Handle newsletter click - opens Substack in new tab
  const handleNewsletterClick = () => {
    window.open('https://onyourplate.substack.com/', '_blank');
    // Close mobile menu if open
    setIsMenuOpen(false);
  };

  // Handle dropdown hover with delay
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsServicesDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsServicesDropdownOpen(false);
    }, 150);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsServicesDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      
      const header = document.querySelector('nav');
      if (header) {
        const headerRect = header.getBoundingClientRect();
        const centerX = headerRect.left + headerRect.width / 2;
        const centerY = headerRect.bottom + 10;
        
        const elementAtPoint = document.elementFromPoint(centerX, centerY);
        if (elementAtPoint) {
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
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
        setIsServicesDropdownOpen(false);
        setIsMobileServicesOpen(false);
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

  const services = [
    { 
      name: "Story Audit", 
      href: "/StoryAudit",
      description: "Evaluate your current narrative",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      name: "Story Foundation", 
      href: "/StoryFoundation",
      description: "Build your brand narrative",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    { 
      name: "Communications Advisory", 
      href: "/CommunicationsAdvisory",
      description: "Strategic communication planning",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      name: "Fractional Comms", 
      href: "/FractionalCommunication",
      description: "On-demand communications leadership",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
  ];

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
              
              {/* Logo */}
              <Link href="/" className="flex items-center shrink-0 cursor-pointer">
                <img 
                  src="/Logo.png" 
                  alt="Logo" 
                  className="h-8 sm:h-10 md:h-12 w-auto transition-all duration-200"
                />
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-6 lg:gap-10">
                <div className="flex items-center gap-6 lg:gap-10">
                  {/* Home Link */}
                  <Link 
                    href="/" 
                    className={`${
                      isDarkBackground 
                        ? "text-white hover:text-gray-200" 
                        : "text-gray-800 hover:text-black"
                    } text-base lg:text-lg font-medium transition-all duration-200 hover:scale-105`}
                  >
                    Home
                  </Link>

                  {/* Services Dropdown - No Chevron */}
                  <div 
                    className="relative" 
                    ref={dropdownRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                      className={`${
                        isDarkBackground 
                          ? "text-white hover:text-gray-200" 
                          : "text-gray-800 hover:text-black"
                      } text-base lg:text-lg font-medium transition-all duration-200 hover:scale-105`}
                    >
                      Services
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div 
                      className={`absolute top-full left-0 mt-2 w-80 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
                        isServicesDropdownOpen 
                          ? "opacity-100 scale-100 visible translate-y-0" 
                          : "opacity-0 scale-95 invisible -translate-y-2"
                      } ${
                        isDarkBackground && !scrolled
                          ? "bg-black/80 backdrop-blur-xl border border-white/20"
                          : scrolled
                            ? "bg-white/95 backdrop-blur-xl border border-gray-100 shadow-xl"
                            : "bg-white border border-gray-100"
                      }`}
                      style={{
                        boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)'
                      }}
                    >
                      <div className="py-2">
                        {services.map((service, index) => (
                          <Link
                            key={service.name}
                            href={service.href}
                            className={`group relative flex items-start gap-3 px-4 py-3 transition-all duration-200 ${
                              isDarkBackground && !scrolled
                                ? "text-white hover:bg-white/10"
                                : scrolled
                                  ? "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent"
                                  : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent"
                            }`}
                            onClick={() => setIsServicesDropdownOpen(false)}
                          >
                            {/* Icon */}
                            <div className={`flex-shrink-0 mt-0.5 transition-all duration-200 ${
                              isDarkBackground && !scrolled
                                ? "text-white/70 group-hover:text-white"
                                : "text-gray-400 group-hover:text-black"
                            }`}>
                              {service.icon}
                            </div>
                            
                            {/* Text Content */}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm transition-colors">
                                {service.name}
                              </div>
                              <div className={`text-xs mt-0.5 transition-colors ${
                                isDarkBackground && !scrolled
                                  ? "text-white/50 group-hover:text-white/70"
                                  : "text-gray-500 group-hover:text-gray-600"
                              }`}>
                                {service.description}
                              </div>
                            </div>
                            
                            {/* Arrow indicator */}
                            <div className={`flex-shrink-0 transition-all duration-200 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 ${
                              isDarkBackground && !scrolled
                                ? "text-white/50"
                                : "text-gray-400"
                            }`}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                            
                            {/* Hover line effect */}
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-0 bg-gradient-to-b from-transparent via-current to-transparent transition-all duration-300 group-hover:h-8 opacity-0 group-hover:opacity-100" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Newsletter Link - Opens Substack */}
                  <button
                    onClick={handleNewsletterClick}
                    className={`${
                      isDarkBackground 
                        ? "text-white hover:text-gray-200" 
                        : "text-gray-800 hover:text-black"
                    } text-base lg:text-lg font-medium transition-all duration-200 hover:scale-105 cursor-pointer`}
                  >
                    Newsletter
                  </button>
                </div>
              </div>

              {/* Contact Button */}
              <button 
                onClick={() => window.location.href = "/Contact"}
                className={`hidden md:block ${
                  isDarkBackground && !scrolled
                    ? "bg-white text-black hover:bg-gray-100" 
                    : "bg-black text-white hover:bg-gray-800"
                } text-xs sm:text-sm md:text-base px-4 sm:px-5 py-1.5 sm:py-2 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 font-medium`}
              >
                Contact →
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
        isDarkBackground ? "bg-neutral-900" : "bg-white"
      } ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col pt-20 px-6 gap-4 overflow-y-auto h-full pb-8">
          <Link href="/" className={`pb-4 mb-2 border-b block ${
            isDarkBackground ? "border-gray-700" : "border-gray-100"
          }`} onClick={() => setIsMenuOpen(false)}>
            <img 
              src="/Logo.png" 
              alt="Logo" 
              className="h-10 w-auto"
            />
          </Link>

          {/* Home Link - Mobile */}
          <Link 
            href="/" 
            className={`${
              isDarkBackground 
                ? "text-white hover:bg-gray-800" 
                : "text-gray-800 hover:bg-gray-50 hover:text-black"
            } text-xl font-medium py-3 px-2 rounded-lg transition-all`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>

          {/* Services Dropdown in Mobile Menu - No Chevron */}
          <div className="flex flex-col">
            <button
              onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
              className={`flex items-center justify-between ${
                isDarkBackground 
                  ? "text-white hover:bg-gray-800" 
                  : "text-gray-800 hover:bg-gray-50 hover:text-black"
              } text-xl font-medium py-3 px-2 rounded-lg transition-all w-full`}
            >
              Services
              <svg 
                className={`w-5 h-5 transition-transform duration-200 ${
                  isMobileServicesOpen ? "rotate-180" : ""
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 ${
              isMobileServicesOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}>
              <div className="pl-4 mt-1 space-y-1">
                {services.map((service) => (
                  <Link
                    key={service.name}
                    href={service.href}
                    className={`flex items-start gap-3 ${
                      isDarkBackground 
                        ? "text-white/80 hover:bg-gray-800" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-black"
                    } text-base font-medium py-2 px-2 rounded-lg transition-all`}
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsMobileServicesOpen(false);
                    }}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {service.icon}
                    </div>
                    <div className="flex-1">
                      <div>{service.name}</div>
                      <div className={`text-xs mt-0.5 ${
                        isDarkBackground ? "text-white/50" : "text-gray-500"
                      }`}>
                        {service.description}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Newsletter Link - Mobile - Opens Substack */}
          <button
            onClick={handleNewsletterClick}
            className={`${
              isDarkBackground 
                ? "text-white hover:bg-gray-800" 
                : "text-gray-800 hover:bg-gray-50 hover:text-black"
            } text-xl font-medium py-3 px-2 rounded-lg transition-all w-full text-left cursor-pointer`}
          >
            Newsletter
          </button>

          {/* Mobile Contact Button */}
          <div className={`pt-6 mt-4 border-t ${
            isDarkBackground ? "border-gray-700" : "border-gray-100"
          }`}>
            <button 
              onClick={() => {
                setIsMenuOpen(false);
                window.location.href = "/contact";
              }}
              className={`w-full ${
                isDarkBackground 
                  ? "bg-white text-black hover:bg-gray-100" 
                  : "bg-black text-white hover:bg-gray-800"
              } text-base px-6 py-3 rounded-full transition-all font-medium`}
            >
              Contact →
            </button>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-14 sm:h-16 md:h-20"></div>

      {/* Modal Component */}
      <UserTypeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleUserTypeSelect}
      />
    </>
  );
}