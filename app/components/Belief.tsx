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

    return (
        <section className="font-helvetica">
            {/* HERO IMAGE */}
            <div
                className="h-[160px] flex items-center justify-center text-center relative"
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

                <div className="relative z-10">
                    <p className="text-lg tracking-[0.1em] text-black/60">
                        THINGS I ACTUALLY BELIEVE
                    </p>

                    <h2 className="text-black/80 text-4xl md:text-5xl font-medium">
                        Opinions <span className="font-editorial italic">worth</span> having
                    </h2>
                </div>
            </div>

            {/* BELIEF CONTENT */}
            <div className="bg-black text-white py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-12">
                        {beliefs.map((belief, index) => (
                            <div key={index}>
                                <h3 className="text-4xl font-medium mb-4">
                                    {belief.title}
                                </h3>

                                <p className="text-[25px] leading-relaxed font-medium font-editorial">
                                    {belief.headline}
                                </p>

                                {/* Fixed border - now spans full width */}
                                <div className="border-b border-neutral-700 my-6 w-full"></div>

                                <p className="text-white leading-tight text-[20px]">
                                    {belief.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* CTA BUTTON */}
                    <div className="flex justify-center mt-16">
                        <button className="font-helvetica border-3 border-white bg-[#ADDDB1] text-black px-6 py-1.5 rounded-full text-lg font-medium hover:bg-[#bdd8bf] transition">
                            Read more on Substack →
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}