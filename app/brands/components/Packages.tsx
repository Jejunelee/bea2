export default function Packages() {
    return (
      <section className="w-full py-16 px-6 bg-[#ffffff]">
        <div className="max-w-7xl mx-auto">
          {/* Header Title */}
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-xl lg:text-2xl font-medium text-black tracking-tight">
              DEEPER ENGAGEMENTS: WHEN YOU'RE READY TO BUILD
            </h2>
          </div>
          
          {/* Grid Container for Cards */}
          <div className="grid md:grid-cols-2 gap-6">
          
            {/* Card 1 - Messaging and Asset Sprint */}
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
    
                  <span className="text-xs text-black"></span>
                </div>
    
                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-semibold text-black leading-tight mb-2">
                  Messaging and Asset Sprint
                </h2>
    
                {/* Subtitle */}
                <p className="text-black mb-4 leading-relaxed text-2xl font-editorial ">
                  The story foundation that makes everything else easier.
                </p>
    
                {/* Description */}
                <p className="text-black mb-4 leading-tight text-lg opacity-80">
                  Over 2 to 3 weeks, we build the messaging architecture, brand narrative, and core assets that make everything else in your business easier: pitches, content, press, partnerships. This is for brands that are ready to stop guessing and start compounding.
                </p>
    
                {/* Bullet Points */}
                <div className="space-y-1 text-black mb-5 text-lg">
                  <li className="list-none">• Brand narrative and messaging framework</li>
                  <li className="list-none">• Core copy assets — bio, about page, homepage</li>
                  <li className="list-none">• Content direction and tone guidelines</li>
                </div>
    
                {/* Button */}
                <div className="flex justify-end">
                  <button className="bg-black text-white px-4 py-1.5 rounded-full text-md hover:opacity-80 transition">
                  From £1,500 / flat fee, fixed scope
                  </button>
                </div>
              </div>
            </div>
    
            {/* Card 2 - Content and Influence System */}
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
    
                  <span className="text-xs text-black"></span>
                </div>
    
                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-semibold text-black leading-tight mb-2">
                  Content and Influence System
                </h2>
    
                {/* Subtitle */}
                <p className="font-editorial text-black mb-4 leading-relaxed text-2xl">
                  90 days. The whole engine. Built to last.
                </p>
    
                {/* Description */}
                <p className="text-black mb-4 leading-tight text-lg opacity-80">
                  Full origin story. Content system built from scratch. Team hired and briefed. Revenue stream mapped. Monthly strategy calls included. This is the engagement for brands and founders who are serious about building something that compounds over time, not just content that gets consumed and forgotten.
                </p>
    
                {/* Bullet Points */}
                <div className="space-y-1 text-black mb-5 text-lg">
                  <li className="list-none">• Full narrative and content architecture</li>
                  <li className="list-none">• Editor or team hired and onboarded</li>
                  <li className="list-none">• Monthly advisory calls included</li>
                </div>
    
                {/* Button */}
                <div className="flex justify-end">
                  <button className="bg-black text-white px-4 py-1.5 rounded-full text-md hover:opacity-80 transition">
                  From £2,500 / 90-day engagement
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <p className="text-black text-4xl mb-1">Not sure what works for you?</p>
            <p className="text-black text-2xl font-base mb-4">Let's talk about it!</p>
            <button 
              className="px-6 py-0.5 rounded-full text-black text-lg font-medium border-2 border-black hover:opacity-80 transition"
              style={{ backgroundColor: '#FF7A95' }}
            >
              Book a call
            </button>
          </div>
        </div>
      </section>
    );
  }