"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { supabase } from "@/app/lib/supabase/client";
import type { BeliefSettings, BeliefItem } from "@/app/types/belief";

export default function Belief() {
  const [settings, setSettings] = useState<Partial<BeliefSettings>>({});
  const [beliefs, setBeliefs] = useState<BeliefItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const containerRef = useRef<HTMLElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  
  // Create refs array for belief items
  const beliefRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      const { data: settingsData } = await supabase
        .from('belief_settings')
        .select('*')
        .eq('id', 1)
        .single();
      if (settingsData) setSettings(settingsData);

      const { data: itemsData } = await supabase
        .from('belief_items')
        .select('*')
        .order('display_order', { ascending: true });
      if (itemsData) {
        setBeliefs(itemsData);
        beliefRefs.current = itemsData.map(() => null);
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

  const { scrollYProgress } = useScroll({
    target: isClient && containerRef.current ? containerRef : undefined,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  // Track inView state for each belief
  const [inViewStates, setInViewStates] = useState<boolean[]>([]);
  
  useEffect(() => {
    if (beliefs.length > 0 && beliefRefs.current.length > 0) {
      setInViewStates(new Array(beliefs.length).fill(false));
      
      // Create observers for each belief
      const observers: IntersectionObserver[] = [];
      
      beliefRefs.current.forEach((ref, index) => {
        if (!ref) return;
        
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setInViewStates(prev => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
              observer.unobserve(ref);
            }
          },
          { threshold: 0.3 }
        );
        
        observer.observe(ref);
        observers.push(observer);
      });
      
      return () => {
        observers.forEach(observer => observer.disconnect());
      };
    }
  }, [beliefs]);

  if (loading || !isClient) {
    return <div className="font-helvetica overflow-hidden" style={{ minHeight: '400px' }}></div>;
  }

  const renderHeadline = (item: BeliefItem) => {
    return (
      <>
        {item.headline_prefix}
        {item.headline_italic && <span className="font-editorial italic">{item.headline_italic}</span>}
        {item.headline_suffix}
      </>
    );
  };

  // ========== MOBILE LAYOUT ==========
  if (isMobile) {
    return (
      <section ref={containerRef} className="font-helvetica overflow-hidden">
        <motion.div
          ref={heroRef}
          className="h-[120px] flex items-center justify-center text-center relative overflow-hidden"
          style={{ y: heroY }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('${settings.background_image_url || '/Landing/Vector.png'}')`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundColor: settings.background_color || "#f3f3f3",
            }}
          >
            <div 
              className="absolute inset-0 backdrop-blur-sm"
              style={{ backgroundColor: `rgba(255, 255, 255, ${((settings.overlay_opacity || 60) / 100)})` }}
            />
          </div>

          <motion.div
            className="relative z-10 px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.p
              className="text-xs tracking-[0.1em] text-black/90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {settings.hero_badge_text || 'THINGS I ACTUALLY BELIEVE'}
            </motion.p>

            <motion.h2
              className="text-black/80 text-2xl font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {settings.hero_title_prefix || 'Opinions'} <span className="font-editorial italic">{settings.hero_title_italic || 'worth'}</span> {settings.hero_title_suffix || 'having'}
            </motion.h2>
          </motion.div>
        </motion.div>

        <div 
          className="py-12 px-4"
          style={{ backgroundColor: settings.content_background_color || '#000000' }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-row gap-6 overflow-x-auto pb-4 hide-scrollbar">
              {beliefs.map((belief, index) => (
                <motion.div
                  key={belief.id}
                  ref={(el) => { beliefRefs.current[index] = el; }}
                  className="flex-shrink-0 w-[280px]"
                  initial={{ opacity: 0, y: 50 }}
                  animate={inViewStates[index] ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                >
                  <motion.h3
                    className="text-2xl font-medium mb-3"
                    style={{ color: settings.text_color || '#FFFFFF' }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inViewStates[index] ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                  >
                    {belief.title}
                  </motion.h3>

                  <motion.p
                    className="text-lg leading-relaxed font-medium font-editorial"
                    style={{ color: settings.text_color || '#FFFFFF' }}
                    initial={{ opacity: 0 }}
                    animate={inViewStates[index] ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                  >
                    {renderHeadline(belief)}
                  </motion.p>

                  <motion.div
                    className="border-b border-neutral-700 my-4 w-full"
                    initial={{ scaleX: 0 }}
                    animate={inViewStates[index] ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.15 + 0.4 }}
                    style={{ originX: 0 }}
                  />

                  <motion.p
                    className="leading-tight text-sm"
                    style={{ color: settings.text_color || '#FFFFFF' }}
                    initial={{ opacity: 0 }}
                    animate={inViewStates[index] ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.15 + 0.5 }}
                  >
                    {belief.description}
                  </motion.p>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="flex justify-center mt-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.a
                href={settings.button_link || 'https://substack.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="font-helvetica border-3 px-5 py-1.5 rounded-full text-sm font-medium transition cursor-pointer inline-block"
                style={{
                  backgroundColor: settings.button_background_color || '#ADDDB1',
                  color: settings.button_text_color || '#000000',
                  borderColor: settings.button_text_color || '#000000',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {settings.button_text || 'Read more on Substack →'}
              </motion.a>
            </motion.div>
          </div>
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

  // ========== DESKTOP LAYOUT ==========
  return (
    <section ref={containerRef} className="font-helvetica overflow-hidden">
      <motion.div
        ref={heroRef}
        className="h-[160px] flex items-center justify-center text-center relative overflow-hidden"
        style={{ y: heroY }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${settings.background_image_url || '/Landing/Vector.png'}')`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundColor: settings.background_color || "#f3f3f3",
          }}
        >
          <div 
            className="absolute inset-0 backdrop-blur-sm"
            style={{ backgroundColor: `rgba(255, 255, 255, ${((settings.overlay_opacity || 60) / 100)})` }}
          />
        </div>

        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.p
            className="text-lg tracking-[0.1em] text-black/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {settings.hero_badge_text || 'THINGS I ACTUALLY BELIEVE'}
          </motion.p>

          <motion.h2
            className="text-black/80 text-4xl md:text-5xl font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {settings.hero_title_prefix || 'Opinions'} <span className="font-editorial italic">{settings.hero_title_italic || 'worth'}</span> {settings.hero_title_suffix || 'having'}
          </motion.h2>
        </motion.div>
      </motion.div>

      <div 
        className="py-24 px-6"
        style={{ backgroundColor: settings.content_background_color || '#000000' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {beliefs.map((belief, index) => (
              <motion.div
                key={belief.id}
                ref={(el) => { beliefRefs.current[index] = el; }}
                initial={{ opacity: 0, y: 50 }}
                animate={inViewStates[index] ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
              >
                <motion.h3
                  className="text-4xl font-medium mb-4"
                  style={{ color: settings.text_color || '#FFFFFF' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inViewStates[index] ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                >
                  {belief.title}
                </motion.h3>

                <motion.p
                  className="text-[25px] leading-relaxed font-medium font-editorial"
                  style={{ color: settings.text_color || '#FFFFFF' }}
                  initial={{ opacity: 0 }}
                  animate={inViewStates[index] ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                >
                  {renderHeadline(belief)}
                </motion.p>

                <motion.div
                  className="border-b border-neutral-700 my-6 w-full"
                  initial={{ scaleX: 0 }}
                  animate={inViewStates[index] ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.15 + 0.4 }}
                  style={{ originX: 0 }}
                />

                <motion.p
                  className="leading-tight text-[20px]"
                  style={{ color: settings.text_color || '#FFFFFF' }}
                  initial={{ opacity: 0 }}
                  animate={inViewStates[index] ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.5 }}
                >
                  {belief.description}
                </motion.p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="flex justify-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.a
              href={settings.button_link || 'https://substack.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="font-helvetica border-3 px-6 py-1.5 rounded-full text-lg font-medium transition cursor-pointer inline-block"
              style={{
                backgroundColor: settings.button_background_color || '#ADDDB1',
                color: settings.button_text_color || '#000000',
                borderColor: settings.button_text_color || '#000000',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {settings.button_text || 'Read more on Substack →'}
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}