"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";

const cards = [
  {
    id: 1,
    image: "/Landing/Familiar/1.png",
    title: "I'm posting. Nothing's building.",
    description:
      "Six months of content, same reach. You're consistent, but consistency alone isn't doing what they promised it would. You're starting to wonder if experimentation is the missing piece, or if the problem runs deeper than that.",
  },
  {
    id: 2,
    image: "/Landing/Familiar/2.png",
    title: "I sound like everyone else.",
    description:
      "Your ideas are good. But they come out like templates. You open the app, see three people saying exactly what you were going to say, and close it again.",
  },
  {
    id: 3,
    image: "/Landing/Familiar/3.png",
    title: "I hired an agency, but they're not a growth partner.",
    description:
      "They deliver content on time and call it done. But nobody in that office loses sleep over whether your business is actually growing. You don't need a vendor. You need someone who's invested in the outcome.",
  },
  {
    id: 4,
    image: "/Landing/Familiar/4.png",
    title: "My competitors just look more legit.",
    description:
      "Same expertise, sometimes less. But their story is clearer and you can't figure out what they're doing that you're not. The difference usually isn't budget. It's clarity.",
  },
];

export default function Familiar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToCard = (index: number) => {
    const element = document.getElementById(`card-${index}`);
    if (element) element.scrollIntoView({ behavior: "smooth" });
    setActiveIndex(index);
  };

  // ========== MOBILE LAYOUT (Completely Different) ==========
  if (isMobile) {
    return (
      <section className="relative w-full bg-[white] font-helvetica pb-16">
        {/* Mobile Header */}
        <div className="sticky top-0 z-30 bg-[white] py-8 px-4 shadow-sm">
          <div className="text-center">
            <h2 className="text-black text-2xl font-medium">
              Sounds <span className="italic font-normal font-editorial">familiar?</span>
            </h2>
            <p className="mt-2 text-black text-sm text-gray-600">
              The things nobody says out loud, but everyone feels.
            </p>
          </div>
        </div>

        {/* Mobile Carousel / Swipe Cards */}
        <div className="relative px-4 mt-6">
          <div className="overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar">
            <div className="flex gap-4">
              {cards.map((card, idx) => (
                <div
                  key={card.id}
                  className="flex-shrink-0 w-full snap-center"
                >
                  <div className="bg-black rounded-2xl p-5">
                    {/* Image */}
                    <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4">
                      <Image 
                        src={card.image} 
                        alt={card.title} 
                        fill 
                        className="object-cover"
                      />
                    </div>

                    {/* Arrow Icon */}
                    <Image
                      src={`/Landing/Icons/Arrow-${idx + 1}.png`}
                      alt={`Arrow ${idx + 1}`}
                      width={48}
                      height={48}
                      className="mb-3"
                    />

                    {/* Title */}
                    <h3 className="text-white text-xl font-medium mb-3 leading-tight">
                      "{card.title}"
                    </h3>

                    {/* Description */}
                    <p className="text-white text-sm leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {cards.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const container = document.querySelector('.overflow-x-auto');
                  const cardWidth = window.innerWidth - 32;
                  container?.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
                  setActiveIndex(idx);
                }}
                className={`transition-all duration-300 ${
                  activeIndex === idx 
                    ? 'w-8 h-2 bg-black rounded-full' 
                    : 'w-2 h-2 bg-gray-300 rounded-full'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mobile Swipe Hint */}
        <div className="text-center mt-6 text-gray-400 text-xs">
          ← Swipe to see more →
        </div>

        <style jsx>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </section>
    );
  }

  // ========== DESKTOP LAYOUT (EXACT Original) ==========
  return (
    <section className="relative w-full bg-[white] font-helvetica">
      {/* Sticky Heading */}
      <div className="top-0 z-30 bg-[white] py-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-black text-4xl md:text-5xl font-medium tracking-tight">
            Sounds <span className="text-black italic font-normal font-editorial">familiar?</span>
          </h2>
          <p className="mt-4 text-black text-lg">
            The things nobody says out loud, but everyone feels.
          </p>
        </div>
      </div>

      {/* Cards - Original Sticky Scroll */}
      <div className="relative" style={{ height: `${cards.length * 60}vh` }}>
        {cards.map((card, idx) => (
          <div
            key={card.id}
            id={`card-${idx}`}
            className="sticky flex items-center justify-center px-6 py-8"
            style={{ top: `${160 + idx * 8}px`, zIndex: idx }}
          >
            <div className="max-w-6xl mx-auto w-full">
              <div className="bg-black rounded-[36px] p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center shadow-lg">
                {/* Image */}
                <div className="relative w-full md:w-[420px] h-[260px] md:h-[300px] rounded-2xl overflow-hidden flex-shrink-0">
                  <Image src={card.image} alt={card.title} fill className="object-cover" />
                </div>

                {/* Text Content */}
                <div className="text-white max-w-xl">
                  <Image
                    src={`/Landing/Icons/Arrow-${idx + 1}.png`}
                    alt={`Arrow ${idx + 1}`}
                    width={72}
                    height={72}
                    className="mb-4 w-18 h-18"
                  />

                  <h3 className="font-helvetica text-3xl md:text-4xl font-medium mb-4">"{card.title}"</h3>
                  <p className="text-white text-lg leading-relaxed">{card.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}