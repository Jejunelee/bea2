"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Form submitted:", formData);
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ========== MOBILE LAYOUT ==========
  if (isMobile) {
    return (
      <>
        <section
          ref={sectionRef}
          className="relative min-h-screen py-16 px-4 overflow-hidden"
          style={{ backgroundColor: '#fefdf8' }}
        >
          {/* Warm glow blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#e9c08f]/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#e6ee9c]/20 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-10 text-center">
              <h1 className="text-3xl font-medium text-black tracking-tight font-helvetica mb-3">
                Let's <span className="font-editorial italic">talk</span>
              </h1>
              <div className="w-16 h-px bg-black/20 mx-auto" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-black/70 mb-2 font-helvetica">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/50 border border-black/10 rounded-lg focus:outline-none focus:border-black/30 transition-colors font-helvetica text-black"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black/70 mb-2 font-helvetica">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/50 border border-black/10 rounded-lg focus:outline-none focus:border-black/30 transition-colors font-helvetica text-black"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-black/70 mb-2 font-helvetica">
                  Message <span className="text-black/40">— Tell me what you need help with.</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-white/50 border border-black/10 rounded-lg focus:outline-none focus:border-black/30 transition-colors font-helvetica text-black resize-none"
                  placeholder="I'm reaching out because..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full group relative rounded-full bg-black text-white text-base font-medium px-6 py-3 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? "Sending..." : isSubmitted ? "Sent!" : "Submit"}
                  {!isSubmitting && !isSubmitted && (
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  )}
                </span>
              </button>
            </form>

            {/* Social Links */}
            <div className="mt-16 pt-8 border-t border-black/10 text-center">
              <p className="text-sm text-black/50 font-helvetica mb-4">Find me elsewhere</p>
              <div className="flex justify-center gap-6">
                <a
                  href="https://www.instagram.com/beatrinidad_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-1 transition-all duration-200 hover:scale-105"
                >
                  <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                    <svg className="w-5 h-5 text-black/60" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <span className="text-xs text-black/40 font-helvetica">Instagram</span>
                </a>

                <a
                  href="https://www.tiktok.com/@beatrinidad_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-1 transition-all duration-200 hover:scale-105"
                >
                  <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                    <svg className="w-5 h-5 text-black/60" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </div>
                  <span className="text-xs text-black/40 font-helvetica">TikTok</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/beagtrinidad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-1 transition-all duration-200 hover:scale-105"
                >
                  <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                    <svg className="w-5 h-5 text-black/60" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z"/>
                    </svg>
                  </div>
                  <span className="text-xs text-black/40 font-helvetica">LinkedIn</span>
                </a>

                <div className="group flex flex-col items-center gap-1 transition-all duration-200 hover:scale-105">
                  <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                    <svg className="w-5 h-5 text-black/60" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.539 8.242a2.98 2.98 0 0 0-2.102-2.11C18.94 5.85 12 5.85 12 5.85s-6.94 0-8.437.282a2.98 2.98 0 0 0-2.102 2.11C1.18 9.73 1 12 1 12s.18 2.27.461 3.758a2.98 2.98 0 0 0 2.102 2.11C5.06 18.15 12 18.15 12 18.15s6.94 0 8.437-.282a2.98 2.98 0 0 0 2.102-2.11C22.82 14.27 23 12 23 12s-.18-2.27-.461-3.758zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
                    </svg>
                  </div>
                  <span className="text-xs text-black/40 font-helvetica">Substack</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  // ========== DESKTOP LAYOUT ==========
  return (
    <>
      <section
        ref={sectionRef}
        className="relative min-h-screen py-24 px-6 overflow-hidden"
        style={{ backgroundColor: '#fefdf8' }}
      >
        {/* Warm glow blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-[10%] w-[300px] h-[300px] bg-[#e9c08f]/15 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-[10%] w-[400px] h-[400px] bg-[#e6ee9c]/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/40 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left Column - Intro */}
            <div
              className={`transition-all duration-700 ease-out ${
                hasAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <h1 className="text-4xl md:text-5xl font-medium text-black tracking-tight font-helvetica mb-4">
                Let's <span className="font-editorial italic">talk</span>
              </h1>
              <div className="w-12 h-px bg-black/20 mb-6" />
              <p className="text-lg text-black/60 leading-relaxed font-helvetica mb-8">
                Have a project in mind? Something your brand needs? Or just want to explore if we're a fit? Drop a message and I'll get back to you within 48 hours.
              </p>
              
              {/* Decorative element */}
              <div className="hidden md:block mt-12">
                <div className="border-l-2 border-black/10 pl-4">
                  <p className="text-sm text-black/40 font-helvetica italic">
                    "Clarity is the fastest path to<br />
                    confident communication."
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div
              className={`transition-all duration-700 ease-out delay-200 ${
                hasAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-black/70 mb-2 font-helvetica">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/60 border border-black/10 rounded-lg focus:outline-none focus:border-black/30 transition-colors font-helvetica text-black"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-black/70 mb-2 font-helvetica">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/60 border border-black/10 rounded-lg focus:outline-none focus:border-black/30 transition-colors font-helvetica text-black"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-black/70 mb-2 font-helvetica">
                    Message <span className="text-black/40">— Tell me what you need help with.</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white/60 border border-black/10 rounded-lg focus:outline-none focus:border-black/30 transition-colors font-helvetica text-black resize-none"
                    placeholder="I'm reaching out because..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative rounded-full bg-black text-white text-base font-medium px-8 py-3 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? "Sending..." : isSubmitted ? "Sent!" : "Submit"}
                    {!isSubmitting && !isSubmitted && (
                      <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    )}
                  </span>
                </button>
              </form>

              {/* Social Links */}
              <div className="mt-10 pt-8 border-t border-black/10">
                <p className="text-sm text-black/50 font-helvetica mb-4">Find me elsewhere</p>
                <div className="flex gap-8">
                  <a
                    href="https://www.instagram.com/beatrinidad_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 transition-all duration-200 hover:scale-105"
                  >
                    <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                      <svg className="w-4 h-4 text-black/60" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>
                    <span className="text-sm text-black/50 font-helvetica group-hover:text-black/70 transition-colors">Instagram</span>
                  </a>

                  <a
                    href="https://www.tiktok.com/@beatrinidad_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 transition-all duration-200 hover:scale-105"
                  >
                    <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                      <svg className="w-4 h-4 text-black/60" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    </div>
                    <span className="text-sm text-black/50 font-helvetica group-hover:text-black/70 transition-colors">TikTok</span>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/beagtrinidad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 transition-all duration-200 hover:scale-105"
                  >
                    <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                      <svg className="w-4 h-4 text-black/60" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z"/>
                      </svg>
                    </div>
                    <span className="text-sm text-black/50 font-helvetica group-hover:text-black/70 transition-colors">LinkedIn</span>
                  </a>

                  <div className="group flex items-center gap-2 transition-all duration-200 hover:scale-105 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                      <svg className="w-4 h-4 text-black/60" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.539 8.242a2.98 2.98 0 0 0-2.102-2.11C18.94 5.85 12 5.85 12 5.85s-6.94 0-8.437.282a2.98 2.98 0 0 0-2.102 2.11C1.18 9.73 1 12 1 12s.18 2.27.461 3.758a2.98 2.98 0 0 0 2.102 2.11C5.06 18.15 12 18.15 12 18.15s6.94 0 8.437-.282a2.98 2.98 0 0 0 2.102-2.11C22.82 14.27 23 12 23 12s-.18-2.27-.461-3.758zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
                      </svg>
                    </div>
                    <span className="text-sm text-black/50 font-helvetica group-hover:text-black/70 transition-colors">Substack</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}