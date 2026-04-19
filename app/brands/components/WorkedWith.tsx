export default function WorkedWith() {
    const brands = [
        { name: "Brand 1", logo: "/WorkedWith/brand1.png" },
        { name: "Brand 2", logo: "/WorkedWith/brand2.png" },
        { name: "Brand 3", logo: "/WorkedWith/brand3.png" },
        { name: "Brand 4", logo: "/WorkedWith/brand4.png" },
    ];

    return (
        <section className="mb-10 bg-black text-white py-16 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Heading - matches Belief's style with lowercase and editorial font */}
                <p className="text-lg tracking-[0.1em] text-white/90 mb-4">
                    Some of the <span className="font-editorial italic font-semibold">brands</span> and <span className="font-editorial italic font-semibold">people</span> I've worked with
                </p>

                {/* Divider - matches Belief's border style */}
                <div className="border-b border-neutral-700 w-full mb-12" />

                {/* Logos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {brands.map((brand, index) => (
                        <div
                            key={index}
                            className="bg-neutral-800 aspect-square flex items-center justify-center rounded-lg"
                        >
                            {/* Replace with Image when logos are ready */}
                            {/* 
                            <Image
                                src={brand.logo}
                                alt={brand.name}
                                width={200}
                                height={200}
                                className="object-contain"
                            />
                            */}
                            <span className="text-neutral-500 text-sm">{brand.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}