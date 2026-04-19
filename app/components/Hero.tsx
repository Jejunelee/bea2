"use client";

import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const leftPolaroidRef = useRef<HTMLDivElement>(null);
  const rightPolaroidRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Typing animation state
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showSharpestImage, setShowSharpestImage] = useState(false);
  const fullText = "Bea Trinidad · Type Harder Studio";

  // CREATE CALENDAR EVENT - Using Google Calendar URL
  const createCalendarEvent = () => {
    // Get current date and time for the event (default to 1 hour from now)
    const startDate = new Date();
    startDate.setHours(startDate.getHours() + 1);
    
    // Set end time to 1 hour after start
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);
    
    // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ format)
    const formatDateForGoogle = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const startTime = formatDateForGoogle(startDate);
    const endTime = formatDateForGoogle(endDate);
    
    // Create the Google Calendar URL
    const url = 
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=Exploratory+Call" +
      `&dates=${startTime}/${endTime}` +
      "&details=Hi,+I'm+reaching+out+to+discuss+how+we+can+work+together+on+storytelling+and+communications." +
      "&location=Google+Meet" +
      "&add=bea@gmail.com";
    
    // Open in new window
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Navigate to work page
  const navigateToWork = () => {
    router.push('/work');
  };

  useEffect(() => {
    if (isTyping) {
      if (typedText.length < fullText.length) {
        const timeout = setTimeout(() => {
          setTypedText(fullText.slice(0, typedText.length + 1));
        }, 80);
        return () => clearTimeout(timeout);
      } else {
        setIsTyping(false);
        // Trigger the image animation after typing completes
        setTimeout(() => {
          setShowSharpestImage(true);
        }, 100);
      }
    }
  }, [typedText, isTyping]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const speed = 0.8;
      
      if (leftPolaroidRef.current) {
        const leftMoveX = Math.min(scrollY * speed, 1000);
        const leftMoveY = Math.min(scrollY * speed * 0.6, 180);
        const leftRotate = Math.max(0, 6 - scrollY * 0.03);
        leftPolaroidRef.current.style.transform = `translate(${leftMoveX}px, -${leftMoveY}px) rotate(${leftRotate}deg)`;
        leftPolaroidRef.current.style.zIndex = Math.min(20, Math.floor(scrollY / 20) + 5).toString();
      }
      
      if (rightPolaroidRef.current) {
        const rightMoveX = Math.min(scrollY * speed, 1000);
        const rightMoveY = Math.min(scrollY * speed * 0.6, 180);
        const rightRotate = Math.max(0, -6 + scrollY * 0.03);
        rightPolaroidRef.current.style.transform = `translate(-${rightMoveX}px, -${rightMoveY}px) rotate(${rightRotate}deg)`;
        rightPolaroidRef.current.style.zIndex = Math.min(20, Math.floor(scrollY / 20) + 5).toString();
      }
      
      if (contentRef.current) {
        const opacity = Math.max(0, 1 - scrollY * 0.008);
        const scale = Math.max(0.8, 1 - scrollY * 0.002);
        contentRef.current.style.opacity = opacity.toString();
        contentRef.current.style.transform = `scale(${scale})`;
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-visible px-4 sm:px-6 py-12 sm:py-16 font-helvetica">
      {/* Left polaroid - flies to center and overlaps */}
      <div 
        ref={leftPolaroidRef}
        className="hidden lg:block absolute left-1 xl:left-4 bottom-40 lg:bottom-48 xl:bottom-60 rotate-[6deg] bg-white p-2 lg:p-2.5 pb-6 lg:pb-8 shadow-2xl rounded-sm transition-transform duration-75 will-change-transform cursor-pointer hover:scale-105 hover:z-30"
        style={{ transform: 'rotate(6deg)', transition: 'transform 0.1s linear' }}
      >
        <img
          src="/1.JPG"
          alt="Person"
          className="w-48 lg:w-56 xl:w-64 h-48 lg:h-56 xl:h-64 object-cover"
        />
        <div className="h-5 lg:h-6"></div>
      </div>

      {/* Right polaroid - flies to center and overlaps */}
      <div 
        ref={rightPolaroidRef}
        className="hidden lg:block absolute right-1 xl:right-2 top-10 lg:top-12 xl:top-14 rotate-[-6deg] bg-white p-2 lg:p-2.5 pb-6 lg:pb-8 shadow-2xl rounded-sm transition-transform duration-75 will-change-transform cursor-pointer hover:scale-105 hover:z-30"
        style={{ transform: 'rotate(-6deg)', transition: 'transform 0.1s linear' }}
      >
        <img
          src="/2.JPG"
          alt="Person"
          className="w-48 lg:w-56 xl:w-64 h-48 lg:h-56 xl:h-64 object-cover"
        />
        <div className="h-5 lg:h-6"></div>
      </div>

      {/* Main Content - fades as polaroids collide */}
      <div 
        ref={contentRef}
        className="mt-10 relative z-10 w-full max-w-3xl mx-auto text-center px-2 sm:px-4 transition-all duration-75 will-change-transform"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-medium tracking-tight leading-tight text-black">
          <br className="block sm:hidden" />
          <span className="whitespace-nowrap">
            {typedText}
            {isTyping && <span className="inline-block w-[2px] h-[1em] bg-black ml-[2px] animate-pulse" />}
          </span>
        </h1>

        <h2 className="font-medium mt-1 sm:mt-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight text-black">
          Story is your{" "}
          <span className="relative mr-[-5] ml-[-5] px-1 sm:px-2 text-black font-medium font-editorial italic inline-block">
            sharpest
            {showSharpestImage && (
              <span className="absolute inset-0 -z-10 overflow-hidden">
                <img
                  src="/Landing/HERO/1.png"
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-90 swipe-animation"
                  style={{ objectPosition: 'center', clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }}
                />
              </span>
            )}
          </span>{" "}
          business tool.
        </h2>

        <p className="font-helvetica mt-4 sm:mt-5 md:mt-6 text-sm sm:text-base md:text-md text-black leading-relaxed max-w-2xl mx-auto px-4 sm:px-6">
          I'm a communications strategist who helps food businesses and ambitious
          professionals figure out what they actually stand for and say it in a
          way that moves people. 12 years, 4 countries, one obsession: the
          stories that make businesses grow.
        </p>

        <div className="mt-6 sm:mt-7 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center">
          <button 
            className="font-helvetica border-2 px-5 sm:px-6 py-2 rounded-full bg-yellow-400 font-medium shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200 active:scale-95 text-sm sm:text-base text-black"
            onClick={createCalendarEvent}
          >
            Work with me
          </button>

          <button 
            className="font-helvetica border-2 px-5 sm:px-6 py-2 rounded-full bg-green-200 font-medium shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200 active:scale-95 text-sm sm:text-base text-black"
            onClick={navigateToWork}
          >
            Read my thinking
          </button>
        </div>

        <p className="font-editorial mt-10 sm:mt-12 md:mt-40 text-base sm:text-lg md:text-xl text-black leading-relaxed">
          Philippines · UK · Australia · Bhutan
          <br />
          12 years in food communications
        </p>
      </div>
      
      <style jsx>{`
        @keyframes swipeLeftToRight {
          0% {
            clip-path: polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%);
          }
          100% {
            clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
          }
        }
        .swipe-animation {
          animation: swipeLeftToRight 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
}