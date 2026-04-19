"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Quote() {
  const fullText = `The food and hospitality industry is full of brilliant operators who are invisible online. They're building extraordinary things, and their content looks like everyone else's. That's the gap I work in.`;
  
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
      } else {
        setIsTypingComplete(true);
        clearInterval(timer);
      }
    }, 50); // Adjust speed here (milliseconds per character)

    return () => clearInterval(timer);
  }, []);

  // Function to render text with styling
  const renderStyledText = () => {
    // Split the displayed text to find where we are in the typing process
    const parts = [
      { text: "The food and hospitality industry is full of ", style: "" },
      { text: "brilliant", style: "italic font-editorial" },
      { text: " operators who are ", style: "" },
      { text: "invisible online", style: "px-1 rounded" },
      { text: ". They're building ", style: "" },
      { text: "extraordinary", style: "italic font-editorial" },
      { text: " things, and their ", style: "" },
      { text: "content", style: "px-1 rounded" },
      { text: " looks like everyone else's. That's the gap I work in.", style: "" },
    ];

    let currentPosition = 0;
    const styledElements = [];

    for (const part of parts) {
      const partStart = currentPosition;
      const partEnd = partStart + part.text.length;
      currentPosition = partEnd;

      // Only show this part if we've typed at least up to its start
      if (displayedText.length > partStart) {
        const typedLength = Math.max(0, Math.min(
          displayedText.length - partStart,
          part.text.length
        ));
        
        if (typedLength > 0) {
          const visibleText = part.text.slice(0, typedLength);
          
          // Add cursor effect at the end of the visible text if not complete
          const showCursor = !isTypingComplete && 
            displayedText.length === partEnd && 
            part === parts[parts.length - 1];
          
          styledElements.push(
            <span key={partStart} className={part.style}>
              {visibleText}
              {showCursor && (
                <span className="inline-block w-0.5 h-7 bg-black ml-0.5 animate-pulse" />
              )}
            </span>
          );
        }
      }
    }

    return styledElements;
  };

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden font-helvetica">
      {/* Simple background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, #f3f1df 0%, #e6e9b8 50%, #e9c08f 100%)",
        }}
      />

      {/* Simple floating blobs - static */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[260px] h-[260px] bg-[#dfe87a]/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[15%] w-[300px] h-[300px] bg-[#e9c08f]/40 blur-[120px] rounded-full" />
        <div className="absolute top-[60%] left-[30%] w-[200px] h-[200px] bg-[#ffffff]/40 blur-[100px] rounded-full" />
      </div>

      {/* Simple particles - static */}
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

      {/* Simple glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[700px] bg-[#e6ee9c]/30 blur-[140px] rounded-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl px-6 text-center">
        <p className="text-[26px] md:text-[32px] leading-relaxed font-medium text-black">
          {renderStyledText()}
        </p>

        {isTypingComplete && (
          <div className="mt-20 flex justify-center animate-fade-in">
            <Image
              src="/Landing/Icons/Arrow-5.png"
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
      `}</style>
    </section>
  );
}