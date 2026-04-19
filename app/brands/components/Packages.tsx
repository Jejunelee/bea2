"use client";

import { useEffect, useRef, useState } from "react";

export default function Packages() {
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

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
      "&details=Hi,+I'm+reaching+out+to+discuss+which+package+would+work+best+for+my+business." +
      "&location=Google+Meet" +
      "&add=bea@gmail.com";
    
    // Open in new window
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    const currentSection = sectionRef.current;
    if (!currentSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 20% of the section is visible
        rootMargin: "0px 0px -100px 0px", // Slight offset for better UX
      }
    );

    observer.observe(currentSection);

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, [hasAnimated]);

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 px-6 bg-[#ffffff]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Title - Fade up animation */}
        <div
          className={`text-center mb-12 transition-all duration-700 ease-out ${
            hasAnimated
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-xl md:text-xl lg:text-2xl font-medium text-black tracking-tight">
            DEEPER ENGAGEMENTS: WHEN YOU'RE READY TO BUILD
          </h2>
        </div>

        {/* Grid Container for Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1 - Messaging and Asset Sprint */}
          <div
            className={`relative rounded-2xl border-2 border-black p-6 shadow-sm overflow-hidden transition-all duration-700 delay-100 ease-out ${
              hasAnimated
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
            style={{
              backgroundImage: "url('/Landing/Package1.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md rounded-2xl -z-0" />

            {/* Content */}
            <div className="relative z-10">
              {/* Tag Row */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className="px-3 py-0.5 text-xs font-semibold rounded-full border border-black"
                  style={{ backgroundColor: '#FED301', color: '#000000' }}
                >
                  For Brands
                </span>

                <span className="text-xs text-black"></span>
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-semibold text-black leading-tight mb-2">
                Messaging and Asset Sprint
              </h2>

              {/* Subtitle */}
              <p className="text-black mb-4 leading-relaxed text-2xl font-editorial ">
                The story foundation that makes everything else easier.
              </p>

              {/* Description */}
              <p className="text-black mb-4 leading-tight text-lg opacity-80">
                Over 2 to 3 weeks, we build the messaging architecture, brand narrative, and core assets that make everything else in your business easier: pitches, content, press, partnerships. This is for brands that are ready to stop guessing and start compounding.
              </p>

              {/* Bullet Points */}
              <div className="space-y-1 text-black mb-5 text-lg">
                <li className="list-none">• Brand narrative and messaging framework</li>
                <li className="list-none">• Core copy assets — bio, about page, homepage</li>
                <li className="list-none">• Content direction and tone guidelines</li>
              </div>

              {/* Button */}
              <div className="flex justify-end">
                <button className="bg-black text-white px-4 py-1.5 rounded-full text-md hover:opacity-80 transition">
                  From £1,500 / flat fee, fixed scope
                </button>
              </div>
            </div>
          </div>

          {/* Card 2 - Content and Influence System */}
          <div
            className={`relative rounded-2xl border-2 border-black p-6 shadow-sm overflow-hidden transition-all duration-700 delay-200 ease-out ${
              hasAnimated
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
            style={{
              backgroundImage: "url('/Landing/Package2.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md rounded-2xl -z-0" />

            {/* Content */}
            <div className="relative z-10">
              {/* Tag Row */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className="px-3 py-0.5 text-xs font-semibold rounded-full border border-black"
                  style={{ backgroundColor: '#B2D235', color: '#000000' }}
                >
                  For Individuals
                </span>

                <span className="text-xs text-black"></span>
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-semibold text-black leading-tight mb-2">
                Content and Influence System
              </h2>

              {/* Subtitle */}
              <p className="font-editorial text-black mb-4 leading-relaxed text-2xl">
                90 days. The whole engine. Built to last.
              </p>

              {/* Description */}
              <p className="text-black mb-4 leading-tight text-lg opacity-80">
                Full origin story. Content system built from scratch. Team hired and briefed. Revenue stream mapped. Monthly strategy calls included. This is the engagement for brands and founders who are serious about building something that compounds over time, not just content that gets consumed and forgotten.
              </p>

              {/* Bullet Points */}
              <div className="space-y-1 text-black mb-5 text-lg">
                <li className="list-none">• Full narrative and content architecture</li>
                <li className="list-none">• Editor or team hired and onboarded</li>
                <li className="list-none">• Monthly advisory calls included</li>
              </div>

              {/* Button */}
              <div className="flex justify-end">
                <button className="bg-black text-white px-4 py-1.5 rounded-full text-md hover:opacity-80 transition">
                  From £2,500 / 90-day engagement
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section - Fade up with delay */}
        <div
          className={`font-helvetica text-center mt-16 transition-all duration-700 delay-300 ease-out ${
            hasAnimated
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <p className="font-helvetica text-black font-medium text-4xl mb-1">Not sure what works for you?</p>
          <p className="font-helvetica text-black text-2xl font-base mb-4">Let's talk about it!</p>
          <button
            onClick={createCalendarEvent}
            className="px-6 py-0.5 rounded-full text-black text-lg font-medium border-2 border-black hover:opacity-80 transition"
            style={{ backgroundColor: '#FF7A95' }}
          >
            Book a call
          </button>
        </div>
      </div>
    </section>
  );
}