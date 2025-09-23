import VideoGrid from "@/components/VideoGrid";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold tracking-tight 
                       text-gray-900 dark:text-white">
          Welcome to Yule
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Discover, watch, and share.
        </p>
      </div>
      <VideoGrid />
    </div>
  );
}
