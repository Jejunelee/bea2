// components/Newsletter.tsx
"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Newsletter() {
  const pathname = usePathname();

  useEffect(() => {
    // Check if we have a hash in the URL and if it's the newsletter section
    if (window.location.hash === '#newsletter-section' && pathname === '/') {
      // Small delay to ensure the DOM is fully loaded
      setTimeout(() => {
        const newsletterSection = document.getElementById('newsletter-section');
        if (newsletterSection) {
          newsletterSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [pathname]);

  const handleSubscribe = () => {
    window.open("https://onyourplate.substack.com/", "_blank", "noopener,noreferrer");
  };

  const substackTiles = [
    {
      id: 1,
      title: "The Journalist Who Went Back to Basics",
      description: "What Doris Lam learned by staging in top kitchens—and how it changed her approach to life and work.",
      date: "Jul 28, 2025",
      readTime: "8 min read",
      articleUrl: "https://onyourplate.substack.com/p/the-journalists-appetite",
      imageUrl: "https://substackcdn.com/image/fetch/$s_!CB7F!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff67b1b78-da31-4382-bc9b-4888cb73acc6_1500x1772.jpeg",
    },
    {
      id: 2,
      title: "Should You Follow Your Passion? Or Just Be Practical?",
      description: "What a chef from a Michelin-starred restaurant taught me about finding your path.",
      date: "Jul 8, 2025",
      readTime: "6 min read",
      articleUrl: "https://onyourplate.substack.com/p/should-you-follow-your-passion-or",
      imageUrl: "https://substackcdn.com/image/fetch/$s_!fbrW!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F829eb16b-96c3-46e4-8967-2e465e19d749_1440x1804.jpeg",
    },
    {
      id: 3,
      title: "What 13 Years in the Kitchen Taught This MasterChef Winner",
      description: "Chef Lefteris spent over a decade honing his craft — through long hours, quiet growth, and a steady pursuit of excellence.",
      date: "Apr 16, 2025",
      readTime: "7 min read",
      articleUrl: "https://onyourplate.substack.com/p/what-13-years-in-the-kitchen-taught",
      imageUrl: "https://substackcdn.com/image/fetch/$s_!STTl!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F23f2e8aa-1132-4331-8cec-431165797546_834x625.jpeg",
    },
  ];

  return (
    <section 
      id="newsletter-section"
      className="py-16 sm:py-20 md:py-24 scroll-mt-20"
      style={{ backgroundColor: '#f5f5f5' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-black mb-4 sm:mb-6">
            Type Harder, the Newsletter
          </h2>
          
          <p className="font-helvetica text-base sm:text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
          Brand studies, lessons from inside the work, and what's worth borrowing from across the industry.
          </p>

          <button
            onClick={handleSubscribe}
            className="px-8 sm:px-10 py-3 sm:py-4 bg-black text-white font-helvetica font-medium rounded-full hover:bg-[#fc9aae] transition-all duration-200 active:scale-95 text-base sm:text-lg w-full sm:w-auto min-w-[200px] cursor-pointer"
          >
            Subscribe free
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {substackTiles.map((tile) => (
            <article
              key={tile.id}
              onClick={() => window.open(tile.articleUrl, "_blank", "noopener,noreferrer")}
              className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
            >
              <div className="relative w-full h-48 sm:h-52 md:h-56 bg-gray-100 overflow-hidden">
                <img 
                  src={tile.imageUrl}
                  alt={tile.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500 mb-3 font-helvetica">
                  <span>{tile.date}</span>
                  <span>•</span>
                  <span>{tile.readTime}</span>
                </div>
                
                <h3 className="font-editorial text-xl sm:text-2xl font-semibold text-black mb-2 leading-tight group-hover:text-[#fc9aae] transition-colors line-clamp-2">
                  {tile.title}
                </h3>
                
                <p className="font-helvetica text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-3">
                  {tile.description}
                </p>
                
                <div className="mt-4">
                  <span className="inline-flex items-center text-sm font-medium text-black group-hover:text-[#fc9aae] group-hover:underline transition-colors">
                    Read more
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12 sm:mt-16">
          <a
            href="https://onyourplate.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm sm:text-base font-helvetica text-gray-600 hover:text-black transition-colors"
          >
            View all articles on Substack
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}