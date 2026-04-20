"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

export default function Packages() {
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

  const packages = [
    {
      id: 1,
      tag: "For Brands",
      tagColor: "#FED301",
      tagSubtext: "For food businesses",
      title: "You're posting. You're not growing. Let's fix the actual problem.",
      description: "Most food and hospitality brands have a content output problem and a story clarity problem. I help them figure out what they actually stand for, build a system their team can run, and create the kind of content that builds real loyalty rather than just likes.",
      bullets: [
        "Brand storytelling and messaging",
        "Content strategy and systems",
        "Team training and SOPs",
        "Origin video series production"
      ],
      buttonText: "See brand offers →",
      buttonLink: "/brands",
      bgImage: "/Landing/Package1.png"
    },
    {
      id: 2,
      tag: "For Individuals",
      tagColor: "#B2D235",
      tagSubtext: "For founders and professionals",
      title: "Your work is exceptional. Does your online presence say that?",
      description: "I work with ambitious people in food and hospitality who are doing extraordinary things and whose personal brand doesn't reflect that yet. The right story, told well, opens more doors than any CV or cold pitch ever will.",
      bullets: [
        "Origin story and narrative",
        "Messaging audit & positioning",
        "Personal brand strategy",
        "AI tools for workflow"
      ],
      buttonText: "See individual offers →",
      buttonLink: "/people",
      bgImage: "/Landing/Package2.png"
    }
  ];

  // ========== MOBILE LAYOUT (Carousel) ==========
  if (isMobile) {
    return (
      <section className="w-full py-12 px-4 bg-[#f5f3ef]">
        <div className="max-w-7xl mx-auto">
          {/* Carousel */}
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
                        {/* Tag Row */}
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className="px-3 py-0.5 text-xs font-semibold rounded-full border border-black"
                            style={{ backgroundColor: pkg.tagColor, color: '#000000' }}
                          >
                            {pkg.tag}
                          </span>
                          <span className="text-xs text-black">{pkg.tagSubtext}</span>
                        </div>

                        {/* Title - Condensed for mobile */}
                        <h2 className="text-lg font-semibold text-black leading-tight mb-3">
                          {pkg.title}
                        </h2>

                        {/* Description - Smaller */}
                        <p className="text-black mb-3 leading-relaxed text-xs opacity-80">
                          {pkg.description}
                        </p>

                        {/* Bullet Points - 2 column grid */}
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-black mb-4 text-xs flex-grow">
                          {pkg.bullets.map((bullet, idx) => (
                            <li key={idx} className="list-none">• {bullet}</li>
                          ))}
                        </div>

                        {/* Button - Stays at bottom */}
                        <div className="flex justify-end mt-auto">
                          <a href={pkg.buttonLink}>
                            <button className="bg-black text-white px-3 py-1.5 rounded-full text-xs hover:opacity-80 transition">
                              {pkg.buttonText}
                            </button>
                          </a>
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

  // ========== DESKTOP LAYOUT (Original) ==========
  return (
    <section className="w-full py-16 px-6 bg-[#f5f3ef]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="relative rounded-2xl border-2 border-black p-6 shadow-sm overflow-hidden h-full"
            style={{
              backgroundImage: `url('${pkg.bgImage}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md rounded-2xl -z-0" />

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
                <span className="text-xs text-black">{pkg.tagSubtext}</span>
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-semibold text-black leading-tight mb-4">
                {pkg.title.split(' ').map((word, i) => 
                  word.toLowerCase() === 'exceptional' || 
                  word.toLowerCase() === 'actual' ||
                  word === 'problem' ||
                  (i > 0 && word === 'fix') ? (
                    <em key={i} className="font-serif italic">{word} </em>
                  ) : (
                    word + ' '
                  )
                )}
              </h2>

              {/* Description */}
              <p className="text-black mb-4 leading-relaxed text-sm opacity-80">
                {pkg.description}
              </p>

              {/* Bullet Points */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-black mb-5 text-sm flex-grow">
                {pkg.bullets.map((bullet, idx) => (
                  <li key={idx} className="list-none">• {bullet}</li>
                ))}
              </div>

              {/* Button */}
              <div className="flex justify-end mt-auto">
                <a href={pkg.buttonLink}>
                  <button className="bg-black text-white px-4 py-1.5 rounded-full text-xs hover:opacity-80 transition">
                    {pkg.buttonText}
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