"use client";
import { useEffect, useState } from "react";
import VideoGrid from "@/components/VideoGrid";

export default function HomePage() {
  const trendingThumbnails = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1600&q=80",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % trendingThumbnails.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [trendingThumbnails.length]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section with Background Slider */}
      <div className="relative h-[300px] rounded-xl overflow-hidden mb-12">
        {trendingThumbnails.map((src, index) => (
          <img
            key={index}
            src={src}
            alt="trending thumbnail"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
          <h1 className="text-5xl font-bold tracking-tight drop-shadow-lg">
            Welcome to Yule
          </h1>
          <p className="mt-2 text-lg text-gray-200">
            Discover, watch, and share.
          </p>
        </div>
      </div>

      {/* Video Grid Below */}
      <VideoGrid />
    </div>
  );
}
