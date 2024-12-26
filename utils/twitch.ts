import axios from "axios";

const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;

if (!clientId) {
  throw new Error("NEXT_PUBLIC_TWITCH_CLIENT_ID environment variable is not set");
}

// Twitch API base URL
const TWITCH_API_BASE = "https://api.twitch.tv/helix";

// Common headers for Twitch API requests
const getTwitchHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
  "Client-Id": clientId,
});

// Fetch all Twitch-related data for a user
export const fetchTwitchData = async (
  accessToken: string,
  userId: string
): Promise<TwitchUser> => {
  try {
    const [userData, followersData, videosData] = await Promise.all([
      fetchUserDataFromTwitch(accessToken, userId),
      fetchTwitchTotalFollowers(accessToken, userId),
      fetchVideosFromTwitch(accessToken, userId),
    ]);

    return {
      ...userData,
      followers: followersData?.total ?? 0,
      videos: videosData.length > 0 ? videosData : "No Previous videos",
    };
  } catch (error) {
    console.error("Error fetching Twitch data:", error);
    throw new Error("Failed to fetch Twitch data");
  }
};

// Fetch user data from Twitch
export const fetchUserDataFromTwitch = async (
  accessToken: string,
  userId: string
): Promise<TwitchUser> => {
  try {
    const response = await axios.get<{ data: TwitchUser[] }>(
      `${TWITCH_API_BASE}/users?id=${userId}`,
      {
        headers: getTwitchHeaders(accessToken),
      }
    );
    return response.data.data[0];
  } catch (error) {
    console.error("Error fetching user data from Twitch:", error);
    throw new Error("Failed to fetch user data");
  }
};

// Fetch currently active stream data
export const fetchAllStreams = async (
  accessToken: string,
  userName: string
): Promise<TwitchStream | "No Currently Streaming"> => {
  try {
    const response = await axios.get<{ data: TwitchStream[] }>(
      `${TWITCH_API_BASE}/streams?user_login=${userName}`,
      {
        headers: getTwitchHeaders(accessToken),
      }
    );
    return response.data.data[0] || "No Currently Streaming";
  } catch (error) {
    console.error("Error fetching active streams from Twitch:", error);
    return "No Currently Streaming";
  }
};

// Fetch total followers for a Twitch user
export const fetchTwitchTotalFollowers = async (
  accessToken: string,
  userId: string
): Promise<TwitchFollowers> => {
  try {
    const response = await axios.get<TwitchFollowers>(
      `${TWITCH_API_BASE}/channels/followers?broadcaster_id=${userId}`,
      {
        headers: getTwitchHeaders(accessToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching followers data from Twitch:", error);
    return { total: 0, data: [] }; // Fallback to empty structure
  }
};

// Fetch videos from Twitch
export const fetchVideosFromTwitch = async (
  accessToken: string,
  userId: string
): Promise<TwitchVideo[] | "No Previous videos"> => {
  try {
    const response = await axios.get<{ data: TwitchVideo[] }>(
      `${TWITCH_API_BASE}/videos?user_id=${userId}&type=archive`,
      {
        headers: getTwitchHeaders(accessToken),
      }
    );
    const videos = response.data.data;
    return videos.length > 0 ? videos : "No Previous videos";
  } catch (error) {
    console.error("Error fetching videos from Twitch:", error);
    return "No Previous videos";
  }
};
