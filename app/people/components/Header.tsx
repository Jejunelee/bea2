"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Header from '@/app/components/Header';

export default function BrandHeader() {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // ========== MOBILE LAYOUT (Condensed) ==========
  if (isMobile) {
    return (
      <section className="relative w-full min-h-[70vh] py-8 px-4 flex items-center justify-center overflow-hidden font-helvetica">
        <Header />
        
        {/* Radial gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at center, #FFB58C 0%, #ffffff 40%, #ffffff 60%)",
          }}
        />

        {/* Simple glow - reduced for mobile */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[400px] h-[400px] bg-[#e6ee9c]/30 blur-[100px] rounded-full" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 w-full px-4 text-center mt-4">
          
          {/* Title - Smaller for mobile */}
          <h1 
            className="opacity-0 animate-fade-in-up text-3xl font-medium text-black leading-tight"
            style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
          >
            Stop Guessing.{" "}
            <span>Start Building.</span>
          </h1>

          {/* Description - Much smaller for mobile */}
          <p 
            className="opacity-0 animate-fade-in-up text-base text-black leading-relaxed px-2 mt-4 font-medium"
            style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
          >
            Structured messaging and content systems that make every pitch, post, and partnership{" "}
            <span className="font-editorial italic">work harder</span>
            {" "}for your brand.
          </p>

        </div>

        {/* Scroll down indicator - Smaller for mobile */}
        {showScrollIndicator && (
          <div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 opacity-0 animate-fade-in transition-opacity duration-500"
            style={{ animationDelay: "1.2s", animationFillMode: "forwards" }}
          >
            <div className="flex flex-col items-center gap-1 text-gray-600">
              <Image
                src="/Landing/Icons/Arrow-5.png"
                alt="Scroll down"
                width={40}
                height={75}
                className="animate-bounce"
              />
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(15px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          .animate-fade-in-up {
            animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          
          .animate-fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }
          
          .animate-bounce {
            animation: bounce 2s infinite;
          }
          
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(8px);
            }
          }
        `}</style>
      </section>
    );
  }

  // ========== DESKTOP LAYOUT (Original) ==========
  return (
    <section className="relative w-full min-h-[72vh] sm:min-h-[84vh] lg:min-h-[96vh] py-12 sm:py-16 px-4 sm:px-6 flex items-center justify-center overflow-hidden font-helvetica">
      <Header />
      
      {/* Radial gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, #FFB58C 0%, #ffffff 40%, #ffffff 60%)",
        }}
      />

      {/* Simple glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[700px] bg-[#e6ee9c]/30 blur-[140px] rounded-full" />
      </div>
      
      {/* Content with staggered animations */}
      <div className="relative z-10 w-full max-w-4xl px-6 text-center mt-8 sm:mt-12">
        
        {/* Title */}
        <h1 
          className="opacity-0 animate-fade-in-up text-4xl font-medium text-black leading-tight"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          Stop Guessing.{" "}
          <span className="">
            Start Building.
          </span>
        </h1>

        {/* Description */}
        <p 
          className="opacity-0 animate-fade-in-up text-4xl text-black leading-tight px-2 sm:px-0 max-w-3xl mx-auto mt-6 font-medium"
          style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
        >
          Structured messaging and content systems that make every pitch, post, and partnership{" "} <br />
          <span className="font-editorial italic">work harder</span>
          {" "}for your brand.
        </p>

      </div>

      {/* Scroll down indicator */}
      {showScrollIndicator && (
        <div 
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10 opacity-0 animate-fade-in transition-opacity duration-500"
          style={{ animationDelay: "1.2s", animationFillMode: "forwards" }}
        >
          <div className="flex flex-col items-center gap-2 text-gray-600">
            <Image
              src="/Landing/Icons/Arrow-5.png"
              alt="Scroll down arrow"
              width={64}
              height={120}
              className="animate-bounce"
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(10px);
          }
        }
      `}</style>
    </section>
  );
}