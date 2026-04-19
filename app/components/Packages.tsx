export default function Packages() {
  return (
    <section className="w-full py-16 px-6 bg-[#f5f3ef]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">

        {/* Card 1 - Package1.png background */}
        <div
          className="relative rounded-2xl border-2 border-black p-6 shadow-sm overflow-hidden"
          style={{
            backgroundImage: "url('/Landing/Package1.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md rounded-2xl -z-0" />

          {/* Content */}
          <div className="relative z-10">
            {/* Tag Row */}
            <div className="flex items-center justify-between mb-4">
              <span
                className="px-3 py-0.5 text-xs font-semibold rounded-full border border-black"
                style={{ backgroundColor: '#FED301', color: '#000000' }}
              >
                For Brands
              </span>

              <span className="text-xs text-black">For food businesses</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-semibold text-black leading-tight mb-4">
              You're posting. You're not growing.
              <br />
              Let's fix the <em className="font-serif italic">actual</em> problem.
            </h2>

            {/* Description */}
            <p className="text-black mb-4 leading-relaxed text-sm opacity-80">
              Most food and hospitality brands have a content output problem and a
              story clarity problem. I help them figure out what they actually stand
              for, build a system their team can run, and create the kind of content
              that builds real loyalty rather than just likes
            </p>

            {/* Bullet Points */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-black mb-5 text-sm">
              <li className="list-none">• Brand storytelling and messaging</li>
              <li className="list-none">• Content strategy and systems</li>
              <li className="list-none">• Team training and SOPs</li>
              <li className="list-none">• Origin video series production</li>
            </div>

            {/* Button */}
            <div className="flex justify-end">
              <a href="/brands">
                <button className="bg-black text-white px-4 py-1.5 rounded-full text-xs hover:opacity-80 transition">
                  See brand offers →
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* Card 2 - Package2.png background */}
        <div
          className="relative rounded-2xl border-2 border-black p-6 shadow-sm overflow-hidden"
          style={{
            backgroundImage: "url('/Landing/Package2.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md rounded-2xl -z-0" />

          {/* Content */}
          <div className="relative z-10">
            {/* Tag Row */}
            <div className="flex items-center justify-between mb-4">
              <span
                className="px-3 py-0.5 text-xs font-semibold rounded-full border border-black"
                style={{ backgroundColor: '#B2D235', color: '#000000' }}
              >
                For Individuals
              </span>

              <span className="text-xs text-black">For founders and professionals</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-semibold text-black leading-tight mb-4">
              Your work is <em className="font-serif italic">exceptional</em>. Does your
              online presence say that?
            </h2>

            {/* Description */}
            <p className="text-black mb-4 leading-relaxed text-sm opacity-80">
              I work with ambitious people in food and hospitality who are doing
              extraordinary things and whose personal brand doesn't reflect that yet.
              The right story, told well, opens more doors than any CV or cold pitch
              ever will.
            </p>

            {/* Bullet Points */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-black mb-5 text-sm">
              <li className="list-none">• Origin story and narrative</li>
              <li className="list-none">• Messaging audit & positioning</li>
              <li className="list-none">• Personal brand strategy</li>
              <li className="list-none">• AI tools for workflow</li>
            </div>

            {/* Button */}
            <div className="flex justify-end">
              <a href="/people">
                <button className="bg-black text-white px-4 py-1.5 rounded-full text-xs hover:opacity-80 transition">
                  See individual offers →
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}