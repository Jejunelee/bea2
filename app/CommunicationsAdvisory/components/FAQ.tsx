// app/components/advisory/FAQ.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { AdvisoryFAQSettings, AdvisoryFAQItem } from "@/app/types/advisory";

export default function FAQ() {
  const [settings, setSettings] = useState<Partial<AdvisoryFAQSettings>>({});
  const [faqs, setFaqs] = useState<AdvisoryFAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const defaultFaqs: AdvisoryFAQItem[] = [
    { id: 1, question: "How is this different from Fractional Comms?", answer: "In Fractional, I am embedded in the business, running the work. In Advisory, you run the work, and I make sure the strategy behind it is right. Advisory is done-with-you. Fractional is done-for-you.", display_order: 1 },
    { id: 2, question: "Who is Advisory best for?", answer: "Founders with a small in-house team or a set of freelancers who need strategic direction, not more execution. Also, founders who want to build their own comms capability over time with senior guidance.", display_order: 2 },
    { id: 3, question: "Can I start with Advisory and move to Fractional?", answer: "Yes, and it is a natural progression. A lot of clients use Advisory to get the strategy right and build internal capability, then move to Fractional when the scope grows beyond what the team can handle.", display_order: 3 },
    { id: 4, question: "What is the investment?", answer: "Advisory is priced below Fractional to reflect the difference in time and ownership. The rate is confirmed in the proposal based on the monthly structure agreed.", display_order: 4 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const { data: settingsData } = await supabase.from('advisory_faq_settings').select('*').eq('id', 1).single();
      if (settingsData) setSettings(settingsData);
      const { data: faqsData } = await supabase.from('advisory_faq_items').select('*').order('display_order', { ascending: true });
      if (faqsData && faqsData.length > 0) setFaqs(faqsData);
      else setFaqs(defaultFaqs);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const currentSection = sectionRef.current;
    if (!currentSection || loading) return;
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting && !hasAnimated) setHasAnimated(true); }); },
      { threshold: 0.2, rootMargin: "0px 0px -100px 0px" }
    );
    observer.observe(currentSection);
    return () => { if (currentSection) observer.unobserve(currentSection); };
  }, [hasAnimated, loading]);

  const toggleFAQ = (index: number) => setOpenIndex(openIndex === index ? null : index);

  if (loading) return <div className="w-full py-16" style={{ backgroundColor: '#f5f3ef' }}></div>;

  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;

  if (isMobile) {
    return (
      <section ref={sectionRef} className="relative w-full py-16 px-4 overflow-hidden" style={{ backgroundColor: '#f5f3ef' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#e9c08f]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#e6ee9c]/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-medium text-black tracking-tight font-helvetica">Frequently <span className="font-editorial italic">asked</span></h2>
            <div className="w-12 h-px bg-black/20 mx-auto mt-3" />
          </div>
          <div className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="space-y-3">
              {displayFaqs.map((faq, idx) => (
                <div key={faq.id} className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`} style={{ transitionDelay: `${idx * 50}ms` }}>
                  <button onClick={() => toggleFAQ(idx)} className="w-full text-left py-3 px-4 bg-white/50 rounded-lg flex justify-between items-center gap-3">
                    <span className="text-sm font-medium text-black font-helvetica">{faq.question}</span>
                    <span className="text-black/40 text-lg flex-shrink-0">{openIndex === idx ? "−" : "+"}</span>
                  </button>
                  {openIndex === idx && <div className="px-4 py-3 text-sm text-black/60 leading-relaxed font-helvetica border-l-2 border-black/10 ml-2">{faq.answer}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative w-full py-28 px-6 sm:px-8 lg:px-12 overflow-hidden" style={{ backgroundColor: '#f5f3ef' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-[5%] w-[300px] h-[300px] bg-[#e9c08f]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[10%] w-[400px] h-[400px] bg-[#e6ee9c]/20 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium text-black tracking-tight font-helvetica">
            Frequently <span className="font-editorial italic">asked</span>
          </h2>
          <div className="w-16 h-px bg-black/20 mx-auto mt-4" />
        </div>
        <div className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="space-y-3">
            {displayFaqs.map((faq, idx) => (
              <div key={faq.id} className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`} style={{ transitionDelay: `${idx * 50}ms` }}>
                <button onClick={() => toggleFAQ(idx)} className="w-full text-left py-4 px-5 bg-white/50 rounded-xl flex justify-between items-center gap-4 hover:bg-white/70 transition-colors">
                  <span className="text-base md:text-lg font-medium text-black font-helvetica">{faq.question}</span>
                  <span className="text-black/30 text-xl md:text-2xl flex-shrink-0">{openIndex === idx ? "−" : "+"}</span>
                </button>
                {openIndex === idx && <div className="px-5 py-4 text-base md:text-lg text-black/60 leading-relaxed font-helvetica border-l-2 border-black/10 ml-6">{faq.answer}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}