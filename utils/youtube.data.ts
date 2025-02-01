import axios from "axios";

// Define types for YouTube API responses
interface YouTubeStatistics {
  viewCount: string;
  subscriberCount: string;
  hiddenSubscriberCount: boolean;
  videoCount: string;
}

interface YouTubeChannel {
  id: string;
  statistics: YouTubeStatistics;
}

interface YouTubeResponse<T> {
  items: T[];
}

// Fetch YouTube Channel Statistics
export const fetchYoutubeData = async (accessToken: string): Promise<YouTubeStatistics | null> => {
  try {
    const response = await axios.get<YouTubeResponse<YouTubeChannel>>(
      "https://www.googleapis.com/youtube/v3/channels?part=statistics&mine=true",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    return response.data.items[0]?.statistics || null;
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    throw new Error("Failed to fetch YouTube data");
  }
};

// Fetch Uploads Playlist ID
export const fetchUploadsPlaylistId = async (accessToken: string): Promise<string | null> => {
  try {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return response.data.items[0]?.contentDetails.relatedPlaylists.uploads || null;
  } catch (error) {
    console.error("Error fetching uploads playlist ID:", error);
    throw new Error("Failed to fetch uploads playlist ID");
  }
};

// Fetch Uploaded Videos
export const fetchUploadedVideos = async (
  accessToken: string,
  uploadsPlaylistId: string
): Promise<any[]> => {
  try {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/playlistItems", {
      params: { part: "snippet,contentDetails", maxResults: 10, playlistId: uploadsPlaylistId },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return response.data.items || [];
  } catch (error) {
    console.error("Error fetching uploaded videos:", error);
    throw new Error("Failed to fetch uploaded videos");
  }
};

// Fetch Live Broadcasts
export const fetchLiveBroadcasts = async (accessToken: string): Promise<any[]> => {
  try {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/liveBroadcasts", {
      params: { part: "id,snippet,contentDetails,status", mine: "true" },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return response.data.items || [];
  } catch (error) {
    console.error("Error fetching live broadcasts:", error);
    throw new Error("Failed to fetch live broadcasts");
  }
};

// Fetch Video Statistics
export const fetchVideoStatistics = async (accessToken: string, videoId: string): Promise<any> => {
  try {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
      params: { part: "statistics", id: videoId },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return response.data.items[0]?.statistics || {};
  } catch (error) {
    console.error("Error fetching video statistics:", error);
    throw new Error("Failed to fetch video statistics");
  }
};
