"use client";

import { InstagramEmbed, TikTokEmbed } from 'react-social-media-embed';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

// Sample posts - REPLACE THESE WITH ACTUAL POST URLs
const instagramPosts = [
  "https://www.instagram.com/p/DOIvxV5jwiV/?igsh=MWZrNHlsc2xueWh1aQ==",  // Replace with actual post URL
  "https://www.instagram.com/p/DOIvxV5jwiV/?igsh=MWZrNHlsc2xueWh1aQ==",  // Replace with actual post URL
  "https://www.instagram.com/p/DOIvxV5jwiV/?igsh=MWZrNHlsc2xueWh1aQ==",  // Replace with actual post URL
];

const tiktokPosts = [
  "https://www.tiktok.com/@beatrinidad_/video/7593986097269476628",  // Replace with actual video URL
  "https://www.tiktok.com/@beatrinidad_/video/7593986097269476628",  // Replace with actual video URL
  "https://www.tiktok.com/@beatrinidad_/video/7593986097269476628",  // Replace with actual video URL
];

// Spotify podcast episodes - using standard iframe embed
const spotifyPodcasts = [
  {
    embedUrl: "https://open.spotify.com/embed/episode/5s5ZBx5isGUg2kActdsuln?trackId=5Ttvg7lFZ0LdqRjs4otpH4",
    title: "Episode 1 Title",
  },
  {
    embedUrl: "https://open.spotify.com/embed/episode/0987654321",
    title: "Episode 2 Title",
  },
  {
    embedUrl: "https://open.spotify.com/embed/episode/5555555555",
    title: "Episode 3 Title",
  },
];

export default function SocialFeedPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Instagram Section */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Instagram Feed</h2>
            <a 
              href="https://www.instagram.com/beatrinidad_/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-700 text-sm inline-block mt-2"
            >
              @beatrinidad_ on Instagram →
            </a>
          </div>
          
          <Carousel
            showArrows={true}
            showStatus={false}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={5000}
            stopOnHover={true}
            swipeable={true}
          >
            {instagramPosts.map((post, index) => (
              <div key={index} className="flex justify-center">
                <div className="bg-white rounded-xl shadow-lg p-4 w-full max-w-md">
                  <InstagramEmbed url={post} width={328} />
                </div>
              </div>
            ))}
          </Carousel>
        </section>

        {/* TikTok Section */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">TikTok Feed</h2>
            <a 
              href="https://www.tiktok.com/@beatrinidad_" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-black hover:text-gray-700 text-sm inline-block mt-2"
            >
              @beatrinidad_ on TikTok →
            </a>
          </div>
          
          <Carousel
            showArrows={true}
            showStatus={false}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={6000}
            stopOnHover={true}
            swipeable={true}
          >
            {tiktokPosts.map((post, index) => (
              <div key={index} className="flex justify-center">
                <div className="bg-white rounded-xl shadow-lg p-4 w-full max-w-md">
                  <TikTokEmbed url={post} width={325} />
                </div>
              </div>
            ))}
          </Carousel>
        </section>

        {/* Spotify Section - Using native iframe embed */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Spotify Podcasts</h2>
            <p className="text-gray-600 text-sm mt-2">Latest episodes</p>
          </div>
          
          <Carousel
            showArrows={true}
            showStatus={false}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={8000}
            stopOnHover={true}
            swipeable={true}
          >
            {spotifyPodcasts.map((podcast, index) => (
              <div key={index}>
                <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {podcast.title}
                  </h3>
                  <iframe
                    src={podcast.embedUrl}
                    width="100%"
                    height="352"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-md"
                  />
                </div>
              </div>
            ))}
          </Carousel>
        </section>

      </div>
    </div>
  );
}