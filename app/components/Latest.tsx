"use client";

import Image from "next/image";

export default function Latest() {
  return (
    <section className="w-full bg-[#FEFDF8] py-20 px-6 lg:px-16 text-black">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

        {/* LEFT PODCAST BLOCK */}
        <div className="flex flex-col items-center text-center">
          <h3 className="font-helvetica text-3xl font-semibold mb-3">
            The latest drops
          </h3>

          {/* social icons - proportionally larger, maintaining original ratio */}
          <div className="flex gap-4 mb-1">
            <div className="relative w-12 h-12">
              <Image 
                src="/Landing/Icons/spotify.png" 
                alt="spotify" 
                fill
                className="object-contain"
              />
            </div>
            <div className="relative w-12 h-12">
              <Image 
                src="/Landing/Icons/linkedin.png" 
                alt="linkedin" 
                fill
                className="object-contain"
              />
            </div>
            <div className="relative w-12 h-12">
              <Image 
                src="/Landing/Icons/ig.png" 
                alt="instagram" 
                fill
                className="object-contain"
              />
            </div>
            <div className="relative w-12 h-12">
              <Image 
                src="/Landing/Icons/substack.png" 
                alt="substack" 
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* headphones */}
          <Image
            src="/Landing/Headphones.png"
            alt="podcast headphones"
            width={220}
            height={220}
            className="mb-2"
          />

          <p className="font-helvetica text-2xl font-medium">
            Subscribe to my <br /> podcast
          </p>
        </div>


        {/* CONTENT CARDS */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* CARD 1 */}
          <div className="flex flex-col">
            <div className="bg-[#e8b6c0] h-12 flex items-center justify-center mb-3">
              <Image
                src="/Landing/Icons/Icons1.png"
                alt="icon1"
                width={28}
                height={28}
              />
            </div>

            <div className="relative w-full aspect-[3/4] overflow-hidden">
              <Image
                src="/1.JPG"
                alt="post1"
                fill
                className="object-cover"
              />
            </div>
          </div>


          {/* CARD 2 */}
          <div className="flex flex-col">
            <div className="bg-[#f3cc2b] h-12 flex items-center justify-center mb-3">
              <Image
                src="/Landing/Icons/Icons2.png"
                alt="icon2"
                width={28}
                height={28}
              />
            </div>

            <div className="relative w-full aspect-[3/4] overflow-hidden">
              <Image
                src="/1.JPG"
                alt="post2"
                fill
                className="object-cover"
              />
            </div>
          </div>


          {/* CARD 3 */}
          <div className="flex flex-col">
            <div className="bg-[#9ac33b] h-12 flex items-center justify-center mb-3">
              <Image
                src="/Landing/Icons/Icon3.png"
                alt="icon3"
                width={28}
                height={28}
              />
            </div>

            <div className="relative w-full aspect-[3/4] overflow-hidden">
              <Image
                src="/1.JPG"
                alt="post3"
                fill
                className="object-cover"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}