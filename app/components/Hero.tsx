"use client";

import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase/client";
import type { HeroContent } from "@/app/types/hero";

export default function Hero() {
  const router = useRouter();
  const leftPolaroidRef = useRef<HTMLDivElement>(null);
  const rightPolaroidRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // State for dynamic content
  const [heroContent, setHeroContent] = useState<Partial<HeroContent>>({});
  const [leftPolaroidImage, setLeftPolaroidImage] = useState("/1.JPG");
  const [rightPolaroidImage, setRightPolaroidImage] = useState("/2.JPG");
  const [sharpestImage, setSharpestImage] = useState("/Landing/HERO/1.png");
  const [contentLoaded, setContentLoaded] = useState(false);

  // Typing animation state
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showSharpestImage, setShowSharpestImage] = useState(false);
  const [hasStartedAnimation, setHasStartedAnimation] = useState(false);
  const [fullText, setFullText] = useState("Bea Trinidad · Type Harder Studio");

  // Fetch content from Supabase
  useEffect(() => {
    const fetchHeroContent = async () => {
      // Fetch text content
      const { data: contentData } = await supabase
        .from('hero_content')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (contentData) {
        setHeroContent(contentData);
        setFullText(contentData.typed_text || "Bea Trinidad · Type Harder Studio");
      }

      // Fetch images
      const { data: imagesData } = await supabase
        .from('hero_images')
        .select('*');
      
      if (imagesData) {
        imagesData.forEach(img => {
          if (img.image_key === 'left_polaroid' && img.image_url) {
            setLeftPolaroidImage(img.image_url);
          } else if (img.image_key === 'right_polaroid' && img.image_url) {
            setRightPolaroidImage(img.image_url);
          } else if (img.image_key === 'sharpest_image' && img.image_url) {
            setSharpestImage(img.image_url);
          }
        });
      }
      
      setContentLoaded(true);
    };

    fetchHeroContent();
  }, []);

  // CREATE CALENDAR EVENT
  const createCalendarEvent = () => {
    const startDate = new Date();
    startDate.setHours(startDate.getHours() + 1);

    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);

    const formatDateForGoogle = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const startTime = formatDateForGoogle(startDate);
    const endTime = formatDateForGoogle(endDate);

    const url =
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=Exploratory+Call" +
      `&dates=${startTime}/${endTime}` +
      "&details=Hi,+I'm+reaching+out+to+discuss+how+we+can+work+together+on+storytelling+and+communications." +
      "&location=Google+Meet" +
      "&add=bea@gmail.com";

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const navigateToWork = () => {
    router.push("/work");
  };

  // Determine which buttons to show
  const showButton1 = heroContent.button1_text && heroContent.button1_text.trim() !== '';
  const showButton2 = heroContent.button2_text && heroContent.button2_text.trim() !== '';
  const buttonsCount = (showButton1 ? 1 : 0) + (showButton2 ? 1 : 0);

  // Typing animation effect
  useEffect(() => {
    if (!hasStartedAnimation || !contentLoaded) return;

    if (isTyping) {
      if (typedText.length < fullText.length) {
        const timeout = setTimeout(() => {
          setTypedText(fullText.slice(0, typedText.length + 1));
        }, 80);
        return () => clearTimeout(timeout);
      } else {
        setIsTyping(false);
        setTimeout(() => {
          setShowSharpestImage(true);
        }, 100);
      }
    }
  }, [typedText, isTyping, hasStartedAnimation, fullText, contentLoaded]);

  // Scroll animation effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const speed = 0.6;
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

      let maxMoveX, maxMoveY, maxRotateChange;

      if (isMobile) {
        maxMoveX = 60;
        maxMoveY = 30;
        maxRotateChange = 2;
      } else if (isTablet) {
        maxMoveX = 120;
        maxMoveY = 70;
        maxRotateChange = 4;
      } else {
        maxMoveX = 400;
        maxMoveY = 120;
        maxRotateChange = 8;
      }

      if (leftPolaroidRef.current) {
        const leftMoveX = Math.min(scrollY * speed, maxMoveX);
        const leftMoveY = Math.min(scrollY * speed * 0.5, maxMoveY);
        const leftRotate = Math.max(0, 6 - scrollY * 0.02);
        const finalRotate = Math.max(0, leftRotate - maxRotateChange / 2);
        leftPolaroidRef.current.style.transform = `translate(${leftMoveX}px, -${leftMoveY}px) rotate(${finalRotate}deg)`;
        leftPolaroidRef.current.style.zIndex = Math.min(15, Math.floor(scrollY / 30) + 5).toString();
      }

      if (rightPolaroidRef.current) {
        const rightMoveX = Math.min(scrollY * speed, maxMoveX);
        const rightMoveY = Math.min(scrollY * speed * 0.5, maxMoveY);
        const rightRotate = Math.max(0, -6 + scrollY * 0.02);
        const finalRotate = Math.min(0, rightRotate + maxRotateChange / 2);
        
        const isDesktop = window.innerWidth >= 1024;
        const yMovement = isDesktop ? -rightMoveY : rightMoveY;
        
        rightPolaroidRef.current.style.transform = `translate(-${rightMoveX}px, ${yMovement}px) rotate(${finalRotate}deg)`;
        rightPolaroidRef.current.style.zIndex = Math.min(15, Math.floor(scrollY / 30) + 5).toString();
      }

      if (contentRef.current) {
        const opacity = Math.max(0.3, 1 - scrollY * 0.006);
        const scale = Math.max(0.85, 1 - scrollY * 0.0015);
        contentRef.current.style.opacity = opacity.toString();
        contentRef.current.style.transform = `scale(${scale})`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStartedAnimation && contentLoaded) {
            setHasStartedAnimation(true);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasStartedAnimation, contentLoaded]);

  if (!contentLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center lg:items-center items-start justify-center overflow-x-hidden overflow-y-visible px-4 sm:px-6 py-12 sm:py-16 font-helvetica"
    >
      {/* Left polaroid */}
      <div
        ref={leftPolaroidRef}
        className="absolute left-2 sm:left-4 md:left-8 lg:left-1 xl:left-4 bottom-20 sm:bottom-28 md:bottom-36 lg:bottom-40 xl:bottom-60 rotate-[6deg] bg-white p-1.5 sm:p-2 lg:p-2.5 pb-4 sm:pb-5 lg:pb-8 shadow-2xl rounded-sm transition-transform duration-75 will-change-transform cursor-pointer hover:scale-105 hover:z-30"
        style={{ transform: "rotate(6deg)", transition: "transform 0.1s linear" }}
      >
        <img
          src={leftPolaroidImage}
          alt="Person"
          className="w-40 sm:w-32 md:w-40 lg:w-56 xl:w-64 h-40 sm:h-32 md:h-40 lg:h-56 xl:h-64 object-cover"
        />
        <div className="h-3 sm:h-4 lg:h-6"></div>
      </div>

      {/* Right polaroid */}
      <div
        ref={rightPolaroidRef}
        className="absolute right-2 sm:right-4 md:right-8 lg:right-1 xl:right-2 lg:top-12 xl:top-14 bottom-20 sm:bottom-28 md:bottom-36 lg:bottom-auto rotate-[-6deg] bg-white p-1.5 sm:p-2 lg:p-2.5 pb-4 sm:pb-5 lg:pb-8 shadow-2xl rounded-sm transition-transform duration-75 will-change-transform cursor-pointer hover:scale-105 hover:z-30"
        style={{ transform: "rotate(-6deg)", transition: "transform 0.1s linear" }}
      >
        <img
          src={rightPolaroidImage}
          alt="Person"
          className="w-40 sm:w-32 md:w-40 lg:w-56 xl:w-64 h-40 sm:h-32 md:h-40 lg:h-56 xl:h-64 object-cover"
        />
        <div className="h-3 sm:h-4 lg:h-6"></div>
      </div>

      {/* Main Content */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-3xl mx-auto text-center px-4 sm:px-6 transition-all duration-75 will-change-transform lg:mt-0 -mt-8 sm:-mt-12 md:-mt-16"
      >
        <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl font-medium tracking-tight leading-tight text-black">
          <br className="block sm:hidden" />
          <span className="whitespace-normal break-words inline-block max-w-full">
            {hasStartedAnimation ? typedText : ""}
            {hasStartedAnimation && isTyping && (
              <span className="inline-block w-[2px] h-[1em] bg-black ml-[2px] animate-pulse" />
            )}
          </span>
        </h1>

        <h2 className="font-medium mt-2 sm:mt-3 md:mt-4 text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl leading-tight text-black">
          {heroContent.subheading_text?.split('Sharper')[0]}
          <span className="relative inline-block px-1 sm:px-2 text-black font-medium font-editorial italic">
            Sharper
            {hasStartedAnimation && showSharpestImage && (
              <span className="absolute inset-0 -z-10 overflow-hidden">
                <img
                  src={sharpestImage}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-90 swipe-animation"
                  style={{
                    objectPosition: "center",
                    clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
                  }}
                />
              </span>
            )}
          </span>
          {heroContent.subheading_text?.split('Sharper')[1]}
        </h2>

        <p className="font-helvetica mt-3 sm:mt-4 md:mt-6 text-xs sm:text-sm md:text-base text-black leading-relaxed max-w-2xl mx-auto px-2 sm:px-6">
          {heroContent.description_text}
        </p>

        {/* Dynamic Buttons Section */}
        <div className={`mt-5 sm:mt-6 md:mt-8 flex justify-center items-center ${
          buttonsCount === 1 ? 'w-full' : 'flex-col sm:flex-row gap-2 sm:gap-4 md:gap-5'
        }`}>
          {buttonsCount === 1 && showButton1 && (
            <button
              className="font-helvetica border-2 px-8 sm:px-10 md:px-12 py-3 sm:py-2 rounded-full bg-yellow-400 font-medium shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200 active:scale-95 text-base sm:text-lg md:text-xl text-black w-full sm:w-auto min-w-[200px] sm:min-w-[250px] cursor-pointer"
              onClick={createCalendarEvent}
            >
              {heroContent.button1_text}
            </button>
          )}
          
          {buttonsCount === 1 && showButton2 && (
            <button
              className="font-helvetica border-2 px-8 sm:px-10 md:px-12 py-2 sm:py-2 rounded-full bg-green-200 font-medium shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200 active:scale-95 text-base sm:text-lg md:text-xl text-black w-full sm:w-auto min-w-[200px] sm:min-w-[250px] cursor-pointer"
              onClick={navigateToWork}
            >
              {heroContent.button2_text}
            </button>
          )}

          {buttonsCount === 2 && (
            <>
              <button
                className="font-helvetica border-2 px-5 sm:px-6 md:px-7 py-2 sm:py-2.5 rounded-full bg-yellow-400 font-medium shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200 active:scale-95 text-sm sm:text-base text-black w-full sm:w-auto cursor-pointer"
                onClick={createCalendarEvent}
              >
                {heroContent.button1_text}
              </button>

              <button
                className="font-helvetica border-2 px-5 sm:px-6 md:px-7 py-2 sm:py-2.5 rounded-full bg-green-200 font-medium shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200 active:scale-95 text-sm sm:text-base text-black w-full sm:w-auto cursor-pointer"
                onClick={navigateToWork}
              >
                {heroContent.button2_text}
              </button>
            </>
          )}
        </div>

        <p 
          className="font-editorial mt-8 sm:mt-10 md:mt-16 lg:mt-24 xl:mt-32 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-black leading-relaxed"
          dangerouslySetInnerHTML={{ __html: heroContent.footer_text || '' }}
        />
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
        @keyframes pulse {
          0%,
          100% {
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