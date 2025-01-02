// file @/utils/twitch.ts

import axios from "axios";

// Ensure client ID is available
const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;

if (!clientId) {
  throw new Error("NEXT_PUBLIC_TWITCH_CLIENT_ID environment variable is not set");
}

// Fetch aggregate Twitch user data
export const fetchTwitchData = async (
  accessToken: string,
  userId: string
): Promise<TwitchUser & { followers: number; videos: TwitchVideo[] | string }> => {
  try {
    const userData = await fetchUserDataFromTwitch(accessToken, userId);
    const followersData = await fetchTwitchTotalFollowers(accessToken, userId);
    const videosData = await fetchVideosFromTwitch(accessToken, userId);

    return {
      ...userData,
      followers: followersData?.total ?? 0,
      videos: Array.isArray(videosData) && videosData.length > 0 ? videosData : "No Previous videos",
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
      `https://api.twitch.tv/helix/users?id=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Client-Id": clientId,
        },
      }
    );

    if (response.data.data.length === 0) {
      throw new Error(`No user found for ID: ${userId}`);
    }

    return response.data.data[0];
  } catch (error) {
    console.error("Error fetching user data from Twitch:", error);
    throw new Error("Failed to fetch Twitch user data");
  }
};

// Fetch current streams for a user
export const fetchAllStreams = async (
  accessToken: string,
  userName: string
): Promise<TwitchStream | "No Currently Streaming"> => {
  try {
    const response = await axios.get<{ data: TwitchStream[] }>(
      `https://api.twitch.tv/helix/streams?user_login=${userName}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Client-Id": clientId,
        },
      }
    );

    const data = response.data.data[0];
    return data || "No Currently Streaming";
  } catch (error) {
    console.error("Error fetching streams from Twitch:", error);
    throw new Error("Failed to fetch Twitch streams");
  }
};

// Fetch total followers for a user
export const fetchTwitchTotalFollowers = async (
  accessToken: string,
  userId: string
): Promise<TwitchFollowers> => {
  try {
    const response = await axios.get<TwitchFollowers>(
      `https://api.twitch.tv/helix/channels/followers?broadcaster_id=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Client-Id": clientId,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching followers data from Twitch:", error);
    return { total: 0, data: [] }; // Return default empty structure
  }
};

// Fetch archived videos for a user
export const fetchVideosFromTwitch = async (
  accessToken: string,
  userId: string
): Promise<TwitchVideo[] | "No Previous videos"> => {
  try {
    const response = await axios.get<{ data: TwitchVideo[] }>(
      `https://api.twitch.tv/helix/videos?user_id=${userId}&type=archive`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Client-Id": clientId,
        },
      }
    );

    const videos = response.data.data;
    return videos.length > 0 ? videos : "No Previous videos";
  } catch (error) {
    console.error("Error fetching videos from Twitch:", error);
    return [];
  }
};

