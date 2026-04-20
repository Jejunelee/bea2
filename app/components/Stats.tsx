'use client';

import { useEffect, useRef, useState } from 'react';

export default function Stats() {
  const stats = [
    {
      number: "12+",
      value: 12,
      suffix: "+",
      text: "Years in food and hospitality communications",
    },
    {
      number: "4",
      value: 4,
      suffix: "",
      text: "Countries lived and worked in: Philippines, UK, Australia, Bhutan",
    },
    {
      number: "50+",
      value: 50,
      suffix: "+",
      text: "Stories told in the food and beverage space, with more on the way",
    },
    {
      number: "3",
      value: 3,
      suffix: "",
      text: "Continents. One obsession: storytelling.",
    },
  ];

  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const [isVisible, setIsVisible] = useState([false, false, false, false]);
  const [hasAnimated, setHasAnimated] = useState([false, false, false, false]);
  const [isMobile, setIsMobile] = useState(false);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fade-in and counting animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardsRef.current.findIndex((card) => card === entry.target);
            if (index !== -1 && !isVisible[index]) {
              // Stagger the fade-in
              setTimeout(() => {
                setIsVisible((prev) => {
                  const newState = [...prev];
                  newState[index] = true;
                  return newState;
                });
              }, index * 150);

              // Start counting animation when card becomes visible
              if (!hasAnimated[index]) {
                setHasAnimated((prev) => {
                  const newState = [...prev];
                  newState[index] = true;
                  return newState;
                });
                
                const targetValue = stats[index].value;
                const duration = 2000;
                const stepTime = 20;
                const steps = duration / stepTime;
                const increment = targetValue / steps;
                let current = 0;
                let step = 0;
                
                const timer = setInterval(() => {
                  step++;
                  current += increment;
                  if (step >= steps) {
                    setCounts((prevCounts) => {
                      const newCounts = [...prevCounts];
                      newCounts[index] = targetValue;
                      return newCounts;
                    });
                    clearInterval(timer);
                  } else {
                    setCounts((prevCounts) => {
                      const newCounts = [...prevCounts];
                      newCounts[index] = Math.floor(current);
                      return newCounts;
                    });
                  }
                }, stepTime);
                
                return () => clearInterval(timer);
              }
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, [isVisible, hasAnimated, stats]);

  // ========== MOBILE LAYOUT (2x2 Grid) ==========
  if (isMobile) {
    return (
      <section className="w-full bg-[#FEFDF8] py-8 font-helvetica">
        <div className="px-4">
          <div className="grid grid-cols-2 gap-6 text-center">
            {stats.map((item, index) => (
              <div
                key={index}
                ref={(el) => { cardsRef.current[index] = el; }}
                className={`
                  flex flex-col items-center
                  transition-all duration-700 ease-out
                  ${isVisible[index] 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-5'
                  }
                `}
                style={{
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                <h2 className="text-5xl font-editorial text-black mb-2">
                  {counts[index]}{item.suffix}
                </h2>

                <p className="text-gray-800 text-xs leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ========== DESKTOP LAYOUT ==========
  return (
    <section className="w-full bg-[#FEFDF8] py-10 font-helvetica overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {stats.map((item, index) => (
            <div
              key={index}
              ref={(el) => { cardsRef.current[index] = el; }}
              className={`
                flex flex-col items-center transition-all duration-700 ease-out
                ${isVisible[index] 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-5'
                }
              `}
              style={{
                transitionDelay: `${index * 150}ms`,
              }}
            >
              <h2 className="text-7xl md:text-8xl font-editorial text-black mb-4">
                {counts[index]}{item.suffix}
              </h2>

              <p className="text-gray-800 text-sm md:text-base leading-relaxed max-w-[220px]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}