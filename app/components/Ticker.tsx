"use client"

import React from "react"

const items = [
  "CCA Manila",
  "anana",
  "Access Travel",
  "HUNGRY Podcast",
  "ASHA",
  "What's On Your Plate",
  "Explora Ahora",
]

export default function Ticker() {
  return (
    <div
      className="relative overflow-hidden w-full py-8 font-helvetica"
      style={{
        backgroundColor: "#ADDDB1",
        color: "#677567",
      }}
    >
      <div className="flex whitespace-nowrap animate-ticker">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="text-2xl md:text-3xl tracking-wide font-normal"
          >
            {item}
            <span className="mx-4">✦</span>
          </span>
        ))}
      </div>

      <style jsx>{`
        .animate-ticker {
          display: flex;
          width: max-content;
          animation: ticker 28s linear infinite;
        }

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
  )
}