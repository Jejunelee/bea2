"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { supabase } from "@/app/lib/supabase/client";
import type { PackagesSettings, PackagesItem } from "@/app/types/packages";

export default function Packages() {
  const [settings, setSettings] = useState<Partial<PackagesSettings>>({});
  const [packages, setPackages] = useState<PackagesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false 
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch settings
      const { data: settingsData } = await supabase
        .from('packages_settings')
        .select('*')
        .eq('id', 1)
        .single();
      if (settingsData) setSettings(settingsData);

      // Fetch packages
      const { data: packagesData } = await supabase
        .from('packages_items')
        .select('*')
        .order('display_order', { ascending: true });
      if (packagesData) setPackages(packagesData);

      setLoading(false);
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

  if (loading) {
    return <div className="w-full py-16 bg-[#f5f3ef]"></div>;
  }

  // Helper function to render title with italic words
  const renderTitle = (title: string, italicWords: string[]) => {
    const words = title.split(' ');
    return words.map((word, i) => {
      const isItalic = italicWords.some(italicWord => 
        word.toLowerCase().includes(italicWord.toLowerCase())
      );
      return isItalic ? (
        <em key={i} className="font-serif italic font-normal">{word} </em>
      ) : (
        <span key={i}>{word} </span>
      );
    });
  };

  // ========== MOBILE LAYOUT ==========
  if (isMobile) {
    return (
      <section 
        className={`w-full ${settings.section_padding_mobile || 'py-12 px-4'}`}
        style={{ backgroundColor: settings.background_color || '#f5f3ef' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4">
                {packages.map((pkg) => (
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
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className="px-3 py-0.5 text-xs font-semibold rounded-full border border-black"
                            style={{ backgroundColor: pkg.tag_color, color: '#000000' }}
                          >
                            {pkg.tag}
                          </span>
                          <span className="text-xs text-black">{pkg.tag_subtext}</span>
                        </div>

                        <h2 className="text-lg font-semibold text-black leading-tight mb-3">
                          {renderTitle(pkg.title, pkg.italic_words)}
                        </h2>

                        <p className="text-black mb-3 leading-relaxed text-xs opacity-80">
                          {pkg.description}
                        </p>

                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-black mb-4 text-xs flex-grow">
                          {pkg.bullets.map((bullet, idx) => (
                            <li key={idx} className="list-none">• {bullet}</li>
                          ))}
                        </div>

                        <div className="flex justify-end mt-auto">
                          <a href={pkg.button_link}>
                            <button className="bg-black text-white px-3 py-1.5 rounded-full text-xs hover:opacity-80 transition">
                              {pkg.button_text}
                            </button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {packages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => emblaApi?.scrollTo(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === selectedIndex 
                      ? "w-6 bg-black" 
                      : "w-2 bg-gray-400"
                  }`}
                  aria-label={`Go to package ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ========== DESKTOP LAYOUT ==========
  return (
    <section 
      className={`w-full ${settings.section_padding_desktop || 'py-16 px-6'}`}
      style={{ backgroundColor: settings.background_color || '#f5f3ef' }}
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="relative rounded-2xl border-2 border-black p-6 shadow-sm overflow-hidden h-full"
            style={{
              backgroundImage: `url('${pkg.bg_image_url}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md rounded-2xl -z-0" />

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <span
                  className="px-3 py-0.5 text-xs font-semibold rounded-full border border-black"
                  style={{ backgroundColor: pkg.tag_color, color: '#000000' }}
                >
                  {pkg.tag}
                </span>
                <span className="text-xs text-black">{pkg.tag_subtext}</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-semibold text-black leading-tight mb-4">
                {renderTitle(pkg.title, pkg.italic_words)}
              </h2>

              <p className="text-black mb-4 leading-relaxed text-sm opacity-80">
                {pkg.description}
              </p>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-black mb-5 text-sm flex-grow">
                {pkg.bullets.map((bullet, idx) => (
                  <li key={idx} className="list-none">• {bullet}</li>
                ))}
              </div>

              <div className="flex justify-end mt-auto">
                <a href={pkg.button_link}>
                  <button className="bg-black text-white px-4 py-1.5 rounded-full text-xs hover:opacity-80 transition">
                    {pkg.button_text}
                  </button>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}