export default function Section1() {
    return (
      <section className="w-full bg-[#FFFBE7] py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          
          {/* LEFT CONTENT */}
          <div>
            <p className="text-2xl tracking-widest uppercase text-black mb-6">
              Most Popular | Messaging Audit
            </p>
  
            <h2 className="text-4xl md:text-5xl font-medium text-[#FF7A95] leading-tight mb-6">
              One Session. One Direction. Real Clarity.
            </h2>
  
            <p className="text-xl text-black/80 mb-6 max-w-xl">
              A Focused 90-Minute Deep Dive Into Your Brand, Your Story Gaps, And One
              Clear Path Forward. You Leave The Session Knowing Exactly What To Say
              And, Just As Importantly, What To Stop Saying.
            </p>
  
            <ul className="space-y-2 text-black/90 mb-8 text-xl">
              <li>• Pre-Session Brand And Content Review</li>
              <li>• Live 90-Minute Strategy Session</li>
              <li>• Written Brief And Next-Step Roadmap</li>
            </ul>
  
            <button className="text-xl bg-[#FF7A95] text-black font-medium px-6 py-1.5 rounded-full border border-black shadow-sm hover:opacity-90 transition">
              £500 / one-off, flat fee
            </button>
          </div>
  
  
          {/* RIGHT IMAGE */}
          <div className="relative w-full h-[420px] md:h-[520px]">
            <img
              src="/people/computer.png"
              alt="Messaging audit preview"
              className="object-cover w-full h-full rounded-3xl shadow-md"
            />
          </div>
  
        </div>
      </section>
    );
  }