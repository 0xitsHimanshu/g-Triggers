// USER DATA WITH THEIR ALL PLATFORM PROFILE DETAILS
"use client";

import { useEffect, useState } from "react";
import {
  fetchYoutubeData,
  fetchUploadsPlaylistId,
  fetchUploadedVideos,
  fetchLiveBroadcasts,
} from "@/utils/youtube.data";
import {
  fetchUserDataFromTwitch,
  fetchAllStreams,
  fetchTwitchTotalFollowers,
  fetchVideosFromTwitch,
} from "@/utils/twitch.data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface User {
  name?: string;
  platforms?: {
    google?: { access_token?: string };
    twitch?: { access_token?: string; user_id?: string; userName?: string };
  };
}

interface UserProfileProps {
  user: User;
}

export default function UserProfile({ user }: UserProfileProps) {
  const youtubeAccessToken = user?.platforms?.google?.access_token;
  const twitchAccessToken = user?.platforms?.twitch?.access_token;
  const twitchUserId = user?.platforms?.twitch?.user_id;
  const twitchUserName = user?.name;

  const [youtubeStats, setYoutubeStats] = useState<any>(null);
  const [youtubeVideos, setYoutubeVideos] = useState<any[]>([]);
  const [youtubeLive, setYoutubeLive] = useState<any[]>([]);
  const [loadingYoutube, setLoadingYoutube] = useState(true);

  const [twitchUser, setTwitchUser] = useState<any>(null);
  const [twitchStream, setTwitchStream] = useState<any | string>(null);
  const [twitchFollowers, setTwitchFollowers] = useState<number>(0);
  const [twitchVideos, setTwitchVideos] = useState<any[]>([]);
  const [loadingTwitch, setLoadingTwitch] = useState(true);

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLastUpdated(new Date());

      try {
        if (youtubeAccessToken) {
          setLoadingYoutube(true);
          const stats = await fetchYoutubeData(youtubeAccessToken);
          setYoutubeStats(stats);

          const playlistId = await fetchUploadsPlaylistId(youtubeAccessToken);
          if (playlistId) {
            const videos = await fetchUploadedVideos(youtubeAccessToken, playlistId);
            setYoutubeVideos(videos);
          }

          const liveStreams = await fetchLiveBroadcasts(youtubeAccessToken);
          setYoutubeLive(liveStreams);
        }
      } catch (error) {
        console.error("Error fetching YouTube data:", error);
      } finally {
        setLoadingYoutube(false);
      }

      try {
        if (twitchAccessToken && twitchUserId && twitchUserName) {
          setLoadingTwitch(true);
          const userData = await fetchUserDataFromTwitch(twitchAccessToken, twitchUserId);
          setTwitchUser(userData);

          const stream = await fetchAllStreams(twitchAccessToken, twitchUserName);
          setTwitchStream(stream);

          const followers = await fetchTwitchTotalFollowers(twitchAccessToken, twitchUserId);
          setTwitchFollowers(followers);

          const videos = await fetchVideosFromTwitch(twitchAccessToken, twitchUserId);
          setTwitchVideos(Array.isArray(videos) ? videos : []);
        }
      } catch (error) {
        console.error("Error fetching Twitch data:", error);
      } finally {
        setLoadingTwitch(false);
      }
    }

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 60000); // Poll every 60 seconds for real-time updates

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [youtubeAccessToken, twitchAccessToken, twitchUserId, twitchUserName]);

  return (
    <div className="grid grid-cols-1 gap-6 p-6">
      <div className="flex gap-6">
      {/* YOUTUBE SECTION */}
      { youtubeAccessToken && (
      <Card>
        <CardHeader>
          <CardTitle>YouTube Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingYoutube ? (
            <Skeleton className="h-32 w-full" />
          ) : youtubeStats ? (
            <div className="space-y-3">
              <p>
                <strong>Subscribers:</strong> {youtubeStats.subscriberCount}
              </p>
              <p>
                <strong>Videos:</strong> {youtubeStats.videoCount}
              </p>
              <p>
                <strong>Views:</strong> {youtubeStats.viewCount}
              </p>

              <h3 className="font-bold mt-4">Recent Uploads</h3>
              <div className="space-y-2">
                {youtubeVideos.slice(0, 3).map((video, index) => (
                  <a
                    key={index}
                    href={`https://www.youtube.com/watch?v=${video.contentDetails.videoId}`}
                    target="_blank"
                    className="block hover:text-blue-500"
                  >
                    🎬 {video.snippet.title}
                  </a>
                ))}
              </div>

              {youtubeLive.length > 0 && <Badge variant="destructive">LIVE Streaming Now</Badge>}
            </div>
          ) : (
            <p className="text-gray-500">No YouTube data available.</p>
          )}
        </CardContent>
      </Card>
      )}

      {/* TWITCH SECTION */}
      { twitchAccessToken && (
      <Card>
        <CardHeader>
          <CardTitle>Twitch Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingTwitch ? (
            <Skeleton className="h-32 w-full" />
          ) : twitchUser ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={twitchUser.profile_image_url} alt={twitchUser.display_name} />
                  <AvatarFallback>{twitchUser.display_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="text-lg font-semibold">{twitchUser.display_name}</p>
              </div>

              <p>
                <strong>Followers:</strong> {twitchFollowers}
              </p>

              {twitchStream && typeof twitchStream !== "string" ? (
                <Badge variant="secondary">LIVE: {twitchStream.title}</Badge>
              ) : (
                <p className="text-gray-500">Not Streaming</p>
              )}

              <h3 className="font-bold mt-4">Recent Videos</h3>
              <div className="space-y-2">
                {twitchVideos.slice(0, 3).map((video, index) => (
                  <a
                    key={index}
                    href={video.url}
                    target="_blank"
                    className="block hover:text-purple-500"
                  >
                    🎥 {video.title}
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No Twitch data available.</p>
          )}
        </CardContent>
      </Card>
      )}

      </div>

      {/* Last Updated */}
      <p className="text-center text-gray-400 text-sm mt-4">
        Last Updated: {lastUpdated?.toLocaleTimeString()}
      </p>
    </div>
  );
}
