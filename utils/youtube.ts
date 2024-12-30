import axios from "axios";

// Define types for YouTube API responses
interface YoutubeStatistics {
  viewCount: string;
  subscriberCount: string;
  hiddenSubscriberCount: boolean;
  videoCount: string;
  title: string;
}

interface PlaylistContentDetails {
  relatedPlaylists: {
    uploads: string;
  };
}

interface UploadedVideo {
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
    publishedAt: string;
    resourceId: {
      videoId: string;
    };
  };
  contentDetails: {
    videoId: string;
    videoPublishedAt: string;
  };
}

interface LiveBroadcast {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
  };
  contentDetails: {
    boundStreamId: string;
    monitorStream: { embedHtml: string };
  };
  status: {
    lifeCycleStatus: string;
    recordingStatus: string;
  };
}

interface VideoStatistics {
  viewCount: string;
  likeCount: string;
  dislikeCount?: string; // Deprecated by YouTube
  favoriteCount: string;
  commentCount: string;
}

// Define types for aggregated data
interface AggregatedYoutubeData {
  statistics: YoutubeStatistics;
  uploadsPlaylistId: string;
  uploadedVideos: UploadedVideo[];
  liveBroadcasts: LiveBroadcast[];
}

// Aggregated function to fetch all YouTube data
export const fetchDataFromYoutube = async (
  accessToken: string
): Promise<AggregatedYoutubeData> => {
  try {
    // Fetch channel statistics
    const statistics = await fetchYoutubeData(accessToken);

    // Fetch uploads playlist ID
    const uploadsPlaylistId = await fetchUploadsPlaylistId(accessToken);

    // Fetch uploaded videos
    const uploadedVideos = await fetchUploadedVideos(
      accessToken,
      uploadsPlaylistId
    );

    // Fetch live broadcasts
    const liveBroadcasts = await fetchLiveBroadcasts(accessToken);

    // Return the aggregated data
    return {
      statistics,
      uploadsPlaylistId,
      uploadedVideos,
      liveBroadcasts,
    };
  } catch (error) {
    console.error("Error fetching data from YouTube:", error);
    throw new Error("Failed to fetch data from YouTube");
  }
};

// Fetch YouTube channel statistics
export const fetchYoutubeData = async (
  accessToken: string
): Promise<YoutubeStatistics> => {
  try {
    const response = await axios.get<{
      items: { statistics: YoutubeStatistics }[];
    }>(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&mine=true`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.items[0].statistics;
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    throw new Error("Failed to fetch YouTube statistics");
  }
};

// Fetch the uploads playlist ID
export const fetchUploadsPlaylistId = async (
  accessToken: string
): Promise<string> => {
  try {
    const response = await axios.get<{
      items: { contentDetails: PlaylistContentDetails }[];
    }>(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.items[0].contentDetails.relatedPlaylists.uploads;
  } catch (error) {
    console.error("Error fetching uploads playlist ID:", error);
    throw new Error("Failed to fetch uploads playlist ID");
  }
};

// Fetch uploaded videos
export const fetchUploadedVideos = async (
  accessToken: string,
  uploadsPlaylistId: string
): Promise<UploadedVideo[]> => {
  try {
    const response = await axios.get<{ items: UploadedVideo[] }>(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=10&playlistId=${uploadsPlaylistId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.items;
  } catch (error) {
    console.error("Error fetching uploaded videos:", error);
    throw new Error("Failed to fetch uploaded videos");
  }
};

// Fetch live broadcasts
export const fetchLiveBroadcasts = async (
  accessToken: string
): Promise<LiveBroadcast[]> => {
  try {
    const response = await axios.get<{ items: LiveBroadcast[] }>(
      `https://www.googleapis.com/youtube/v3/liveBroadcasts?part=id,snippet,contentDetails,status&mine=true`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.items;
  } catch (error) {
    console.error("Error fetching live broadcasts:", error);
    throw new Error("Failed to fetch live broadcasts");
  }
};

// Fetch video statistics
export const fetchVideoStatistics = async (
  accessToken: string,
  videoId: string
): Promise<VideoStatistics> => {
  try {
    const response = await axios.get<{
      items: { statistics: VideoStatistics }[];
    }>(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.items[0].statistics;
  } catch (error) {
    console.error("Error fetching video statistics:", error);
    throw new Error("Failed to fetch video statistics");
  }
};
