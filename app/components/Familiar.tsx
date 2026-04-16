"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";

const cards = [
  {
    id: 1,
    image: "/1.JPG",
    title: "I'm posting. Nothing's building.",
    description:
      "Six months of content, same reach. You're consistent, but consistency alone isn't doing what they promised it would. You're starting to wonder if experimentation is the missing piece, or if the problem runs deeper than that.",
  },
  {
    id: 2,
    image: "/1.JPG",
    title: "I sound like everyone else.",
    description:
      "Your ideas are good. But they come out like templates. You open the app, see three people saying exactly what you were going to say, and close it again.",
  },
  {
    id: 3,
    image: "/1.JPG",
    title: "I hired an agency, but they're not a growth partner.",
    description:
      "They deliver content on time and call it done. But nobody in that office loses sleep over whether your business is actually growing. You don't need a vendor. You need someone who's invested in the outcome.",
  },
  {
    id: 4,
    image: "/1.JPG",
    title: "My competitors just look more legit.",
    description:
      "Same expertise, sometimes less. But their story is clearer and you can't figure out what they're doing that you're not. The difference usually isn't budget. It's clarity.",
  },
];

export default function Familiar() {
  const scrollToCard = (index: number) => {
    const element = document.getElementById(`card-${index}`);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full bg-[white]">
      {/* Sticky Heading */}
      <div className="top-0 z-30 bg-[white] py-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-black text-4xl md:text-5xl font-semibold tracking-tight">
            Sounds <span className="text-black italic font-normal">familiar?</span>
          </h2>
          <p className="mt-4 text-gray-600 text-lg">
            The things nobody says out loud, but everyone feels.
          </p>
        </div>
      </div>

      {/* Cards */}
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

                  <h3 className="text-3xl md:text-4xl font-semibold mb-4">{card.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{card.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}