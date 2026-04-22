"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { TickerSettings } from "@/app/types/ticker";

export default function Ticker() {
  const [settings, setSettings] = useState<Partial<TickerSettings>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('ticker_items')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (data) {
        setSettings(data);
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  if (loading) {
    return <div className="w-full py-8 bg-gray-100"></div>;
  }

  const items = settings.items || [
    "CCA Manila",
    "anana",
    "Access Travel",
    "HUNGRY Podcast",
    "ASHA",
    "What's On Your Plate",
    "Explora Ahora",
  ];

  const animationDuration = settings.animation_duration || 28;

  return (
    <div
      className="relative overflow-hidden w-full py-8 font-helvetica"
      style={{
        backgroundColor: settings.background_color || "#ADDDB1",
        color: settings.text_color || "#677567",
      }}
    >
      <div 
        className="flex whitespace-nowrap"
        style={{
          display: 'flex',
          width: 'max-content',
          animation: `ticker ${animationDuration}s linear infinite`,
        }}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="text-2xl md:text-3xl tracking-wide font-normal"
          >
            {item}
            <span className="mx-4">{settings.separator || "✦"}</span>
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes ticker {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}