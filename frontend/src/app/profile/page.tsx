"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import VideoCard from '@/components/VideoCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // State to hold the user's watchlist videos
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // This effect redirects the user if they are not logged in
  useEffect(() => {
    if (!isAuthLoading && !user) {
      toast.error("You must be logged in to view this page.");
      router.push('/login');
    }
  }, [user, isAuthLoading, router]);

  // This effect fetches the watchlist data once we know the user is logged in
  useEffect(() => {
    const fetchWatchlist = async () => {
      if (user) {
        try {
          setLoading(true);
          const response = await api.get('/watchlist');
          setWatchlist(response.data.videos || []);
        } catch (error) {
          console.error("Failed to fetch watchlist", error);
          toast.error("Could not load your watchlist.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchWatchlist();
  }, [user]);

  // Display a loading message while we wait for auth check and data fetching
  if (isAuthLoading || !user) {
    return <div className="container text-center py-10">Loading profile...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* --- User Profile Header --- */}
      <div className="flex items-center space-x-4 mb-8">
        <Avatar className="h-24 w-24">
          <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user.username}`} />
          <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{user.username}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {/* --- Content Tabs --- */}
      <Tabs defaultValue="watchlist" className="w-full">
        <TabsList>
          <TabsTrigger value="watchlist">My Watchlist</TabsTrigger>
          <TabsTrigger value="orders" disabled>My Orders</TabsTrigger>
          <TabsTrigger value="settings" disabled>Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="watchlist" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Videos you saved for later</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading watchlist...</p>
              ) : watchlist.length > 0 ? (
                // We reuse our VideoCard component here!
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {watchlist.map((video: any) => (
                    <VideoCard key={video._id} video={video} />
                  ))}
                </div>
              ) : (
                <p>Your watchlist is empty. Add some videos from the video page!</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

