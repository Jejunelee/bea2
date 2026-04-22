"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { supabase } from "@/app/lib/supabase/client";
import type { AboutMeSettings, AboutMeCountry, AboutMeParagraph, AboutMeImage } from "@/app/types/aboutme";

export default function AboutMe() {
  // Component for Mac-like window header with image name
  const MacHeader = ({ imageName }: { imageName: string }) => (
    <div className="px-3 pt-0.5 pb-0.5" style={{ backgroundColor: "#cccccc" }}>
      <div className="text-xs text-gray-700 font-mono truncate">
        {imageName}
      </div>
    </div>
  );

  const sectionRef = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false 
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // State for dynamic content
  const [settings, setSettings] = useState<Partial<AboutMeSettings>>({});
  const [countries, setCountries] = useState<AboutMeCountry[]>([]);
  const [paragraphs, setParagraphs] = useState<AboutMeParagraph[]>([]);
  const [images, setImages] = useState<AboutMeImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch settings
      const { data: settingsData } = await supabase
        .from('about_me_settings')
        .select('*')
        .eq('id', 1)
        .single();
      if (settingsData) setSettings(settingsData);

      // Fetch countries
      const { data: countriesData } = await supabase
        .from('about_me_countries')
        .select('*')
        .order('display_order', { ascending: true });
      if (countriesData) setCountries(countriesData);

      // Fetch paragraphs
      const { data: paragraphsData } = await supabase
        .from('about_me_paragraphs')
        .select('*')
        .order('display_order', { ascending: true });
      if (paragraphsData) setParagraphs(paragraphsData);

      // Fetch images
      const { data: imagesData } = await supabase
        .from('about_me_images')
        .select('*');
      if (imagesData) setImages(imagesData);

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
      { threshold: 0.3 }
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

  // Helper function to get image by key
  const getImageByKey = (key: string) => images.find(img => img.image_key === key);

  if (loading) {
    return <div className="relative w-full py-24 bg-[#FEFDF8]"></div>;
  }

  // Get images
  const ccaImage = getImageByKey('cca');
  const europeImage = getImageByKey('europe');
  const tequilaImage = getImageByKey('tequila');
  const bhutanImage = getImageByKey('bhutan');
  const phstarImage = getImageByKey('phstar');
  const abroadImage = getImageByKey('abroad');

  // Create images array for mobile carousel
  const mobileImages = [
    { src: ccaImage?.image_url || "/Landing/AboutMe/1.png", name: ccaImage?.image_name || "cca.jpg" },
    { src: europeImage?.image_url || "/Landing/AboutMe/2.png", name: europeImage?.image_name || "europe.jpg" },
    { src: tequilaImage?.image_url || "/Landing/AboutMe/3.png", name: tequilaImage?.image_name || "tequila.jpg" },
    { src: bhutanImage?.image_url || "/Landing/AboutMe/4.png", name: bhutanImage?.image_name || "bhutan.jpg" },
    { src: phstarImage?.image_url || "/Landing/AboutMe/5.png", name: phstarImage?.image_name || "phstar.jpg" },
    { src: abroadImage?.image_url || "/Landing/AboutMe/6.png", name: abroadImage?.image_name || "abroad.jpg" },
  ];

  // ========== MOBILE LAYOUT (Carousel) ==========
  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full py-12 bg-[#FEFDF8] font-helvetica"
      >
        <div className="px-4 relative">
          {/* Title */}
          <div className="text-black text-center mb-4">
            <h2 className="text-2xl font-medium tracking-tight">
              {settings.title_prefix || 'Hi,'}{" "}
              <span className="relative inline-block">
                <span className="relative z-10"> I'm </span>{" "}
                <span className="relative z-10 font-editorial italic">{settings.title_name || 'Bea!'}</span>
                <span className="absolute inset-0 -z-0 overflow-hidden">
                  <img
                    src={settings.highlight_image_url || "/Landing/HERO/2.png"}
                    alt=""
                    className={`absolute object-cover ${
                      hasAnimated ? "swipe-animation" : ""
                    }`}
                    style={{
                      objectPosition: 'center',
                      top: '40%',
                      left: '70%',
                      transform: 'translate(-50%, -50%)',
                      width: '20%',
                      height: '120%',
                      minWidth: '90%',
                      clipPath: hasAnimated
                        ? undefined
                        : 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
                    }}
                  />
                </span>
              </span>
            </h2>
          </div>

          {/* Country pills - compact */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {countries.map((country) => (
              <span
                key={country.id}
                className="px-3 py-1 rounded-full border border-black/20 bg-white shadow-sm text-gray-900 text-xs"
              >
                {country.flag_emoji} {country.country_name}
              </span>
            ))}
          </div>

          {/* Image Carousel */}
          <div className="mb-8">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4">
                {mobileImages.map((img, idx) => (
                  <div key={idx} className="flex-[0_0_85%] min-w-0">
                    <div className="bg-white rounded-lg shadow-xl overflow-hidden" style={{ border: "3px solid #cccccc" }}>
                      <MacHeader imageName={img.name} />
                      <div className="relative w-full aspect-[4/3]">
                        <Image
                          src={img.src}
                          alt={img.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-4">
              {mobileImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => emblaApi?.scrollTo(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === selectedIndex 
                      ? "w-6 bg-gray-800" 
                      : "w-2 bg-gray-300"
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Mobile Text - Condensed */}
          <div className="space-y-3 text-gray-800 leading-relaxed text-sm">
            {paragraphs.map((para) => (
              <p key={para.id} className={para.is_italic ? 'italic' : ''}>
                {para.paragraph_text}
              </p>
            ))}
          </div>
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

  // ========== DESKTOP LAYOUT (EXACT Original) ==========
  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 bg-[#FEFDF8] font-helvetica"
    >
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Title */}
        <div className="text-black text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight">
            {settings.title_prefix || 'Hi,'}{" "}
            <span className="relative inline-block">
              <span className="relative z-10"> I'm </span>{" "}
              <span className="relative z-10 font-editorial italic">{settings.title_name || 'Bea!'}</span>
              <span className="absolute inset-0 -z-0 overflow-hidden">
                <img
                  src={settings.highlight_image_url || "/Landing/HERO/2.png"}
                  alt=""
                  className={`absolute object-cover ${
                    hasAnimated ? "swipe-animation" : ""
                  }`}
                  style={{
                    objectPosition: 'center',
                    top: '40%',
                    left: '70%',
                    transform: 'translate(-50%, -50%)',
                    width: '20%',
                    height: '120%',
                    minWidth: '90%',
                    clipPath: hasAnimated
                      ? undefined
                      : 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
                  }}
                />
              </span>
            </span>
          </h2>
        </div>

        {/* Country pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 text-sm">
          {countries.map((country) => (
            <span
              key={country.id}
              className="px-4 py-1.5 rounded-full border border-black/20 bg-white shadow-sm text-gray-900"
            >
              {country.flag_emoji} {country.country_name}
            </span>
          ))}
        </div>

        {/* Main layout */}
        <div className="relative grid md:grid-cols-[1fr_1.3fr_1fr] gap-8 items-center">
          {/* Left images */}
          <div className="relative hidden md:block h-[480px]">
            {/* Bhutan image - behind cca */}
            {bhutanImage && (
              <div className="absolute top-50 left-50 w-28 z-0">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9 }}
                  className="shadow-xl rounded-lg overflow-hidden"
                  style={{ border: "5px solid #cccccc" }}
                >
                  <div className="relative w-full aspect-[4/4.5]">
                    <Image
                      src={bhutanImage.image_url}
                      alt="bhutan"
                      fill
                      className="object-cover"
                    />
                  </div>
                </motion.div>
                <div className="text-center text-xs text-gray-500 mt-1">
                  {bhutanImage.image_name}
                </div>
              </div>
            )}

            {/* cca image - on top of bhutan */}
            {ccaImage && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute top-0 left-0 w-56 shadow-xl rounded-lg overflow-hidden bg-white z-10"
              >
                <MacHeader imageName={ccaImage.image_name} />
                <div className="relative w-full aspect-[4/4.5]">
                  <Image
                    src={ccaImage.image_url}
                    alt="cca"
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
            )}

            {/* phstar image */}
            {phstarImage && (
              <div className="absolute bottom-[-50] left-24 w-32 z-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="shadow-xl rounded-lg overflow-hidden"
                  style={{ border: "5px solid #cccccc" }}
                >
                  <div className="relative w-full aspect-[4/4.5]">
                    <Image
                      src={phstarImage.image_url}
                      alt="phstar"
                      fill
                      className="object-cover"
                    />
                  </div>
                </motion.div>
                <div className="text-center text-xs text-gray-500 mt-1">
                  {phstarImage.image_name}
                </div>
              </div>
            )}

            {/* abroad image */}
            {abroadImage && (
              <div className="absolute bottom-5 left-0 w-28 z-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="shadow-xl rounded-lg overflow-hidden"
                  style={{ border: "5px solid #cccccc" }}
                >
                  <div className="relative w-full aspect-[4/4.5]">
                    <Image
                      src={abroadImage.image_url}
                      alt="abroad"
                      fill
                      className="object-cover"
                    />
                  </div>
                </motion.div>
                <div className="text-center text-xs text-gray-500 mt-1">
                  {abroadImage.image_name}
                </div>
              </div>
            )}
          </div>

          {/* Text */}
          <div className="text-center space-y-6 text-gray-800 leading-relaxed">
            {paragraphs.map((para) => (
              <p key={para.id} className={para.is_italic ? 'italic text-gray-700' : ''}>
                {para.paragraph_text}
              </p>
            ))}
          </div>

          {/* Right images */}
          <div className="relative hidden md:block h-[480px]">
            {europeImage && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute top-0 right-0 w-46 shadow-xl rounded-lg overflow-hidden bg-white"
              >
                <MacHeader imageName={europeImage.image_name} />
                <div className="relative w-full aspect-[4/4.5]">
                  <Image
                    src={europeImage.image_url}
                    alt="europe"
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
            )}

            {tequilaImage && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="absolute bottom-0 right-10 w-62 shadow-xl rounded-lg overflow-hidden bg-white"
              >
                <MacHeader imageName={tequilaImage.image_name} />
                <div className="relative w-full aspect-[4/4.5]">
                  <Image
                    src={tequilaImage.image_url}
                    alt="tequila"
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
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