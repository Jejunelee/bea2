"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { supabase } from "@/app/lib/supabase/client";
import type { QuoteSettings } from "@/app/types/quote";

export default function Quote() {
  const [settings, setSettings] = useState<Partial<QuoteSettings>>({});
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [calculatedFontSize, setCalculatedFontSize] = useState(32);
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

  // Calculate font size once based on total text length
  useEffect(() => {
    if (!settings.quote_text) return;
    
    const fullText = settings.quote_text;
    const textLength = fullText.length;
    
    // Get base font size from settings
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const baseFontSize = isMobile 
      ? parseInt(settings.text_size_mobile || '26px')
      : parseInt(settings.text_size_desktop || '32px');
    
    // Calculate font size based on text length
    let newFontSize = baseFontSize;
    
    if (textLength > 300) {
      newFontSize = Math.max(14, baseFontSize * 0.9);
    } else if (textLength > 250) {
      newFontSize = Math.max(14, baseFontSize * 0.9);
    } else if (textLength > 200) {
      newFontSize = Math.max(16, baseFontSize * 0.9);
    } else if (textLength > 150) {
      newFontSize = Math.max(18, baseFontSize * 0.9);
    } else if (textLength > 100) {
      newFontSize = Math.max(20, baseFontSize * 0.9);
    } else if (textLength > 60) {
      newFontSize = Math.max(24, baseFontSize * 0.9);
    }
    
    setCalculatedFontSize(newFontSize);
  }, [settings.quote_text, settings.text_size_desktop, settings.text_size_mobile]);

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
    
    if (styledWords.length === 0) {
      // No styled words, just handle line breaks
      return displayedText.split('\n').map((line, i) => (
        <React.Fragment key={i}>
          {line}
          {i < displayedText.split('\n').length - 1 && <br />}
        </React.Fragment>
      ));
    }
    
    // Build array of text segments with styling
    let segments = [];
    let lastIndex = 0;
    
    // Find all styled words and sort by their position
    const matches = [];
    for (const styled of styledWords) {
      let searchIndex = 0;
      while (true) {
        const index = displayedText.indexOf(styled.word, searchIndex);
        if (index === -1) break;
        matches.push({
          index,
          word: styled.word,
          style: styled.style,
          length: styled.word.length
        });
        searchIndex = index + 1;
      }
    }
    
    // Sort matches by index
    matches.sort((a, b) => a.index - b.index);
    
    // Remove overlapping matches
    const filteredMatches = [];
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      if (filteredMatches.length === 0) {
        filteredMatches.push(match);
      } else {
        const lastMatch = filteredMatches[filteredMatches.length - 1];
        if (match.index >= lastMatch.index + lastMatch.length) {
          filteredMatches.push(match);
        }
      }
    }
    
    // Build segments from filtered matches
    for (const match of filteredMatches) {
      if (match.index > lastIndex) {
        segments.push({
          type: 'text',
          content: displayedText.substring(lastIndex, match.index)
        });
      }
      segments.push({
        type: 'styled',
        content: match.word,
        style: match.style
      });
      lastIndex = match.index + match.length;
    }
    
    if (lastIndex < displayedText.length) {
      segments.push({
        type: 'text',
        content: displayedText.substring(lastIndex)
      });
    }
    
    // Convert segments to JSX and handle line breaks
    const result = [];
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      
      if (segment.type === 'styled') {
        result.push(
          <span key={`styled-${i}`} className={segment.style}>
            {segment.content}
          </span>
        );
      } else {
        // Split text by line breaks
        const lines = segment.content.split('\n');
        for (let j = 0; j < lines.length; j++) {
          if (lines[j]) {
            result.push(lines[j]);
          }
          if (j < lines.length - 1) {
            result.push(<br key={`br-${i}-${j}`} />);
          }
        }
      }
    }
    
    // Add cursor
    if (!isTypingComplete && hasStartedTyping) {
      result.push(
        <span key="cursor" className="inline-block w-0.5 bg-black ml-0.5 animate-pulse" 
          style={{ height: `${calculatedFontSize * 1.2}px` }} />
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
      <div className="relative z-10 max-w-4xl px-6 text-center w-full">
        <p 
          className="leading-tight font-medium text-black whitespace-pre-wrap break-words"
          style={{ 
            fontSize: `${calculatedFontSize}px`,
            color: settings.text_color || '#000000',
          }}
        >
          {hasStartedTyping ? (
            renderStyledText()
          ) : (
            // Invisible placeholder to maintain line break structure before typing starts
            fullText.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                <span className="opacity-0">{line}</span>
                {i < fullText.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))
          )}
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
        .whitespace-pre-wrap {
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        .break-words {
          word-break: break-word;
        }
      `}</style>
    </section>
  );
}