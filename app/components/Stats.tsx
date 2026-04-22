'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import type { StatsSettings, StatsItem } from '@/app/types/stats';

export default function Stats() {
  const [settings, setSettings] = useState<Partial<StatsSettings>>({});
  const [stats, setStats] = useState<StatsItem[]>([]);
  const [counts, setCounts] = useState<number[]>([]);
  const [isVisible, setIsVisible] = useState<boolean[]>([]);
  const [hasAnimated, setHasAnimated] = useState<boolean[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch settings
      const { data: settingsData } = await supabase
        .from('stats_settings')
        .select('*')
        .eq('id', 1)
        .single();
      if (settingsData) setSettings(settingsData);

      // Fetch stats items
      const { data: statsData } = await supabase
        .from('stats_items')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (statsData) {
        setStats(statsData);
        setCounts(new Array(statsData.length).fill(0));
        setIsVisible(new Array(statsData.length).fill(false));
        setHasAnimated(new Array(statsData.length).fill(false));
      }
      
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

  // Fade-in and counting animation
  useEffect(() => {
    if (loading || stats.length === 0) return;

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
                
                const targetValue = stats[index].number_value;
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
  }, [isVisible, hasAnimated, stats, loading]);

  if (loading) {
    return <div className="w-full py-10" style={{ backgroundColor: '#FEFDF8' }}></div>;
  }

  // ========== MOBILE LAYOUT (2x2 Grid) ==========
  if (isMobile) {
    return (
      <section className="w-full py-8 font-helvetica" style={{ backgroundColor: settings.background_color || '#FEFDF8' }}>
        <div className="px-4">
          <div className="grid grid-cols-2 gap-6 text-center">
            {stats.map((item, index) => (
              <div
                key={item.id}
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
                <h2 className="text-5xl font-editorial mb-2" style={{ color: settings.number_color || '#000000' }}>
                  {counts[index]}{item.number_suffix}
                </h2>

                <p className="text-xs leading-relaxed" style={{ color: settings.text_color || '#1F2937' }}>
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
    <section className="w-full py-10 font-helvetica overflow-hidden" style={{ backgroundColor: settings.background_color || '#FEFDF8' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {stats.map((item, index) => (
            <div
              key={item.id}
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
              <h2 className="text-7xl md:text-8xl font-editorial mb-4" style={{ color: settings.number_color || '#000000' }}>
                {counts[index]}{item.number_suffix}
              </h2>

              <p className="text-sm md:text-base leading-relaxed max-w-[220px]" style={{ color: settings.text_color || '#1F2937' }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}