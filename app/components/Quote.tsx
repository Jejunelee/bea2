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
  const [visibleParagraphs, setVisibleParagraphs] = useState<number[]>([]);
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
  const typingEnabled = settings.typing_enabled ?? true; // Default to true for backward compatibility
  const fadeDelay = settings.fade_delay || 200;
  
  // Split text into paragraphs for fade mode
  const paragraphs = fullText.split('\n').filter(p => p.trim().length > 0);

  // Typing animation effect
  useEffect(() => {
    if (!hasStartedTyping || !typingEnabled) return;

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
  }, [hasStartedTyping, fullText, typingSpeed, typingEnabled]);

  // Fade in paragraphs effect (when typing is disabled)
  useEffect(() => {
    if (!hasStartedTyping || typingEnabled) return;

    // Fade in paragraphs one by one
    paragraphs.forEach((_, index) => {
      setTimeout(() => {
        setVisibleParagraphs(prev => [...prev, index]);
      }, index * fadeDelay);
    });
  }, [hasStartedTyping, typingEnabled, paragraphs.length, fadeDelay]);

  // When typing completes (if enabled), mark as complete for arrow
  useEffect(() => {
    if (typingEnabled && isTypingComplete) {
      // Typing is done
    }
  }, [typingEnabled, isTypingComplete]);

  const renderStyledText = () => {
    const styledWords = settings.styled_words || [];
    const textToRender = typingEnabled ? displayedText : fullText;
    
    if (styledWords.length === 0) {
      // No styled words, just handle line breaks
      return textToRender.split('\n').map((line, i) => (
        <React.Fragment key={i}>
          {line}
          {i < textToRender.split('\n').length - 1 && <br />}
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
        const index = textToRender.indexOf(styled.word, searchIndex);
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
          content: textToRender.substring(lastIndex, match.index)
        });
      }
      segments.push({
        type: 'styled',
        content: match.word,
        style: match.style
      });
      lastIndex = match.index + match.length;
    }
    
    if (lastIndex < textToRender.length) {
      segments.push({
        type: 'text',
        content: textToRender.substring(lastIndex)
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
    
    // Add cursor for typing mode
    if (typingEnabled && !isTypingComplete && hasStartedTyping) {
      result.push(
        <span key="cursor" className="inline-block w-0.5 bg-black ml-0.5 animate-pulse" 
          style={{ height: `${calculatedFontSize * 1.2}px` }} />
      );
    }
    
    return result;
  };

  const renderFadeParagraphs = () => {
    const styledWords = settings.styled_words || [];
    
    if (styledWords.length === 0) {
      // No styled words, just render visible paragraphs with spacing and fade-in
      return paragraphs.map((paragraph, index) => (
        <div 
          key={index}
          className={`fade-in ${visibleParagraphs.includes(index) ? 'visible' : ''}`}
          style={{ 
            marginBottom: '1.5rem',
            opacity: visibleParagraphs.includes(index) ? 1 : 0,
            animation: visibleParagraphs.includes(index) ? 'fade-in 0.6s ease forwards' : 'none'
          }}
        >
          {paragraph}
        </div>
      ));
    }
    
    // Build array of text segments with styling for each paragraph
    return paragraphs.map((paragraphText, index) => {
      let segments = [];
      let lastIndex = 0;
      
      // Find all styled words and sort by their position
      const matches = [];
      for (const styled of styledWords) {
        let searchIndex = 0;
        while (true) {
          const idx = paragraphText.indexOf(styled.word, searchIndex);
          if (idx === -1) break;
          matches.push({
            index: idx,
            word: styled.word,
            style: styled.style,
            length: styled.word.length
          });
          searchIndex = idx + 1;
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
            content: paragraphText.substring(lastIndex, match.index)
          });
        }
        segments.push({
          type: 'styled',
          content: match.word,
          style: match.style
        });
        lastIndex = match.index + match.length;
      }
      
      if (lastIndex < paragraphText.length) {
        segments.push({
          type: 'text',
          content: paragraphText.substring(lastIndex)
        });
      }
      
      // Convert segments to JSX
      const result = [];
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        
        if (segment.type === 'styled') {
          result.push(
            <span key={`styled-${index}-${i}`} className={segment.style}>
              {segment.content}
            </span>
          );
        } else {
          result.push(segment.content);
        }
      }
      
      return (
        <div 
          key={index}
          className={`fade-in ${visibleParagraphs.includes(index) ? 'visible' : ''}`}
          style={{ 
            marginBottom: '1.5rem',
            opacity: visibleParagraphs.includes(index) ? 1 : 0,
            animation: visibleParagraphs.includes(index) ? 'fade-in 0.6s ease forwards' : 'none'
          }}
        >
          {result}
        </div>
      );
    });
  };

  const showArrow = () => {
    if (typingEnabled) {
      return isTypingComplete && settings.show_arrow_icon && settings.arrow_icon_url;
    } else {
      return visibleParagraphs.length === paragraphs.length && settings.show_arrow_icon && settings.arrow_icon_url;
    }
  };

  if (loading) {
    return <div className="relative w-full h-screen bg-gray-100"></div>;
  }

  return (
    <section ref={sectionRef} className="relative w-full h-[700px] flex items-center justify-center overflow-hidden font-helvetica">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, ${settings.background_gradient_start || '#f3f1df'} 0%, ${settings.background_gradient_mid || '#e6e9b8'} 50%, ${settings.background_gradient_end || '#e9c08f'} 100%)`,
        }}
      />

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

      {/* Content */}
      <div className="relative z-10 max-w-2xl px-6 text-center w-full">
        {typingEnabled ? (
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
        ) : (
          <div 
            className="leading-tight font-medium text-black"
            style={{ 
              fontSize: `${calculatedFontSize}px`,
              color: settings.text_color || '#000000',
            }}
          >
            {hasStartedTyping ? (
              renderFadeParagraphs()
            ) : (
              // Invisible placeholders to maintain layout before fade starts
              paragraphs.map((paragraph, i) => (
                <div key={i} className="opacity-0" style={{ marginBottom: '1.5rem' }}>
                  {paragraph}
                </div>
              ))
            )}
          </div>
        )}

        {showArrow() && (
          <div className="mt-20 flex justify-center animate-fade-in">
            <Image
              src={settings.arrow_icon_url!}
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
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in {
          opacity: 0;
        }
        .fade-in.visible {
          animation: fade-in 0.6s ease forwards;
        }
        @keyframes fade-in-arrow {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in-arrow 0.5s ease-in;
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce {
          animation: bounce 1s infinite;
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