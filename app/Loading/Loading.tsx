// components/Loading.tsx
'use client';

import { useEffect, useState, useRef } from 'react';

export default function Loading() {
  const [isExiting, setIsExiting] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Fetch and inject SVG
    fetch('/Loader.svg')
      .then(res => res.text())
      .then(svgText => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svgText;
          
          // Execute any script tags in the SVG
          const scripts = containerRef.current.querySelectorAll('script');
          scripts.forEach(script => {
            const newScript = document.createElement('script');
            newScript.textContent = script.textContent;
            document.head.appendChild(newScript);
          });
        }
      });
    
    // Start exit animation after 2 seconds
    const exitTimer = setTimeout(() => setIsExiting(true), 3000);
    
    // Remove component after animation completes (2.5 seconds)
    const removeTimer = setTimeout(() => {
      setIsMounted(false);
      document.body.style.overflow = 'auto';
    }, 3500);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Don't render anything when unmounted
  if (!isMounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-500 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
        style={{ width: '260px', height: '152px' }}
      >
        <div ref={containerRef} style={{ marginTop: '-33px' }} />
      </div>
    </div>
  );
}