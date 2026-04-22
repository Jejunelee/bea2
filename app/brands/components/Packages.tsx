"use client";

import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { supabase } from "@/app/lib/supabase/client";
import type { BrandPackagesSettings, BrandPackagesItem } from "@/app/types/brandpackages";

export default function BrandPackages() {
  const [settings, setSettings] = useState<Partial<BrandPackagesSettings>>({});
  const [packages, setPackages] = useState<BrandPackagesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false 
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Default fallback data
  const defaultPackages: BrandPackagesItem[] = [
    {
      id: 1,
      display_order: 1,
      tag: "For Brands",
      tag_color: "#FED301",
      title: "Messaging and Asset Sprint",
      subtitle: "The story foundation that makes everything else easier.",
      description: "Over 2 to 3 weeks, we build the messaging architecture, brand narrative, and core assets that make everything else in your business easier: pitches, content, press, partnerships. This is for brands that are ready to stop guessing and start compounding.",
      bullets: [
        "Brand narrative and messaging framework",
        "Core copy assets — bio, about page, homepage",
        "Content direction and tone guidelines"
      ],
      button_text: "From £1,500 / flat fee, fixed scope",
      bg_image_url: "/Landing/Package1.png",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      display_order: 2,
      tag: "For Individuals",
      tag_color: "#B2D235",
      title: "Content and Influence System",
      subtitle: "90 days. The whole engine. Built to last.",
      description: "Full origin story. Content system built from scratch. Team hired and briefed. Revenue stream mapped. Monthly strategy calls included. This is the engagement for brands and founders who are serious about building something that compounds over time.",
      bullets: [
        "Full narrative and content architecture",
        "Editor or team hired and onboarded",
        "Monthly advisory calls included"
      ],
      button_text: "From £2,500 / 90-day engagement",
      bg_image_url: "/Landing/Package2.png",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const defaultSettings: Partial<BrandPackagesSettings> = {
    background_color: "#ffffff",
    section_title: "DEEPER ENGAGEMENTS: WHEN YOU'RE READY TO BUILD",
    cta_title: "Not sure what works for you?",
    cta_subtitle: "Let's talk about it!",
    cta_button_text: "Book a call",
    cta_button_color: "#FF7A95",
    cta_button_text_color: "#000000",
    calendar_event_title: "Exploratory Call",
    calendar_event_details: "Hi, I'm reaching out to discuss which package would work best for my business.",
    calendar_event_location: "Google Meet",
    calendar_event_email: "bea@gmail.com"
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching brand packages data...");
        
        // Fetch settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('brand_packages_settings')
          .select('*')
          .eq('id', 1)
          .single();
        
        if (settingsError) {
          console.error("Settings error:", settingsError);
          setError(settingsError.message);
          setSettings(defaultSettings);
        } else if (settingsData) {
          console.log("Settings loaded:", settingsData);
          setSettings(settingsData);
        }

        // Fetch packages
        const { data: packagesData, error: packagesError } = await supabase
          .from('brand_packages_items')
          .select('*')
          .order('display_order', { ascending: true });
        
        if (packagesError) {
          console.error("Packages error:", packagesError);
          setError(packagesError.message);
          setPackages(defaultPackages);
        } else if (packagesData && packagesData.length > 0) {
          console.log("Packages loaded:", packagesData);
          setPackages(packagesData);
        } else {
          setPackages(defaultPackages);
        }

        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load data");
        setPackages(defaultPackages);
        setSettings(defaultSettings);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    if (!currentSection || loading) return;

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
  }, [hasAnimated, loading]);

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
      `&text=${encodeURIComponent(settings.calendar_event_title || 'Exploratory Call')}` +
      `&dates=${startTime}/${endTime}` +
      `&details=${encodeURIComponent(settings.calendar_event_details || 'Hi, I\'m reaching out to discuss which package would work best for my business.')}` +
      `&location=${encodeURIComponent(settings.calendar_event_location || 'Google Meet')}` +
      `&add=${settings.calendar_event_email || 'bea@gmail.com'}`;
    
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="w-full py-16 flex items-center justify-center" style={{ backgroundColor: '#ffffff', minHeight: '400px' }}>
        <div className="text-gray-500">Loading packages...</div>
      </div>
    );
  }

  const displayPackages = packages.length > 0 ? packages : defaultPackages;
  const displaySettings = Object.keys(settings).length > 0 ? settings : defaultSettings;

  // ========== MOBILE LAYOUT ==========
  if (isMobile) {
    return (
      <section ref={sectionRef} className="w-full py-12 px-4" style={{ backgroundColor: displaySettings.background_color || '#ffffff' }}>
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-8 transition-all duration-700 ease-out ${
              hasAnimated
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-base font-medium text-black tracking-tight">
              {displaySettings.section_title || "DEEPER ENGAGEMENTS: WHEN YOU'RE READY TO BUILD"}
            </h2>
          </div>

          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4">
                {displayPackages.map((pkg) => (
                  <div key={pkg.id} className="flex-[0_0_85%] min-w-0">
                    <div
                      className="relative rounded-2xl border-2 border-black p-5 shadow-sm overflow-hidden h-full"
                      style={{
                        backgroundImage: `url('${pkg.bg_image_url}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="absolute inset-0 bg-white/40 backdrop-blur-md rounded-2xl" />
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="mb-3">
                          <span
                            className="px-3 py-0.5 text-xs font-semibold rounded-full border border-black inline-block"
                            style={{ backgroundColor: pkg.tag_color, color: '#000000' }}
                          >
                            {pkg.tag}
                          </span>
                        </div>

                        <h2 className="text-xl font-semibold text-black leading-tight mb-2">
                          {pkg.title}
                        </h2>

                        <p className="text-black mb-3 leading-relaxed text-lg font-editorial">
                          {pkg.subtitle}
                        </p>

                        <p className="text-black mb-3 leading-tight text-sm opacity-80">
                          {pkg.description}
                        </p>

                        <div className="space-y-1 text-black mb-4 text-sm flex-grow">
                          {pkg.bullets.map((bullet, idx) => (
                            <li key={idx} className="list-none">• {bullet}</li>
                          ))}
                        </div>

                        <div className="flex justify-end mt-auto">
                          <button className="bg-black text-white px-3 py-1.5 rounded-full text-xs hover:opacity-80 transition">
                            {pkg.button_text}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {displayPackages.map((_, idx) => (
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

          <div
            className={`font-helvetica text-center mt-10 transition-all duration-700 delay-300 ease-out ${
              hasAnimated
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <p className="font-helvetica text-black font-medium text-2xl mb-1">
              {displaySettings.cta_title || "Not sure what works for you?"}
            </p>
            <p className="font-helvetica text-black text-lg mb-4">
              {displaySettings.cta_subtitle || "Let's talk about it!"}
            </p>
            <button
              onClick={createCalendarEvent}
              className="px-5 py-1 rounded-full text-black text-base font-medium border-2 border-black hover:opacity-80 transition"
              style={{ 
                backgroundColor: displaySettings.cta_button_color || '#FF7A95',
                color: displaySettings.cta_button_text_color || '#000000'
              }}
            >
              {displaySettings.cta_button_text || "Book a call"}
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ========== DESKTOP LAYOUT ==========
  return (
    <section ref={sectionRef} className="w-full py-16 px-6" style={{ backgroundColor: displaySettings.background_color || '#ffffff' }}>
      <div className="max-w-7xl mx-auto">
        <div
          className={`text-center mb-12 transition-all duration-700 ease-out ${
            hasAnimated
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-xl md:text-xl lg:text-2xl font-medium text-black tracking-tight">
            {displaySettings.section_title || "DEEPER ENGAGEMENTS: WHEN YOU'RE READY TO BUILD"}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {displayPackages.map((pkg, idx) => (
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
                backgroundImage: `url('${pkg.bg_image_url}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-white/40 backdrop-blur-md rounded-2xl" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="px-3 py-0.5 text-xs font-semibold rounded-full border border-black"
                    style={{ backgroundColor: pkg.tag_color, color: '#000000' }}
                  >
                    {pkg.tag}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-semibold text-black leading-tight mb-2">
                  {pkg.title}
                </h2>

                <p className="text-black mb-4 leading-relaxed text-2xl font-editorial">
                  {pkg.subtitle}
                </p>

                <p className="text-black mb-4 leading-tight text-lg opacity-80">
                  {pkg.description}
                </p>

                <div className="space-y-1 text-black mb-5 text-lg flex-grow">
                  {pkg.bullets.map((bullet, bulletIdx) => (
                    <li key={bulletIdx} className="list-none">• {bullet}</li>
                  ))}
                </div>

                <div className="flex justify-end mt-auto">
                  <button className="bg-black text-white px-4 py-1.5 rounded-full text-md hover:opacity-80 transition">
                    {pkg.button_text}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`font-helvetica text-center mt-16 transition-all duration-700 delay-300 ease-out ${
            hasAnimated
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <p className="font-helvetica text-black font-medium text-4xl mb-1">
            {displaySettings.cta_title || "Not sure what works for you?"}
          </p>
          <p className="font-helvetica text-black text-2xl font-base mb-4">
            {displaySettings.cta_subtitle || "Let's talk about it!"}
          </p>
          <button
            onClick={createCalendarEvent}
            className="px-6 py-0.5 rounded-full text-black text-lg font-medium border-2 border-black hover:opacity-80 transition"
            style={{ 
              backgroundColor: displaySettings.cta_button_color || '#FF7A95',
              color: displaySettings.cta_button_text_color || '#000000'
            }}
          >
            {displaySettings.cta_button_text || "Book a call"}
          </button>
        </div>
      </div>
    </section>
  );
}