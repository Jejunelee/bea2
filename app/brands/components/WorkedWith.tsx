"use client";

import { useEffect, useRef, useState } from "react";

export default function WorkedWith() {
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const brands = [
    { name: "Brand 1", logo: "/WorkedWith/brand1.png" },
    { name: "Brand 2", logo: "/WorkedWith/brand2.png" },
    { name: "Brand 3", logo: "/WorkedWith/brand3.png" },
    { name: "Brand 4", logo: "/WorkedWith/brand4.png" },
  ];

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

  return (
    <section
      ref={sectionRef}
      className="mb-10 bg-black text-white py-16 px-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading - fade up animation */}
        <div
          className={`transition-all duration-700 ease-out ${
            hasAnimated
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <p className="text-lg tracking-[0.1em] text-white/90 mb-4">
            Some of the <span className="font-editorial italic font-semibold">brands</span> and{" "}
            <span className="font-editorial italic font-semibold">people</span> I've worked with
          </p>
        </div>

        {/* Divider - scale animation */}
        <div
          className={`transition-all duration-700 delay-75 ease-out origin-left ${
            hasAnimated
              ? "opacity-100 scale-x-100"
              : "opacity-0 scale-x-0"
          }`}
        >
          <div className="border-b border-neutral-700 w-full mb-12" />
        </div>

        {/* Logos grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {brands.map((brand, index) => (
            <div
              key={index}
              className={`bg-neutral-800 aspect-square flex items-center justify-center rounded-lg transition-all duration-700 ease-out ${
                hasAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${150 + index * 100}ms` }}
            >
              {/* Replace with Image when logos are ready */}
              {/* 
              <Image
                src={brand.logo}
                alt={brand.name}
                width={200}
                height={200}
                className="object-contain"
              />
              */}
              <span className="text-neutral-500 text-sm">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}