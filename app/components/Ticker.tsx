"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase/client";

interface TickerItem {
  id: string;
  text: string;
  logo_url?: string;
}

interface TickerData {
  items: TickerItem[];
  background_color: string;
  text_color: string;
  separator: string;
  animation_duration: number;
  logo_height: string;
}

export default function Ticker() {
  const [data, setData] = useState<TickerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickerData();

    const subscription = supabase
      .channel('ticker_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'ticker_items' },
        () => fetchTickerData()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchTickerData = async () => {
    try {
      const { data: tickerData, error } = await supabase
        .from('ticker_items')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) throw error;

      if (tickerData) {
        setData({
          items: tickerData.items || [],
          background_color: tickerData.background_color || '#FEFDF8',
          text_color: tickerData.text_color || '#677567',
          separator: tickerData.separator || '',
          animation_duration: tickerData.animation_duration || 28,
          logo_height: tickerData.logo_height || '2rem',
        });
      }
    } catch (err) {
      console.error('Error fetching ticker:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="w-full py-8 bg-[#FEFDF8] animate-pulse"></div>;
  }

  if (!data || !data.items.length) {
    return null;
  }

  return (
    <div
      className="relative overflow-hidden w-full py-1 md:py-1"
      style={{
        backgroundColor: data.background_color,
        color: data.text_color,
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header - EXACT same style as AboutMe */}
        <div className="text-black text-center mb-10 md:mb-12">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight">
            Brands{" "}
            <span className="relative inline-block">
              <span className="relative z-10"> </span>
              <span className="relative z-10 font-editorial italic">I've worked with</span>
              <span className="absolute inset-0 -z-0 overflow-hidden">
                <img
                  src="/Landing/HERO/2.png"
                  alt=""
                  className="absolute object-cover"
                  style={{
                    objectPosition: 'center',
                    top: '40%',
                    left: '70%',
                    transform: 'translate(-50%, -50%)',
                    width: '20%',
                    height: '120%',
                    minWidth: '90%',
                  }}
                />
              </span>
            </span>
          </h2>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
        <div 
          className="flex whitespace-nowrap animate-scroll"
          style={{
            display: 'flex',
            width: 'max-content',
            animationDuration: `${data.animation_duration}s`,
          }}
        >
          {[...data.items, ...data.items].map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="inline-flex items-center gap-3 mx-3 md:mx-4"
            >
              {item.logo_url && (
                <img
                  src={item.logo_url}
                  alt={item.text}
                  className="object-contain filter hover:grayscale-0 transition-all duration-300"
                  style={{ height: data.logo_height }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <span className="text-xl md:text-2xl font-normal whitespace-nowrap">
                {item.text}
              </span>
              <span className="text-xl md:text-2xl mx-2 opacity-50">
                {data.separator}
              </span>
            </div>
          ))}
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
      `}</style>
    </div>
  );
}