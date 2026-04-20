"use client";

import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

export default function Packages() {
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false 
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    observer.observe(currentSection);

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, [hasAnimated]);

  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    
    emblaApi.on("select", onSelect);
    onSelect();
    
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // CREATE CALENDAR EVENT
  const createCalendarEvent = () => {
    const startDate = new Date();
    startDate.setHours(startDate.getHours() + 1);
    
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);
    
    const formatDateForGoogle = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const startTime = formatDateForGoogle(startDate);
    const endTime = formatDateForGoogle(endDate);
    
    const url = 
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=Exploratory+Call" +
      `&dates=${startTime}/${endTime}` +
      "&details=Hi,+I'm+reaching+out+to+discuss+which+package+would+work+best+for+my+business." +
      "&location=Google+Meet" +
      "&add=bea@gmail.com";
    
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const packages = [
    {
      id: 1,
      tag: "For Brands",
      tagColor: "#FED301",
      title: "Messaging and Asset Sprint",
      subtitle: "The story foundation that makes everything else easier.",
      description: "Over 2 to 3 weeks, we build the messaging architecture, brand narrative, and core assets that make everything else in your business easier: pitches, content, press, partnerships. This is for brands that are ready to stop guessing and start compounding.",
      bullets: [
        "Brand narrative and messaging framework",
        "Core copy assets — bio, about page, homepage",
        "Content direction and tone guidelines"
      ],
      button: "From £1,500 / flat fee, fixed scope",
      bgImage: "/Landing/Package1.png"
    },
    {
      id: 2,
      tag: "For Individuals",
      tagColor: "#B2D235",
      title: "Content and Influence System",
      subtitle: "90 days. The whole engine. Built to last.",
      description: "Full origin story. Content system built from scratch. Team hired and briefed. Revenue stream mapped. Monthly strategy calls included. This is the engagement for brands and founders who are serious about building something that compounds over time.",
      bullets: [
        "Full narrative and content architecture",
        "Editor or team hired and onboarded",
        "Monthly advisory calls included"
      ],
      button: "From £2,500 / 90-day engagement",
      bgImage: "/Landing/Package2.png"
    }
  ];

  // ========== MOBILE LAYOUT (Carousel with equal height cards) ==========
  if (isMobile) {
    return (
      <section ref={sectionRef} className="w-full py-12 px-4 bg-[#ffffff]">
        <div className="max-w-7xl mx-auto">
          {/* Header Title */}
          <div
            className={`text-center mb-8 transition-all duration-700 ease-out ${
              hasAnimated
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-base font-medium text-black tracking-tight">
              DEEPER ENGAGEMENTS: WHEN YOU'RE READY TO BUILD
            </h2>
          </div>

          {/* Carousel with equal height */}
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="flex-[0_0_85%] min-w-0">
                    <div
                      className="relative rounded-2xl border-2 border-black p-5 shadow-sm overflow-hidden h-full"
                      style={{
                        backgroundImage: `url('${pkg.bgImage}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-white/40 backdrop-blur-md rounded-2xl" />

                      {/* Content - Flex column for equal height */}
                      <div className="relative z-10 flex flex-col h-full">
                        {/* Tag */}
                        <div className="mb-3">
                          <span
                            className="px-3 py-0.5 text-xs font-semibold rounded-full border border-black inline-block"
                            style={{ backgroundColor: pkg.tagColor, color: '#000000' }}
                          >
                            {pkg.tag}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-semibold text-black leading-tight mb-2">
                          {pkg.title}
                        </h2>

                        {/* Subtitle */}
                        <p className="text-black mb-3 leading-relaxed text-lg font-editorial">
                          {pkg.subtitle}
                        </p>

                        {/* Description - Condensed */}
                        <p className="text-black mb-3 leading-tight text-sm opacity-80">
                          {pkg.description}
                        </p>

                        {/* Bullet Points - Smaller, pushes button down */}
                        <div className="space-y-1 text-black mb-4 text-sm flex-grow">
                          {pkg.bullets.map((bullet, idx) => (
                            <li key={idx} className="list-none">• {bullet}</li>
                          ))}
                        </div>

                        {/* Button - Stays at bottom */}
                        <div className="flex justify-end mt-auto">
                          <button className="bg-black text-white px-3 py-1.5 rounded-full text-xs hover:opacity-80 transition">
                            {pkg.button}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {packages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => emblaApi?.scrollTo(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === selectedIndex 
                      ? "w-6 bg-black" 
                      : "w-2 bg-gray-300"
                  }`}
                  aria-label={`Go to package ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* CTA Section - Condensed */}
          <div
            className={`font-helvetica text-center mt-10 transition-all duration-700 delay-300 ease-out ${
              hasAnimated
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <p className="font-helvetica text-black font-medium text-2xl mb-1">
              Not sure what works for you?
            </p>
            <p className="font-helvetica text-black text-lg mb-4">
              Let's talk about it!
            </p>
            <button
              onClick={createCalendarEvent}
              className="px-5 py-1 rounded-full text-black text-base font-medium border-2 border-black hover:opacity-80 transition"
              style={{ backgroundColor: '#FF7A95' }}
            >
              Book a call
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ========== DESKTOP LAYOUT (Original) ==========
  return (
    <section ref={sectionRef} className="w-full py-16 px-6 bg-[#ffffff]">
      <div className="max-w-7xl mx-auto">
        {/* Header Title */}
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
          {packages.map((pkg, idx) => (
            <div
              key={pkg.id}
              className={`relative rounded-2xl border-2 border-black p-6 shadow-sm overflow-hidden transition-all duration-700 ${
                idx === 0 ? "delay-100" : "delay-200"
              } ease-out ${
                hasAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{
                backgroundImage: `url('${pkg.bgImage}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-white/40 backdrop-blur-md rounded-2xl" />

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                {/* Tag Row */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="px-3 py-0.5 text-xs font-semibold rounded-full border border-black"
                    style={{ backgroundColor: pkg.tagColor, color: '#000000' }}
                  >
                    {pkg.tag}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-semibold text-black leading-tight mb-2">
                  {pkg.title}
                </h2>

                {/* Subtitle */}
                <p className="text-black mb-4 leading-relaxed text-2xl font-editorial">
                  {pkg.subtitle}
                </p>

                {/* Description */}
                <p className="text-black mb-4 leading-tight text-lg opacity-80">
                  {pkg.description}
                </p>

                {/* Bullet Points */}
                <div className="space-y-1 text-black mb-5 text-lg flex-grow">
                  {pkg.bullets.map((bullet, bulletIdx) => (
                    <li key={bulletIdx} className="list-none">• {bullet}</li>
                  ))}
                </div>

                {/* Button */}
                <div className="flex justify-end mt-auto">
                  <button className="bg-black text-white px-4 py-1.5 rounded-full text-md hover:opacity-80 transition">
                    {pkg.button}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div
          className={`font-helvetica text-center mt-16 transition-all duration-700 delay-300 ease-out ${
            hasAnimated
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <p className="font-helvetica text-black font-medium text-4xl mb-1">
            Not sure what works for you?
          </p>
          <p className="font-helvetica text-black text-2xl font-base mb-4">
            Let's talk about it!
          </p>
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