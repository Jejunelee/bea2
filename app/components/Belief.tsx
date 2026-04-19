"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

export default function Belief() {
    const beliefs = [
        {
            title: "On Content",
            headline: (
                <>
                    You don't have a content problem.
                    <br />
                    You have a clarity problem.
                </>
            ),
            description: "Volume isn't strategy. Until you know what you stand for and who you're talking to, posting more just makes more noise. I've watched brands post every day for a year and go nowhere. Frequency is not the answer.",
        },
        {
            title: "On AI",
            headline: (
                <>
                    AI won't replace your voice.
                    <br />
                    Generic prompts will.
                </>
            ),
            description: "The brands winning with AI aren't using it to produce faster. They're using it to think clearer. That's the difference between sounding like everyone and sounding unmistakably like you. I'll show you how to get there.",
        },
        {
            title: "On food founders",
            headline: (
                <>
                    The best food stories aren't
                    <br />
                    about food.
                </>
            ),
            description: "They're about obsession, sacrifice, identity, and culture. The founders who build real audiences understand this instinctively. They're not selling a product. They're sharing a worldview. That's what I help you find, shape, and put into the world.",
        },
    ];

    const containerRef = useRef(null);
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    // Parallax transforms for hero section - NO FADE
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]); // Only moves up slightly

    return (
        <section ref={containerRef} className="font-helvetica overflow-hidden">
            {/* HERO IMAGE with parallax - no fade */}
            <motion.div
                ref={heroRef}
                className="h-[160px] flex items-center justify-center text-center relative overflow-hidden"
                style={{
                    y: heroY, // Only parallax movement, no opacity change
                }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: "url('/Landing/Vector.png')",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundColor: "#f3f3f3",
                    }}
                >
                    {/* overlay for readability */}
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
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
                        THINGS I ACTUALLY BELIEVE
                    </motion.p>

                    <motion.h2
                        className="text-black/80 text-4xl md:text-5xl font-medium"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Opinions <span className="font-editorial italic">worth</span> having
                    </motion.h2>
                </motion.div>
            </motion.div>

            {/* BELIEF CONTENT with fade-in on scroll */}
            <div className="bg-black text-white py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-12">
                        {beliefs.map((belief, index) => {
                            const ref = useRef(null);
                            const isInView = useInView(ref, { once: true, amount: 0.3 });

                            return (
                                <motion.div
                                    key={index}
                                    ref={ref}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                                    transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                                >
                                    <motion.h3
                                        className="text-4xl font-medium mb-4"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                                    >
                                        {belief.title}
                                    </motion.h3>

                                    <motion.p
                                        className="text-[25px] leading-relaxed font-medium font-editorial"
                                        initial={{ opacity: 0 }}
                                        animate={isInView ? { opacity: 1 } : {}}
                                        transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                                    >
                                        {belief.headline}
                                    </motion.p>

                                    <motion.div
                                        className="border-b border-neutral-700 my-6 w-full"
                                        initial={{ scaleX: 0 }}
                                        animate={isInView ? { scaleX: 1 } : {}}
                                        transition={{ duration: 0.6, delay: index * 0.15 + 0.4 }}
                                        style={{ originX: 0 }}
                                    />

                                    <motion.p
                                        className="text-white leading-tight text-[20px]"
                                        initial={{ opacity: 0 }}
                                        animate={isInView ? { opacity: 1 } : {}}
                                        transition={{ duration: 0.5, delay: index * 0.15 + 0.5 }}
                                    >
                                        {belief.description}
                                    </motion.p>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* CTA BUTTON */}
                    <motion.div
                        className="flex justify-center mt-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <motion.button
                            className="font-helvetica border-3 border-white bg-[#ADDDB1] text-black px-6 py-1.5 rounded-full text-lg font-medium hover:bg-[#bdd8bf] transition cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Read more on Substack →
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}