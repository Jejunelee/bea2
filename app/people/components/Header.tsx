"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Header from '@/app/components/Header';
import { supabase } from "@/app/lib/supabase/client";
import type { IndividualHeaderSettings } from "@/app/types/peopleheader";

export default function IndividualHeader() {
  const [settings, setSettings] = useState<Partial<IndividualHeaderSettings>>({});
  const [loading, setLoading] = useState(true);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('individual_header_settings')
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

  if (loading) {
    return <div className="relative w-full min-h-screen bg-white"></div>;
  }

  // ========== MOBILE LAYOUT ==========
  if (isMobile) {
    return (
      <section className="relative w-full min-h-[70vh] py-8 px-4 flex items-center justify-center overflow-hidden font-helvetica">
        <Header />
        
        {/* Radial gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at center, ${settings.background_gradient_start || '#FFB58C'} 0%, ${settings.background_gradient_mid || '#ffffff'} 40%, ${settings.background_gradient_end || '#ffffff'} 60%)`,
          }}
        />

        {/* Simple glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div 
            className="w-[400px] h-[400px] blur-[100px] rounded-full"
            style={{ 
              backgroundColor: `${settings.glow_color || '#e6ee9c'}`,
              opacity: ((settings.glow_opacity || 30) / 100)
            }}
          />
        </div>
        
        {/* Content */}
        <div className="relative z-10 w-full px-4 text-center mt-4">
          
          {/* Title */}
          <h1 
            className="opacity-0 animate-fade-in-up text-3xl font-medium text-black leading-tight"
            style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
          >
            {settings.title_prefix || 'Stop Guessing.'}{" "}
            <span>{settings.title_suffix || 'Start Building.'}</span>
          </h1>

          {/* Description */}
          <p 
            className="opacity-0 animate-fade-in-up text-base text-black leading-relaxed px-2 mt-4 font-medium"
            style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
          >
            {settings.description_prefix || 'Structured messaging and content systems that make every pitch, post, and partnership'}{" "}
            <span className="font-editorial italic">{settings.description_italic || 'work harder'}</span>
            {" "}{settings.description_suffix || 'for your brand.'}
          </p>

        </div>

        {/* Scroll down indicator */}
        {showScrollIndicator && (
          <div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 opacity-0 animate-fade-in transition-opacity duration-500"
            style={{ animationDelay: "1.2s", animationFillMode: "forwards" }}
          >
            <div className="flex flex-col items-center gap-1 text-gray-600">
              <Image
                src={settings.scroll_arrow_icon_url || '/Landing/Icons/Arrow-5.png'}
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

  // ========== DESKTOP LAYOUT ==========
  return (
    <section className="relative w-full min-h-[72vh] sm:min-h-[84vh] lg:min-h-[96vh] py-12 sm:py-16 px-4 sm:px-6 flex items-center justify-center overflow-hidden font-helvetica">
      <Header />
      
      {/* Radial gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, ${settings.background_gradient_start || '#FFB58C'} 0%, ${settings.background_gradient_mid || '#ffffff'} 40%, ${settings.background_gradient_end || '#ffffff'} 60%)`,
        }}
      />

      {/* Simple glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="w-[700px] h-[700px] blur-[140px] rounded-full"
          style={{ 
            backgroundColor: `${settings.glow_color || '#e6ee9c'}`,
            opacity: ((settings.glow_opacity || 30) / 100)
          }}
        />
      </div>
      
      {/* Content with staggered animations */}
      <div className="relative z-10 w-full max-w-4xl px-6 text-center mt-8 sm:mt-12">
        
        {/* Title */}
        <h1 
          className="opacity-0 animate-fade-in-up text-4xl font-medium text-black leading-tight"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          {settings.title_prefix || 'Stop Guessing.'}{" "}
          <span>{settings.title_suffix || 'Start Building.'}</span>
        </h1>

        {/* Description */}
        <p 
          className="opacity-0 animate-fade-in-up text-4xl text-black leading-tight px-2 sm:px-0 max-w-3xl mx-auto mt-6 font-medium"
          style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
        >
          {settings.description_prefix || 'Structured messaging and content systems that make every pitch, post, and partnership'}{" "} <br />
          <span className="font-editorial italic">{settings.description_italic || 'work harder'}</span>
          {" "}{settings.description_suffix || 'for your brand.'}
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
              src={settings.scroll_arrow_icon_url || '/Landing/Icons/Arrow-5.png'}
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