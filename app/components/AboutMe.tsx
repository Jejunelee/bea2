"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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
      { threshold: 0.3 } // Trigger when 30% of the section is visible
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
      className="relative w-full py-24 bg-[#FEFDF8] font-helvetica"
    >
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Title */}
        <div className="text-black text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight">
            Hi,{" "}
            <span className="relative inline-block">
              <span className="relative z-10"> I'm </span>{" "}
              <span className="relative z-10 font-editorial italic">Bea!</span>
              <span className="absolute inset-0 -z-0 overflow-hidden">
                <img
                  src="/Landing/HERO/2.png"
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
          {[
            { label: "Philippines", flag: "🇵🇭" },
            { label: "United Kingdom", flag: "🇬🇧" },
            { label: "Australia", flag: "🇦🇺" },
            { label: "Bhutan", flag: "🇧🇹" },
          ].map((item) => (
            <span
              key={item.label}
              className="px-4 py-1.5 rounded-full border border-black/20 bg-white shadow-sm text-gray-900"
            >
              {item.flag} {item.label}
            </span>
          ))}
        </div>

        {/* Main layout */}
        <div className="relative grid md:grid-cols-[1fr_1.3fr_1fr] gap-8 items-center">
          {/* Left images */}
          <div className="relative hidden md:block h-[480px]">
            {/* Bhutan image - behind cca */}
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
                    src="/Landing/AboutMe/4.png"
                    alt="bhutan"
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
              <div className="text-center text-xs text-gray-500 mt-1">
                bhutan.jpg
              </div>
            </div>

            {/* cca image - on top of bhutan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute top-0 left-0 w-56 shadow-xl rounded-lg overflow-hidden bg-white z-10"
            >
              <MacHeader imageName="cca.jpg" />
              <div className="relative w-full aspect-[4/4.5]">
                <Image
                  src="/Landing/AboutMe/1.png"
                  alt="cca"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            {/* phstar image */}
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
                    src="/Landing/AboutMe/5.png"
                    alt="phstar"
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
              <div className="text-center text-xs text-gray-500 mt-1">
                phstar.jpg
              </div>
            </div>

            {/* abroad image */}
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
                    src="/Landing/AboutMe/6.png"
                    alt="abroad"
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
              <div className="text-center text-xs text-gray-500 mt-1">
                abroad.jpg
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="text-center space-y-6 text-gray-800 leading-relaxed">
            <p>
              I grew up in the kitchen of the Philippines' first internationally
              accredited culinary school. My grandmother founded it. My mother
              runs it. I didn't plan to work in food — I just never really left.
            </p>

            <p>
              Over the last 12 years, I've co-owned a tequila bar in Melbourne,
              worked in account management at Fairfax Media, taught in Bhutan,
              written a food column for Philippine Star, and built communications
              for some of the most interesting food businesses in Asia and
              Europe.
            </p>

            <p>
              Now I run Type Harder Studio — a fractional communications practice
              based between London and Manila. I work with a small number of
              founders and brands at any given time, going deep on story,
              systems, and the kind of brand presence that compounds over time
              rather than burns out.
            </p>

            <p className="italic text-gray-700">
              "Always hungry. Always learning." is not a bio line. It's the
              operating system.
            </p>
          </div>

          {/* Right images */}
          <div className="relative hidden md:block h-[480px]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute top-0 right-0 w-46 shadow-xl rounded-lg overflow-hidden bg-white"
            >
              <MacHeader imageName="europe.jpg" />
              <div className="relative w-full aspect-[4/4.5]">
                <Image
                  src="/Landing/AboutMe/2.png"
                  alt="europe"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute bottom-0 right-10 w-62 shadow-xl rounded-lg overflow-hidden bg-white"
            >
              <MacHeader imageName="tequila.jpg" />
              <div className="relative w-full aspect-[4/4.5]">
                <Image
                  src="/Landing/AboutMe/3.png"
                  alt="tequila"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
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