"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import dynamic from 'next/dynamic';
import "@fortawesome/fontawesome-free/css/all.min.css";
import useEmblaCarousel from "embla-carousel-react";

// Dynamically import embed components with SSR disabled
const InstagramEmbed = dynamic(
  () => import('react-social-media-embed').then(mod => mod.InstagramEmbed),
  { ssr: false }
);

const TikTokEmbed = dynamic(
  () => import('react-social-media-embed').then(mod => mod.TikTokEmbed),
  { ssr: false }
);

const LinkedInEmbed = dynamic(
  () => import('react-social-media-embed').then(mod => mod.LinkedInEmbed),
  { ssr: false }
);

// ==================== TYPES ====================
interface SpotifyPodcast {
  embedUrl: string;
  title: string;
  platform: "spotify";
}

interface InstagramPost {
  url: string;
  caption: string;
  platform: "instagram";
}

interface TikTokPost {
  url: string;
  caption: string;
  platform: "tiktok";
}

interface LinkedInPost {
  embedUrl: string;
  postUrl: string;
  caption: string;
  platform: "linkedin";
}

type SocialItem = InstagramPost | TikTokPost | LinkedInPost | SpotifyPodcast;

// Sample data
const instagramPosts: InstagramPost[] = [
  {
    url: "https://www.instagram.com/p/DOIvxV5jwiV/?igsh=MWZrNHlsc2xueWh1aQ==",
    caption: "",
    platform: "instagram",
  },
  {
    url: "https://www.instagram.com/p/DPlcEkOjx2Q/?igsh=MnhsZmJhOWwzMTZx",
    caption: "",
    platform: "instagram",
  },
  {
    url: "https://www.instagram.com/reel/DXO51dhExRk/?igsh=bXpoODFweDdvMXhw",
    caption: "",
    platform: "instagram",
  },
];

const tiktokPosts: TikTokPost[] = [
  {
    url: "https://www.tiktok.com/@beatrinidad_/video/7593986097269476628",
    caption: "",
    platform: "tiktok",
  },
  {
    url: "https://www.tiktok.com/@beatrinidad_/video/7596739853761514773",
    caption: "",
    platform: "tiktok",
  },
  {
    url: "https://www.tiktok.com/@beatrinidad_/video/7586606077458894100",
    caption: "",
    platform: "tiktok",
  },
];

const linkedinPosts: LinkedInPost[] = [
  {
    embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7450417027036581888?collapsed=1",
    postUrl: "https://www.linkedin.com/posts/beagtrinidad_working-in-hospitality-even-briefly-can-ugcPost-7450417027036581888-69rD",
    caption: "",
    platform: "linkedin",
  },
  {
    embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7449709873270935552?collapsed=1",
    postUrl: "https://www.linkedin.com/posts/beagtrinidad_ai-isnt-a-future-problem-its-already-reshaping-ugcPost-7449709873270935552-4aPm",
    caption: "",
    platform: "linkedin",
  },
  {
    embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7450089485696045056?collapsed=1",
    postUrl: "https://www.linkedin.com/posts/beagtrinidad_networking-isnt-just-swapping-business-cards-ugcPost-7450089485696045056-1234",
    caption: "",
    platform: "linkedin",
  },
];

const spotifyPodcasts: SpotifyPodcast[] = [
  {
    embedUrl: "https://open.spotify.com/embed/episode/5s5ZBx5isGUg2kActdsuln?utm_source=generator",
    title: "",
    platform: "spotify",
  },
  {
    embedUrl: "https://open.spotify.com/embed/episode/2lmJJIIVlRcva6CiW9Z2tJ?si=61155a1a76694263",
    title: "",
    platform: "spotify",
  },
  {
    embedUrl: "https://open.spotify.com/embed/episode/7gg812xfQA9gMKiB7XieOJ?si=07973a2e1e68461b",
    title: "",
    platform: "spotify",
  },
];

type PlatformFilter = "all" | "instagram" | "tiktok" | "linkedin" | "spotify";

// ==================== HELPER FUNCTIONS ====================
const filterItemsBySearch = <T extends SocialItem>(
  items: T[],
  searchQuery: string
): T[] => {
  if (!searchQuery.trim()) return items;
  const lowerQuery = searchQuery.toLowerCase();
  return items.filter((item) => {
    if (item.platform === "spotify") {
      return item.title.toLowerCase().includes(lowerQuery);
    }
    return item.caption.toLowerCase().includes(lowerQuery);
  });
};

