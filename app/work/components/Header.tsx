"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Header from '@/app/components/Header';
import { supabase } from "@/app/lib/supabase/client";
import type { WorkHeaderSettings } from "@/app/types/workheader";

export default function WorkHeader() {
  const [settings, setSettings] = useState<Partial<WorkHeaderSettings>>({});
  const [loading, setLoading] = useState(true);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('work_header_settings')
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
    return <div className="bg-black relative w-full min-h-[36vh]"></div>;
  }

  // ========== MOBILE LAYOUT ==========
  if (isMobile) {
    return (
      <section 
        className="relative w-full min-h-[40vh] py-6 px-4 flex items-center justify-center overflow-hidden font-helvetica"
        style={{ backgroundColor: settings.background_color || '#000000' }}
      >
        <Header />
        
        <div className="relative z-10 w-full px-4 text-center">
          
          <h1 
            className="opacity-0 animate-fade-in-up text-4xl font-medium leading-tight"
            style={{ 
              animationDelay: "0.4s", 
              animationFillMode: "forwards",
              color: settings.title_color || '#ADDDB1'
            }}
          >
            {settings.title_text || 'Recent Work'}
          </h1>

          <p 
            className="opacity-0 animate-fade-in-up text-xs leading-tight px-2 max-w-3xl mx-auto mt-3 font-medium tracking-wider"
            style={{ 
              animationDelay: "0.8s", 
              animationFillMode: "forwards",
              color: settings.subtitle_color || '#FFFFFF'
            }}
          >
            {settings.subtitle_text || "WHAT I'VE BEEN UP TO LATELY"}
          </p>

        </div>

        {showScrollIndicator && (
          <div 
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 opacity-0 animate-fade-in transition-opacity duration-500"
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
    <section 
      className="relative w-full min-h-[36vh] sm:min-h-[42vh] lg:min-h-[48vh] py-6 sm:py-8 px-4 sm:px-6 flex items-center justify-center overflow-hidden font-helvetica"
      style={{ backgroundColor: settings.background_color || '#000000' }}
    >
      <Header />
      
      <div className="relative z-10 w-full max-w-4xl px-6 text-center mt-4 sm:mt-6">
        
        <h1 
          className="opacity-0 animate-fade-in-up text-6xl font-medium leading-tight"
          style={{ 
            animationDelay: "0.4s", 
            animationFillMode: "forwards",
            color: settings.title_color || '#ADDDB1'
          }}
        >
          {settings.title_text || 'Recent Work'}
        </h1>

        <p 
          className="opacity-0 animate-fade-in-up text-lg leading-tight px-2 sm:px-0 max-w-3xl mx-auto font-medium"
          style={{ 
            animationDelay: "0.8s", 
            animationFillMode: "forwards",
            color: settings.subtitle_color || '#FFFFFF'
          }}
        >
          {settings.subtitle_text || "WHAT I'VE BEEN UP TO LATELY"}
        </p>

      </div>

      {showScrollIndicator && (
        <div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 opacity-0 animate-fade-in transition-opacity duration-500"
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