"use client";

import { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Loading from "@/app/Loading/Loading";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for Loading component to finish (3 seconds)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Loading />
      {/* Always render content, but hide it visually until loading is done */}
      <div style={{ display: loading ? 'none' : 'block' }}>
        {children}
      </div>
    </>
  );
}