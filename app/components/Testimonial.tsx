"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { TestimonialSliderSettings, TestimonialSlide } from "@/app/types/testimonial";
import Image from "next/image";

export default function TestimonialSlider() {
  const [settings, setSettings] = useState<Partial<TestimonialSliderSettings>>({});
  const [testimonials, setTestimonials] = useState<TestimonialSlide[]>([]);
  const [loading, setLoading] = useState(true);

  // Default testimonials with individual image paths - using public/Testimonials/
  const defaultTestimonials: (TestimonialSlide & { imagePath: string })[] = [
    {
      id: 1,
      quote: "When the pandemic happened, we didn't think the culinary school would survive. But through Bea's communication strategy, we were able to build a strong affinity with the brand. Most of our leads are already fans of the school before reaching out. Now, our student population has 10x'd.",
      author: "Chef Philip John Golding",
      role: "Culinary Director",
      company: "CCA Manila",
      display_order: 1,
      imagePath: "/Testimonials/5.png",
    },
    {
      id: 2,
      quote: "Bea was adamant from when she joined the team that there was real opportunity here (Substack). That if we treated it seriously, and not a channel that recycles our content, it could become a meaningful way to engage and build community. So she laid out the strategy and ground work. In a world moving at algorithm speed, this became our place to slow down. To tell stories people actually sit with.",
      author: "Teodoro Mefalopoulos",
      role: "CEO & Founder",
      company: "anana",
      display_order: 2,
      imagePath: "/Testimonials/6.png",
    },
    {
      id: 3,
      quote: "Bea wrote my founder's story so well. It's personal and brings out the key moments in my entrepreneurial journey. She's also very speedy when it comes to press releases and ghostwriting jobs.",
      author: "Angely Dub",
      role: "Founder",
      company: "Access Travel, Explora Ahora & Happi Lab",
      display_order: 3,
      imagePath: "/Testimonials/2.png",
    },
    {
      id: 4,
      quote: "Bea maps out different possible scenarios and has a solution for each. She's dependable and extremely well-researched. She comes up with great ideas based on the data she gathers and strategizes concepts based on facts.",
      author: "Belle Daza",
      role: "Founder",
      company: "Jellytime, Sexytime Podcast & Celebrity",
      display_order: 4,
      imagePath: "/Testimonials/3.png",
    },
    {
      id: 5,
      quote: "We didn't even know that our founder's story could sound so incredible and impressive.",
      author: "Tisha Riingen & Pia Trinidad",
      role: "Founders",
      company: "Beauty Buddy",
      display_order: 5,
      imagePath: "/Testimonials/7.png",
    },
    {
      id: 7,
      quote: "Bea brings not only a sharp editorial eye but also a consistently positive energy that uplifts every project she touches. She is thoughtful, reliable, and a true collaborator — someone who shows up with enthusiasm, curiosity, and a deep care for her work.",
      author: "Kyle Cords",
      role: "Founder",
      company: "OmList",
      display_order: 7,
      imagePath: "/Testimonials/4.png",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      // Fetch settings
      const { data: settingsData } = await supabase
        .from('testimonial_slider_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (settingsData) setSettings(settingsData);

      // Fetch testimonials
      const { data: testimonialsData } = await supabase
        .from('testimonial_slides')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (testimonialsData && testimonialsData.length > 0) {
        const testimonialsWithImages = testimonialsData.map(t => ({
          ...t,
          imagePath: t.imagePath || `/Testimonials/${t.id}.png`,
        }));
        setTestimonials(testimonialsWithImages);
      } else {
        setTestimonials(defaultTestimonials);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const renderQuoteWithEmphasis = (quote: string) => {
    const emphasisWords = [
      "10x'd",
      "real opportunity",
      "slow down",
      "founder's story",
      "dependable",
      "incredible",
      "practical approach",
      "sharp editorial eye",
      "A-game"
    ];

    let result = [];
    let lastIndex = 0;
    
    for (const word of emphasisWords) {
      const index = quote.indexOf(word);
      if (index !== -1) {
        if (index > lastIndex) {
          result.push(quote.substring(lastIndex, index));
        }
        const foundWord = quote.substring(index, index + word.length);
        result.push(
          <span key={index} className="font-editorial italic text-black/90">
            {foundWord}
          </span>
        );
        lastIndex = index + word.length;
      }
    }
    
    if (lastIndex < quote.length) {
      result.push(quote.substring(lastIndex));
    }
    
    return result.length > 0 ? result : quote;
  };

  if (loading) {
    return <div className="w-full py-12 bg-black animate-pulse"></div>;
  }

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;
  const headingText = settings.heading_text || "What clients say";
  const headingItalicWord = settings.heading_italic_word || "clients";
  const headingParts = headingText.split(headingItalicWord);
  const subheadingText = settings.subheading_text || "Real stories from people I've worked with";
  
  const animationDuration = Math.max(20, displayTestimonials.length * 6);

  return (
    <section className="relative w-full font-helvetica bg-black overflow-hidden">
      {/* Subtle glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-[10%] w-[200px] h-[200px] bg-[#e9c08f]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-[10%] w-[300px] h-[300px] bg-[#e6ee9c]/5 rounded-full blur-3xl" />
      </div>

      {/* Condensed Header */}
      <div className="py-8 px-6 bg-black">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-white text-3xl md:text-4xl font-medium tracking-tight">
            {headingParts[0]}
            <span className="text-white italic font-normal font-editorial">{headingItalicWord}</span>
            {headingParts[1]}
          </h2>
          <p className="mt-2 text-gray-300 text-base">
            {subheadingText}
          </p>
        </div>
      </div>

      {/* Condensed Ticker-style Infinite Scroll */}
      <div className="relative py-6 pb-12">
        <div className="relative overflow-visible">
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-10 md:w-10 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-10 md:w-10 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none"></div>
          
          <div 
            className="flex animate-scroll"
            style={{
              display: 'flex',
              width: 'max-content',
              animationDuration: `${animationDuration}s`,
              gap: '1rem',
            }}
          >
            {/* Double the items for seamless loop */}
            {[...displayTestimonials, ...displayTestimonials].map((testimonial, idx) => (
              <div
                key={`${testimonial.id}-${idx}`}
                className="w-[300px] md:w-[340px] lg:w-[360px] flex-shrink-0 overflow-visible"
              >
                {/* Condensed Card */}
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm h-full flex flex-col transition-all duration-300 hover:shadow-md hover:scale-105 will-change-transform">
                  {/* Smaller Picture */}
                  <div className="flex justify-center mb-3">
                    <div className="relative w-18 h-18 md:w-24 md:h-24 rounded-full overflow-hidden ring-3 ring-gray-100">
                      <Image
                        src={testimonial.imagePath || `/Testimonials/${testimonial.id}.png`}
                        alt={testimonial.author}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 56px, 64px"
                      />
                    </div>
                  </div>
                  
                  {/* Smaller quote icon */}
                  <div className="text-2xl text-gray-300 font-editorial italic mb-2">"</div>
                  
                  {/* Condensed quote text */}
                  <p className="text-xs md:text-sm text-gray-700 leading-relaxed font-helvetica mb-3 flex-grow line-clamp-6">
                    {renderQuoteWithEmphasis(testimonial.quote)}
                  </p>
                  
                  {/* Condensed author info */}
                  <div className="border-t border-gray-200 pt-2 mt-1">
                    <p className="text-sm font-medium text-gray-900 font-helvetica text-center">
                      {testimonial.author}
                    </p>
                    <p className="text-xs text-gray-500 font-helvetica text-center truncate">
                      {testimonial.role}{testimonial.role && testimonial.company && " · "}{testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        
        /* Ensure scaled cards appear above others and don't clip */
        .animate-scroll > div {
          transition: z-index 0s;
        }
        
        .animate-scroll > div:hover {
          z-index: 30;
        }
        
        /* Prevent transform clipping on cards */
        .animate-scroll > div > div {
          transform-origin: center;
          backface-visibility: hidden;
          -webkit-font-smoothing: subpixel-antialiased;
        }
      `}</style>
    </section>
  );
}