import axios from "axios";

const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID as string;

// Define types for Twitch responses
interface TwitchUser {
  id: string;
  login: string;
  display_name: string;
  profile_image_url: string;
}

interface TwitchStream {
  id: string;
  user_id: string;
  user_name: string;
  title: string;
  viewer_count: number;
  started_at: string;
}

interface TwitchFollowers {
  total: number;
}

interface TwitchVideo {
  id: string;
  title: string;
  url: string;
}

// Fetch User Data from Twitch
export const fetchUserDataFromTwitch = async (accessToken: string, userId: string): Promise<TwitchUser | null> => {
  try {
    const response = await axios.get<{ data: TwitchUser[] }>("https://api.twitch.tv/helix/users", {
      params: { id: userId },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Client-Id": clientId,
      },
    });

    return response.data.data[0] || null;
  } catch (error) {
    console.error("Error fetching Twitch user data:", error);  
    throw new Error("Failed to fetch Twitch user data");
  }
};

// Fetch Current Live Streams
export const fetchAllStreams = async (accessToken: string, userName: string): Promise<TwitchStream | string> => {
  try {
    const response = await axios.get<{ data: TwitchStream[] }>("https://api.twitch.tv/helix/streams", {
      params: { user_login: userName },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Client-Id": clientId,
      },
    });

    return response.data.data[0] || "No Currently Streaming";
  } catch (error) {
    console.error("Error fetching Twitch streams:", error);
    throw new Error("Failed to fetch Twitch streams");
  }
};

// Fetch Total Followers
export const fetchTwitchTotalFollowers = async (accessToken: string, userId: string): Promise<number> => {
  try {
    const response = await axios.get<{ total: number }>(
      "https://api.twitch.tv/helix/channels/followers",
      {
        params: { broadcaster_id: userId },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Client-Id": clientId,
        },
      }
    );

    return response.data.total;
  } catch (error) {
    console.error("Error fetching Twitch followers:", error);
    throw new Error("Failed to fetch Twitch followers");
  }
};

// Fetch Videos from Twitch
export const fetchVideosFromTwitch = async (accessToken: string, userId: string): Promise<TwitchVideo[] | string> => {
  try {
    const response = await axios.get<{ data: TwitchVideo[] }>("https://api.twitch.tv/helix/videos", {
      params: { user_id: userId, type: "archive" },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Client-Id": clientId,
      },
    });

    const videos = response.data.data;
    return videos.length > 0 ? videos : "No Previous Videos";
  } catch (error) {
    console.error("Error fetching Twitch videos:", error);
    throw new Error("Failed to fetch Twitch videos");
  }
};
