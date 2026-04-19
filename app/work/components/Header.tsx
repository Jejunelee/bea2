"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Header from '@/app/components/Header';

export default function WorkHeader() {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Check if user has scrolled down more than 100px
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="bg-black relative w-full min-h-[36vh] sm:min-h-[42vh] lg:min-h-[48vh] py-6 sm:py-8 px-4 sm:px-6 flex items-center justify-center overflow-hidden font-helvetica">
          <Header />
      
      {/* Content with staggered animations */}
      <div className="relative z-10 w-full max-w-4xl px-6 text-center mt-4 sm:mt-6">
        
        {/* Title - Fade in up with delay */}
        <h1 
          className="opacity-0 animate-fade-in-up text-6xl font-medium text-[#ADDDB1] leading-tight"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          Recent Work
        </h1>

        {/* Description - Fade in up with longer delay */}
        <p 
          className="opacity-0 animate-fade-in-up text-lg text-white leading-tight px-2 sm:px-0 max-w-3xl mx-auto font-medium"
          style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
        >
          WHAT I'VE BEEN UP TO LATELY
        </p>

      </div>

      {/* Scroll down indicator - Fades in last, gently bounces, and fades out on scroll */}
      {showScrollIndicator && (
        <div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 opacity-0 animate-fade-in transition-opacity duration-500"
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

      {/* Animation keyframes */}
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