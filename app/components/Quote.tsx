"use client";

import { useEffect, useState, useRef } from "react";

export default function Quote() {
  const sectionRef = useRef<HTMLElement>(null);

  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [smoothPos, setSmoothPos] = useState({ x: 0, y: 0 });
  const [isInside, setIsInside] = useState(false);

  // smooth interpolation for cinematic feel
  useEffect(() => {
    let raf: number;

    const animate = () => {
      setSmoothPos(prev => ({
        x: prev.x + (pos.x - prev.x) * 0.08,
        y: prev.y + (pos.y - prev.y) * 0.08,
      }));

      raf = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(raf);
  }, [pos]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();

      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      setIsInside(inside);

      if (!inside) return;

      setPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const percentX =
    sectionRef.current && smoothPos.x
      ? smoothPos.x / sectionRef.current.offsetWidth
      : 0;

  const percentY =
    sectionRef.current && smoothPos.y
      ? smoothPos.y / sectionRef.current.offsetHeight
      : 0;

  const move = (strength: number) => ({
    x: (percentX - 0.5) * strength,
    y: (percentY - 0.5) * strength,
  });

  const bg = move(120);
  const mid = move(60);
  const glow = move(80);
  const text = move(40);
  const particles = move(150);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      style={{ cursor: isInside ? "none" : "auto" }}
    >
      {/* DEPTH 1 — far gradient */}
      <div
        className="absolute inset-0 transition-transform duration-200"
        style={{
          background:
            "radial-gradient(circle at center, #f3f1df 0%, #e6e9b8 50%, #e9c08f 100%)",
          transform: `
            translate(${bg.x}px, ${bg.y}px)
            scale(1.15)
          `,
        }}
      />

      {/* DEPTH 2 — floating blobs */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${mid.x}px, ${mid.y}px)`,
        }}
      >
        <div className="absolute top-[20%] left-[10%] w-[260px] h-[260px] bg-[#dfe87a]/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[15%] w-[300px] h-[300px] bg-[#e9c08f]/40 blur-[120px] rounded-full" />
        <div className="absolute top-[60%] left-[30%] w-[200px] h-[200px] bg-[#ffffff]/40 blur-[100px] rounded-full" />
      </div>

      {/* DEPTH 3 — particles */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${particles.x}px, ${particles.y}px)`,
        }}
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-black/10 rounded-full"
            style={{
              top: `${20 + i * 8}%`,
              left: `${10 + i * 9}%`,
            }}
          />
        ))}
      </div>

      {/* DEPTH 4 — glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[700px] h-[700px] bg-[#e6ee9c]/30 blur-[140px] rounded-full"
          style={{
            transform: `
              translate(${glow.x}px, ${glow.y}px)
              scale(${1 + percentX * 0.2})
            `,
          }}
        />
      </div>

      {/* X-ray cursor */}
      {isInside && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            left:
              sectionRef.current!.getBoundingClientRect().left + smoothPos.x,
            top:
              sectionRef.current!.getBoundingClientRect().top + smoothPos.y,

            width: 200,
            height: 200,
            borderRadius: "50%",

            transform: `
              translate(-50%, -50%)
              scale(${1.05 + percentY * 0.1})
            `,

            background:
              "radial-gradient(circle at 40% 40%, rgba(255,255,255,0.95), rgba(255,255,255,0.8), rgba(255,255,255,0.4))",

            mixBlendMode: "difference",
            boxShadow: "0 0 60px rgba(255,235,170,0.5)",
          }}
        />
      )}

      {/* CONTENT */}
      <div
        className="relative z-10 max-w-3xl px-6 text-center"
        style={{
          transform: `
            translate(${text.x}px, ${text.y}px)
          `,
        }}
      >
        <p className="text-[26px] md:text-[32px] leading-relaxed font-medium text-black">
          The food and hospitality industry is full of{" "}
          <span className="italic font-serif">brilliant</span>{" "}
          operators who are{" "}
          <span className="bg-[#dfe87a] px-1 rounded">
            invisible online
          </span>.
          {" "}They're building{" "}
          <span className="italic font-serif">
            extraordinary
          </span>{" "}
          things, and their{" "}
          <span className="bg-[#dfe87a] px-1 rounded">
            content
          </span>{" "}
          looks like everyone else's. That's the gap I work in.
        </p>

        <div className="mt-20 flex justify-center">
          <svg
            width="32"
            height="60"
            viewBox="0 0 24 64"
            fill="none"
            stroke="black"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-bounce"
          >
            <path d="M12 2v56" />
            <path d="M5 51l7 9 7-9" />
          </svg>
        </div>
      </div>
    </section>
  );
}