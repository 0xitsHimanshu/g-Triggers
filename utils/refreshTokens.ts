import axios from "axios";

// Refresh Twitch Tokens
export async function refreshTwitchToken(refreshToken: string) {
  try {
    const response = await axios.post(
      "https://id.twitch.tv/oauth2/token",
      null,
      {
        params: {
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID,
          client_secret: process.env.NEXT_PUBLIC_TWITCH_CLIENT_SECRET,
        },
      }
    );
    return {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error refreshing Twitch token:", error.response?.data);
      throw new Error("Failed to refresh Twitch token");
    } else {
      console.error("Unknown error:", error);
      throw new Error("Unknown error");
    }
  }
}

// Refresh YouTube Tokens
export async function refreshYouTubeToken(refreshToken: string) {
  try {
    const response = await axios.post(
      "https://oauth2.googleapis.com/token",
      null,
      {
        params: {
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
        },
      }
    );
    return {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error refreshing Youtube token:", error.response?.data);
      throw new Error("Failed to refresh Youtube token");
    } else {
      console.error("Unknown error:", error);
      throw new Error("Unknown error");
    }
  }
}
