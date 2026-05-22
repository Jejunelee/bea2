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

    // Subscribe to real-time changes
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
          background_color: tickerData.background_color || '#ADDDB1',
          text_color: tickerData.text_color || '#677567',
          separator: tickerData.separator || '✦',
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
    return <div className="w-full py-8 bg-gray-100 animate-pulse"></div>;
  }

  if (!data || !data.items.length) {
    return null;
  }

  return (
    <div
      className="relative overflow-hidden w-full py-8"
      style={{
        backgroundColor: data.background_color,
        color: data.text_color,
      }}
    >
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
            className="inline-flex items-center gap-2 mx-2"
          >
            {item.logo_url && (
              <img
                src={item.logo_url}
                alt={item.text}
                className="object-contain"
                style={{ height: data.logo_height }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <span className="text-2xl md:text-3xl font-normal whitespace-nowrap">
              {item.text}
            </span>
            <span className="text-2xl md:text-3xl mx-2">
              {data.separator}
            </span>
          </div>
        ))}
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
      `}</style>
    </div>
  );
}