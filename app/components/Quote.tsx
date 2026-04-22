"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { supabase } from "@/app/lib/supabase/client";
import type { QuoteSettings } from "@/app/types/quote";

export default function Quote() {
  const [settings, setSettings] = useState<Partial<QuoteSettings>>({});
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('quote_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (data) setSettings(data);
      setLoading(false);
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStartedTyping && !loading) {
            setHasStartedTyping(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasStartedTyping, loading]);

  const fullText = settings.quote_text || "The food and hospitality industry is full of brilliant operators who are invisible online. They're building extraordinary things, and their content looks like everyone else's. That's the gap I work in.";
  const typingSpeed = settings.typing_speed || 50;

  useEffect(() => {
    if (!hasStartedTyping) return;

    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
      } else {
        setIsTypingComplete(true);
        clearInterval(timer);
      }
    }, typingSpeed);

    return () => clearInterval(timer);
  }, [hasStartedTyping, fullText, typingSpeed]);

  const renderStyledText = () => {
    const styledWords = settings.styled_words || [];
    let result = [];
    let lastIndex = 0;
    
    for (const styled of styledWords) {
      const index = fullText.indexOf(styled.word, lastIndex);
      if (index !== -1 && displayedText.length > index) {
        if (index > lastIndex) {
          const textBefore = fullText.substring(lastIndex, index);
          const typedBefore = displayedText.length > lastIndex 
            ? textBefore.slice(0, Math.max(0, displayedText.length - lastIndex))
            : '';
          if (typedBefore) {
            result.push(typedBefore);
          }
        }
        
        const typedLength = Math.max(0, Math.min(
          displayedText.length - index,
          styled.word.length
        ));
        
        if (typedLength > 0) {
          const visibleWord = styled.word.slice(0, typedLength);
          result.push(
            <span key={index} className={styled.style}>
              {visibleWord}
            </span>
          );
        }
        
        lastIndex = index + styled.word.length;
      } else if (index !== -1 && displayedText.length <= index) {
        break;
      }
    }
    
    if (lastIndex < displayedText.length) {
      result.push(fullText.substring(lastIndex, displayedText.length));
    }
    
    // Add cursor
    if (!isTypingComplete && hasStartedTyping) {
      result.push(
        <span key="cursor" className="inline-block w-0.5 h-7 bg-black ml-0.5 animate-pulse" />
      );
    }
    
    return result;
  };

  if (loading) {
    return <div className="relative w-full h-screen bg-gray-100"></div>;
  }

  return (
    <section ref={sectionRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden font-helvetica">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, ${settings.background_gradient_start || '#f3f1df'} 0%, ${settings.background_gradient_mid || '#e6e9b8'} 50%, ${settings.background_gradient_end || '#e9c08f'} 100%)`,
        }}
      />

      {/* Floating blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[260px] h-[260px] bg-[#dfe87a]/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[15%] w-[300px] h-[300px] bg-[#e9c08f]/40 blur-[120px] rounded-full" />
        <div className="absolute top-[60%] left-[30%] w-[200px] h-[200px] bg-[#ffffff]/40 blur-[100px] rounded-full" />
      </div>

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-black/10 rounded-full"
            style={{
              top: `${20 + i * 8}%`,
              left: `${10 + i * 9}%`,
            }}
          />
        ))}
      </div>

      {/* Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[700px] bg-[#e6ee9c]/30 blur-[140px] rounded-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl px-6 text-center">
        <p 
          className="leading-relaxed font-medium text-black"
          style={{ 
            fontSize: window.innerWidth < 768 ? settings.text_size_mobile : settings.text_size_desktop,
            color: settings.text_color || '#000000'
          }}
        >
          {hasStartedTyping ? renderStyledText() : fullText.split('').map((char, i) => (
            <span key={i} className="opacity-0">{char}</span>
          ))}
        </p>

        {isTypingComplete && settings.show_arrow_icon && settings.arrow_icon_url && (
          <div className="mt-20 flex justify-center animate-fade-in">
            <Image
              src={settings.arrow_icon_url}
              alt="Arrow"
              width={64}
              height={120}
              className="animate-bounce"
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }
        .animate-pulse {
          animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </section>
  );
}