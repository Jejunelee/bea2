// app/components/fractional/CaseStudies.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { CaseStudySettings, CaseStudy } from "@/app/types/FractionalCommunication/CaseStudies";

export default function CaseStudies() {
  const [settings, setSettings] = useState<Partial<CaseStudySettings>>({});
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const defaultCaseStudies: CaseStudy[] = [
    {
      id: 1,
      title: "CCA Manila",
      description: "CCA Manila is the Philippines' first culinary school, founded in 1996 by my grandmother and now run by my mother as CEO. I sit as Brand and Communications Director, leading institutional storytelling, alumni programming, and the school's 30th anniversary publication, *Kitchen Stories*. Through a brand strategy built around heritage, craft, and chef community, the school's student population has grown 10x post-pandemic, with most leads arriving as fans of the brand before they ever enquire.",
      category: "Culinary education",
      display_order: 1,
    },
    {
      id: 2,
      title: "anana",
      description: "anana is an Italian heritage recipe platform building generational kitchen wisdom on Substack, founded by Teodoro Mefalopoulos and listed in the Forbes 30 Under 30. I lead the Substack content strategy, including the launch of the paid Heritage Keeper subscription tier. By treating Substack as the primary channel rather than a place to recycle content, we grew to almost 10K subscribers and #28 on the Food and Drink Substack chart, building a community that comes for stories told side-by-side with real nonnas.",
      category: "Food media",
      display_order: 2,
    },
    {
      id: 3,
      title: "HUNGRY",
      description: "HUNGRY is a London-based food and drink podcast and live events brand, hosted by Dan Pope. I work closely with the founder in event strategy, including the Hungry Supper Club with Rory Sutherland, an Uber Eats partnership integration, and on-the-night content production. The work translates a digital-first podcast brand into a live experience without losing voice or commercial intent.",
      category: "Food media",
      display_order: 3,
    },
    {
      id: 4,
      title: "Access Travel",
      description: "Access Travel is a Manila-based luxury travel company founded by Angely Dub, specialising in private high-touch journeys for global travellers. I provide ongoing fractional communications support, including LinkedIn content strategy, destination-led newsletters, founder voice, and ghostwriting across press and partnerships. The result is a founder-led brand whose story now feels personal, specific, and unmistakably Angely's own, attracting the right inbound from premium travellers and operators.",
      category: "Travel and hospitality",
      display_order: 4,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const { data: settingsData } = await supabase.from('fractional_casestudy_settings').select('*').eq('id', 1).single();
      if (settingsData) setSettings(settingsData);
      const { data: caseStudiesData } = await supabase.from('fractional_case_studies').select('*').order('display_order', { ascending: true });
      if (caseStudiesData && caseStudiesData.length > 0) setCaseStudies(caseStudiesData);
      else setCaseStudies(defaultCaseStudies);
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

  if (loading) return <div className="w-full py-16" style={{ backgroundColor: '#fefdf8' }}></div>;

  const displayCaseStudies = caseStudies.length > 0 ? caseStudies : defaultCaseStudies;

  const renderTitle = (title: string) => {
    const emphasisMap: Record<string, string> = {
      "CCA Manila": "CCA Manila",
      "anana": "anana",
      "HUNGRY": "HUNGRY",
      "Access Travel": "Access Travel"
    };
    
    const emphasisWord = emphasisMap[title];
    if (emphasisWord) {
      const parts = title.split(emphasisWord);
      return <>{parts[0]}<span className="font-editorial italic text-black">{emphasisWord}</span>{parts[1]}</>;
    }
    return title;
  };

  if (isMobile) {
    return (
      <section ref={sectionRef} className="relative w-full py-16 px-4 overflow-hidden" style={{ backgroundColor: '#fefdf8' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#e9c08f]/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#e6ee9c]/15 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-medium text-black tracking-tight font-helvetica">Case <span className="font-editorial italic">studies</span></h2>
            <div className="w-12 h-px bg-black/20 mx-auto mt-3" />
          </div>
          <div className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="space-y-8">
              {displayCaseStudies.map((study, idx) => (
                <div key={study.id} className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: `${idx * 150}ms` }}>
                  <div className="border-l-2 border-black/20 pl-4">
                    <h3 className="text-lg font-semibold text-black mb-2 font-helvetica">{renderTitle(study.title)}</h3>
                    <p className="text-sm text-black/60 leading-relaxed font-helvetica mb-2">{study.description}</p>
                    <span className="text-xs uppercase tracking-wider text-black/30 font-helvetica">{study.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative w-full py-28 px-6 sm:px-8 lg:px-12 overflow-hidden" style={{ backgroundColor: '#fefdf8' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-[10%] w-[350px] h-[350px] bg-[#e9c08f]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-[5%] w-[400px] h-[400px] bg-[#e6ee9c]/15 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium text-black tracking-tight font-helvetica">
            Case <span className="font-editorial italic">studies</span>
          </h2>
          <div className="w-16 h-px bg-black/20 mx-auto mt-4" />
        </div>
        <div className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="grid md:grid-cols-2 gap-8">
            {displayCaseStudies.map((study, idx) => (
              <div key={study.id} className={`transition-all duration-700 ease-out ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: `${idx * 100}ms` }}>
                <div className="border-l-2 border-black/20 pl-6">
                  <h3 className="text-xl md:text-2xl font-semibold text-black mb-3 font-helvetica">
                    {renderTitle(study.title)}
                  </h3>
                  <p className="text-base md:text-lg text-black/60 leading-relaxed font-helvetica mb-3">
                    {study.description}
                  </p>
                  <span className="text-sm uppercase tracking-wider text-black/30 font-helvetica">{study.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}