// ==================== MAIN COMPONENT ====================
export default function SocialFeedPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activePlatform, setActivePlatform] = useState<PlatformFilter>("all");
  const [mounted, setMounted] = useState(false);
  
  // State for expanded/collapsed sections - ALL INITIALLY COLLAPSED
  const [expandedSections, setExpandedSections] = useState({
    instagram: false,
    tiktok: false,
    linkedin: false,
    spotify: false,
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    setMounted(true);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const expandAll = () => {
    setExpandedSections({
      instagram: true,
      tiktok: true,
      linkedin: true,
      spotify: true,
    });
  };

  const collapseAll = () => {
    setExpandedSections({
      instagram: false,
      tiktok: false,
      linkedin: false,
      spotify: false,
    });
  };

  // When platform filter changes, expand the active section(s)
  useEffect(() => {
    if (activePlatform === "all") {
      // When "All" is selected, keep sections as they are
    } else {
      setExpandedSections({
        instagram: activePlatform === "instagram",
        tiktok: activePlatform === "tiktok",
        linkedin: activePlatform === "linkedin",
        spotify: activePlatform === "spotify",
      });
    }
  }, [activePlatform]);

  const showInstagram = activePlatform === "all" || activePlatform === "instagram";
  const showTikTok = activePlatform === "all" || activePlatform === "tiktok";
  const showLinkedIn = activePlatform === "all" || activePlatform === "linkedin";
  const showSpotify = activePlatform === "all" || activePlatform === "spotify";

  const filteredInstagramCount = filterItemsBySearch(instagramPosts, searchQuery).length;
  const filteredTikTokCount = filterItemsBySearch(tiktokPosts, searchQuery).length;
  const filteredLinkedInCount = filterItemsBySearch(linkedinPosts, searchQuery).length;
  const filteredSpotifyCount = filterItemsBySearch(spotifyPodcasts, searchQuery).length;

  const hasAnyContent =
    (showInstagram && filteredInstagramCount > 0) ||
    (showTikTok && filteredTikTokCount > 0) ||
    (showLinkedIn && filteredLinkedInCount > 0) ||
    (showSpotify && filteredSpotifyCount > 0);

  // Don't render content until mounted
  if (!mounted) {
    return (
      <section className="w-full bg-gradient-to-br from-gray-50 to-gray-100 py-12 md:py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex justify-center">
            <div className="w-full max-w-[500px] h-12 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  // ========== MOBILE LAYOUT ==========
  if (isMobile) {
    return (
      <section className="w-full bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-[1400px] mx-auto space-y-6">
          
          {/* SEARCH BAR */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-[400px]">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search posts..."
                className="w-full bg-white pl-10 pr-4 py-2.5 outline-none rounded-full text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-300 transition-all shadow-sm border border-gray-200"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times-circle"></i>
                </button>
              )}
            </div>
          </div>

          {/* PLATFORM FILTER TABS - Horizontal scroll */}
          <div className="overflow-x-auto pb-2 -mx-4 px-4">
            <div className="flex gap-2 min-w-max">
              {[
                { value: "all" as PlatformFilter, label: "All", icon: "fas fa-th-large", color: "gray-800" },
                { value: "instagram" as PlatformFilter, label: "Instagram", icon: "fab fa-instagram", color: "pink-600" },
                { value: "tiktok" as PlatformFilter, label: "TikTok", icon: "fab fa-tiktok", color: "black" },
                { value: "linkedin" as PlatformFilter, label: "LinkedIn", icon: "fab fa-linkedin-in", color: "[#0A66C2]" },
                { value: "spotify" as PlatformFilter, label: "Spotify", icon: "fab fa-spotify", color: "green-700" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActivePlatform(filter.value)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                    activePlatform === filter.value
                      ? `bg-${filter.color} text-white shadow-md`
                      : "bg-white/50 text-black hover:bg-white hover:shadow-sm border border-black/10"
                  }`}
                >
                  <i className={`${filter.icon} mr-1.5 text-xs`}></i>
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* EXPAND/COLLAPSE ALL BUTTONS */}
          <div className="flex justify-center gap-3">
            <button
              onClick={expandAll}
              className="px-3 py-1.5 rounded-full text-xs bg-gray-200 hover:bg-gray-300 transition text-gray-700 flex items-center gap-1.5"
            >
              <i className="fas fa-expand-alt text-xs"></i>
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1.5 rounded-full text-xs bg-gray-200 hover:bg-gray-300 transition text-gray-700 flex items-center gap-1.5"
            >
              <i className="fas fa-compress-alt text-xs"></i>
              Collapse All
            </button>
          </div>

          {/* SOCIAL MEDIA CONTENT SECTIONS */}
          <div className="space-y-4">
            {showInstagram && (
              <MobileCollapsibleSection
                title="Instagram Feed"
                icon="fab fa-instagram"
                iconBg="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500"
                platform="instagram"
                count={filteredInstagramCount}
                isExpanded={expandedSections.instagram}
                onToggle={() => toggleSection('instagram')}
                followLink="https://www.instagram.com/beatrinidad_/"
                followText="Follow →"
              >
                <MobileCarousel<InstagramPost>
                  items={filterItemsBySearch(instagramPosts, searchQuery)}
                  renderItem={(post: InstagramPost, idx: number) => (
                    <InstagramEmbed key={idx} url={post.url} width="100%" />
                  )}
                />
              </MobileCollapsibleSection>
            )}

            {showTikTok && (
              <MobileCollapsibleSection
                title="TikTok Moments"
                icon="fab fa-tiktok"
                iconBg="bg-black"
                platform="tiktok"
                count={filteredTikTokCount}
                isExpanded={expandedSections.tiktok}
                onToggle={() => toggleSection('tiktok')}
                followLink="https://www.tiktok.com/@beatrinidad_/"
                followText="Follow →"
              >
                <MobileCarousel<TikTokPost>
                  items={filterItemsBySearch(tiktokPosts, searchQuery)}
                  renderItem={(post: TikTokPost, idx: number) => (
                    <TikTokEmbed key={idx} url={post.url} width="100%" />
                  )}
                />
              </MobileCollapsibleSection>
            )}

            {showLinkedIn && (
              <MobileCollapsibleSection
                title="LinkedIn Insights"
                icon="fab fa-linkedin-in"
                iconBg="bg-gradient-to-r from-[#0A66C2] to-[#0A66C2]/90"
                platform="linkedin"
                count={filteredLinkedInCount}
                isExpanded={expandedSections.linkedin}
                onToggle={() => toggleSection('linkedin')}
                followLink="https://www.linkedin.com/in/beatrinidad/"
                followText="Connect →"
              >
                <MobileCarousel<LinkedInPost>
                  items={filterItemsBySearch(linkedinPosts, searchQuery)}
                  renderItem={(post: LinkedInPost, idx: number) => (
                    <LinkedInEmbed
                      key={idx}
                      url={post.embedUrl}
                      postUrl={post.postUrl}
                      width="100%"
                      height={350}
                    />
                  )}
                />
              </MobileCollapsibleSection>
            )}

            {showSpotify && (
              <MobileCollapsibleSection
                title="Spotify Podcasts"
                icon="fab fa-spotify"
                iconBg="bg-gradient-to-r from-green-600 to-green-700"
                platform="spotify"
                count={filteredSpotifyCount}
                isExpanded={expandedSections.spotify}
                onToggle={() => toggleSection('spotify')}
                followText="Available on Spotify"
                isSpotify
              >
                <MobileCarousel<SpotifyPodcast>
                  items={filterItemsBySearch(spotifyPodcasts, searchQuery)}
                  renderItem={(podcast: SpotifyPodcast, idx: number) => (
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl overflow-hidden shadow-md border border-gray-200">
                      <div className="bg-green-600/10 p-3 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                          <i className="fab fa-spotify text-white text-xl"></i>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="text-xs font-bold text-gray-900 mb-2">
                          {podcast.title || `Episode ${idx + 1}`}
                        </h3>
                        <iframe
                          src={podcast.embedUrl}
                          width="100%"
                          height="152"
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          loading="lazy"
                          title={`spotify-episode-${idx}`}
                        />
                      </div>
                    </div>
                  )}
                />
              </MobileCollapsibleSection>
            )}
          </div>

          {/* EMPTY STATE MESSAGE */}
          {!hasAnyContent && (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-200">
              <i className="fas fa-search text-4xl text-gray-300 mb-3 block"></i>
              <p className="text-gray-600 text-sm">
                No content found for "{searchQuery}"
              </p>
              <button
                onClick={clearSearch}
                className="mt-4 px-4 py-1.5 bg-gray-900 hover:bg-gray-800 rounded-full text-xs text-white transition"
              >
                Clear search
              </button>
            </div>
          )}

          {/* SOCIAL LINKS - YouTube & Substack */}
          <div className="flex justify-center items-center gap-8 pt-6 border-t border-gray-200">
            <a
              href="https://www.youtube.com/@beagtrinidad"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-1 transition-transform hover:scale-105"
            >
              <div className="w-12 h-12 rounded-full bg-[#FF0000] flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.376.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.376-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <span className="text-[10px] text-gray-600">Visit My Channel</span>
            </a>

            <a
              href="https://onyourplate.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-1 transition-transform hover:scale-105"
            >
              <div className="w-12 h-12 rounded-full bg-[#FF6719] flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.5 3.75H1.5a1.5 1.5 0 0 0-1.5 1.5v13.5a1.5 1.5 0 0 0 1.5 1.5h21a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5zm-21 1.5h21v2.25L12 13.875 1.5 7.5V5.25zm21 13.5h-21V9.75l10.5 6.375L22.5 9.75v9z"/>
                </svg>
              </div>
              <span className="text-[10px] text-gray-600">Visit My Substack</span>
            </a>
          </div>
        </div>
      </section>
    );
  }

  // ========== DESKTOP LAYOUT (Original) ==========
  return (
    <section className="w-full bg-gradient-to-br from-gray-50 to-gray-100 py-12 md:py-16 font-jost">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 space-y-8 md:space-y-10">
        {/* SEARCH BAR */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-[500px]">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search posts..."
              className="w-full bg-white pl-10 pr-4 py-3 outline-none rounded-full text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-300 transition-all shadow-sm border border-gray-200"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times-circle"></i>
              </button>
            )}
          </div>
        </div>

        {/* PLATFORM FILTER TABS */}
        <PlatformFilterTabs
          activeFilter={activePlatform}
          onFilterChange={setActivePlatform}
          searchQuery={searchQuery}
          onClearSearch={clearSearch}
        />

        {/* EXPAND/COLLAPSE ALL BUTTONS */}
        <div className="flex justify-center gap-3 mb-4">
          <button
            onClick={expandAll}
            className="px-4 py-2 rounded-full text-sm bg-gray-200 hover:bg-gray-300 transition text-gray-700 flex items-center gap-2"
          >
            <i className="fas fa-expand-alt text-xs"></i>
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-4 py-2 rounded-full text-sm bg-gray-200 hover:bg-gray-300 transition text-gray-700 flex items-center gap-2"
          >
            <i className="fas fa-compress-alt text-xs"></i>
            Collapse All
          </button>
        </div>

        {/* SOCIAL MEDIA CONTENT SECTIONS */}
        <div className="space-y-4">
          {showInstagram && (
            <DesktopCollapsibleSection
              title="Instagram Feed"
              icon="fab fa-instagram"
              iconBg="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500"
              platform="instagram"
              count={filteredInstagramCount}
              isExpanded={expandedSections.instagram}
              onToggle={() => toggleSection('instagram')}
              followLink="https://www.instagram.com/beatrinidad_/"
              followText="Follow →"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterItemsBySearch(instagramPosts, searchQuery).map((post: InstagramPost, idx: number) => (
                  <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className="relative bg-gray-100 min-h-[400px] flex items-center justify-center p-4">
                      <InstagramEmbed url={post.url} width="100%" />
                    </div>
                  </div>
                ))}
              </div>
            </DesktopCollapsibleSection>
          )}

          {showTikTok && (
            <DesktopCollapsibleSection
              title="TikTok Moments"
              icon="fab fa-tiktok"
              iconBg="bg-black"
              platform="tiktok"
              count={filteredTikTokCount}
              isExpanded={expandedSections.tiktok}
              onToggle={() => toggleSection('tiktok')}
              followLink="https://www.tiktok.com/@beatrinidad_/"
              followText="Follow →"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterItemsBySearch(tiktokPosts, searchQuery).map((post: TikTokPost, idx: number) => (
                  <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className="relative bg-gray-100 min-h-[500px] flex items-center justify-center p-4">
                      <TikTokEmbed url={post.url} width="100%" />
                    </div>
                  </div>
                ))}
              </div>
            </DesktopCollapsibleSection>
          )}

          {showLinkedIn && (
            <DesktopCollapsibleSection
              title="LinkedIn Insights"
              icon="fab fa-linkedin-in"
              iconBg="bg-gradient-to-r from-[#0A66C2] to-[#0A66C2]/90"
              platform="linkedin"
              count={filteredLinkedInCount}
              isExpanded={expandedSections.linkedin}
              onToggle={() => toggleSection('linkedin')}
              followLink="https://www.linkedin.com/in/beatrinidad/"
              followText="Connect →"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterItemsBySearch(linkedinPosts, searchQuery).map((post: LinkedInPost, idx: number) => (
                  <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200">
                    <div className="p-4">
                      <div className="bg-gray-50 rounded-lg overflow-hidden">
                        <LinkedInEmbed
                          url={post.embedUrl}
                          postUrl={post.postUrl}
                          width="100%"
                          height={350}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DesktopCollapsibleSection>
          )}

          {showSpotify && (
            <DesktopCollapsibleSection
              title="Spotify Podcasts"
              icon="fab fa-spotify"
              iconBg="bg-gradient-to-r from-green-600 to-green-700"
              platform="spotify"
              count={filteredSpotifyCount}
              isExpanded={expandedSections.spotify}
              onToggle={() => toggleSection('spotify')}
              followText="Available on Spotify"
              isSpotify
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterItemsBySearch(spotifyPodcasts, searchQuery).map((podcast: SpotifyPodcast, idx: number) => (
                  <div key={idx} className="bg-gradient-to-br from-gray-50 to-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200">
                    <div className="bg-green-600/10 p-4 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center">
                        <i className="fab fa-spotify text-white text-2xl"></i>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-gray-900 mb-3">
                        {podcast.title || `Episode ${idx + 1}`}
                      </h3>
                      <div className="bg-gray-100 rounded-lg overflow-hidden">
                        <iframe
                          src={podcast.embedUrl}
                          width="100%"
                          height="152"
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          loading="lazy"
                          title={`spotify-episode-${idx}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DesktopCollapsibleSection>
          )}
        </div>

        {/* EMPTY STATE MESSAGE */}
        {!hasAnyContent && (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-200">
            <i className="fas fa-search text-5xl text-gray-300 mb-4 block"></i>
            <p className="text-gray-600 text-lg">
              No content found for "{searchQuery}"
            </p>
            <button
              onClick={clearSearch}
              className="mt-6 px-6 py-2 bg-gray-900 hover:bg-gray-800 rounded-full text-sm text-white transition"
            >
              Clear search
            </button>
          </div>
        )}

        {/* SOCIAL LINKS - YouTube & Substack */}
        <div className="flex justify-center items-center gap-12 pt-8 border-t border-gray-200">
          <a
            href="https://www.youtube.com/@beagtrinidad"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2 transition-transform hover:scale-105"
          >
            <div className="w-16 h-16 rounded-full bg-[#FF0000] flex items-center justify-center shadow-lg transition-all group-hover:shadow-xl">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.376.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.376-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <span className="text-xs text-gray-600 font-medium">Visit My Channel</span>
          </a>

          <a
            href="https://onyourplate.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2 transition-transform hover:scale-105"
          >
            <div className="w-16 h-16 rounded-full bg-[#FF6719] flex items-center justify-center shadow-lg transition-all group-hover:shadow-xl">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.5 3.75H1.5a1.5 1.5 0 0 0-1.5 1.5v13.5a1.5 1.5 0 0 0 1.5 1.5h21a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5zm-21 1.5h21v2.25L12 13.875 1.5 7.5V5.25zm21 13.5h-21V9.75l10.5 6.375L22.5 9.75v9z"/>
              </svg>
            </div>
            <span className="text-xs text-gray-600 font-medium">Visit My Substack</span>
          </a>
        </div>
      </div>
    </section>
  );
}

// ==================== MOBILE COMPONENTS ====================

// Mobile Collapsible Section
const MobileCollapsibleSection: React.FC<{
  title: string;
  icon: string;
  iconBg: string;
  platform: string;
  count: number;
  isExpanded: boolean;
  onToggle: () => void;
  followLink?: string;
  followText?: string;
  isSpotify?: boolean;
  children: React.ReactNode;
}> = ({ title, icon, iconBg, platform, count, isExpanded, onToggle, followLink, followText, isSpotify, children }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
      <button onClick={onToggle} className="w-full text-left">
        <div className={`${iconBg} p-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <i className={`${icon} text-white text-base`}></i>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">{title}</h4>
                <p className="text-white/80 text-[10px]">
                  {count} {count === 1 ? 'post' : 'posts'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {followLink && !isSpotify && (
                <a
                  href={followLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-white/90 hover:text-white text-xs font-medium transition"
                >
                  {followText}
                </a>
              )}
              {isSpotify && (
                <span className="text-white/80 text-[10px]">🎧 Spotify</span>
              )}
              <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-white text-sm transition-transform duration-300`}></i>
            </div>
          </div>
        </div>
      </button>

      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

// Mobile Carousel - Generic with proper typing
const MobileCarousel = <T,>({ 
  items, 
  renderItem 
}: { 
  items: T[]; 
  renderItem: (item: T, index: number) => React.ReactNode;
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false 
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    
    emblaApi.on("select", onSelect);
    onSelect();
    
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  if (items.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-xl">
        <p className="text-gray-500 text-xs">No posts match your search</p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-3">
          {items.map((item, idx) => (
            <div key={idx} className="flex-[0_0_85%] min-w-0">
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                {renderItem(item, idx)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {items.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {items.map((_, idx: number) => (
            <button
              key={idx}
              onClick={() => emblaApi?.scrollTo(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === selectedIndex ? "w-4 bg-gray-800" : "w-1.5 bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ==================== DESKTOP COMPONENTS ====================

// Platform Filter Tabs
const PlatformFilterTabs: React.FC<{
  activeFilter: PlatformFilter;
  onFilterChange: (filter: PlatformFilter) => void;
  searchQuery: string;
  onClearSearch: () => void;
}> = ({ activeFilter, onFilterChange, searchQuery, onClearSearch }) => {
  const filters: { value: PlatformFilter; label: string; icon: string }[] = [
    { value: "all", label: "All", icon: "fas fa-th-large" },
    { value: "instagram", label: "Instagram", icon: "fab fa-instagram" },
    { value: "tiktok", label: "TikTok", icon: "fab fa-tiktok" },
    { value: "linkedin", label: "LinkedIn", icon: "fab fa-linkedin-in" },
    { value: "spotify", label: "Spotify", icon: "fab fa-spotify" },
  ];

  const getButtonClass = (filterValue: PlatformFilter) => {
    const baseClass = "px-5 py-2 rounded-full text-sm font-medium transition-all duration-200";
    if (activeFilter === filterValue) {
      switch (filterValue) {
        case "instagram":
          return `${baseClass} bg-pink-600 text-white shadow-md`;
        case "tiktok":
          return `${baseClass} bg-black text-white shadow-md`;
        case "linkedin":
          return `${baseClass} bg-[#0A66C2] text-white shadow-md`;
        case "spotify":
          return `${baseClass} bg-green-700 text-white shadow-md`;
        default:
          return `${baseClass} bg-gray-800 text-white shadow-md`;
      }
    }
    return `${baseClass} bg-white/50 text-black hover:bg-white hover:shadow-sm border border-black/10`;
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={getButtonClass(filter.value)}
        >
          <i className={`${filter.icon} mr-2 text-xs`}></i>
          {filter.label}
        </button>
      ))}
      {searchQuery && (
        <button
          onClick={onClearSearch}
          className="px-4 py-2 rounded-full text-sm bg-black/5 hover:bg-black/10 transition text-black flex items-center gap-1"
        >
          <i className="fas fa-times-circle"></i>
          Clear: "{searchQuery}"
        </button>
      )}
    </div>
  );
};

// Desktop Collapsible Section
const DesktopCollapsibleSection: React.FC<{
  title: string;
  icon: string;
  iconBg: string;
  platform: string;
  count: number;
  isExpanded: boolean;
  onToggle: () => void;
  followLink?: string;
  followText?: string;
  isSpotify?: boolean;
  children: React.ReactNode;
}> = ({ title, icon, iconBg, platform, count, isExpanded, onToggle, followLink, followText, isSpotify, children }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300">
      <button onClick={onToggle} className="w-full text-left transition-all duration-200 hover:opacity-90">
        <div className={`${iconBg} p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <i className={`${icon} text-white text-xl`}></i>
              </div>
              <div>
                <h4 className="text-white font-semibold text-lg">{title}</h4>
                <p className="text-white/80 text-xs">
                  {count} {count === 1 ? 'post' : 'posts'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {followLink && !isSpotify && (
                <a
                  href={followLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-white/90 hover:text-white text-sm font-medium transition"
                >
                  {followText}
                </a>
              )}
              {isSpotify && (
                <span className="text-white/80 text-xs">🎧 Available on Spotify</span>
              )}
              <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-white text-xl transition-transform duration-300`}></i>
            </div>
          </div>
        </div>
      </button>

      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};