import axios from "axios";

export async function getTwitchUserDetails(accessToken: string) {
  try {
    const response = await axios.get("https://api.twitch.tv/helix/users", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Client-Id": process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID,
      },
    });
    return response.data.data[0]; // User details
  } catch (error: unknown) {
    // console.error("Error fetching Twitch user details:", error.response?.data);
    // throw new Error("Failed to fetch Twitch user details");

    if (axios.isAxiosError(error)) {
        console.error("Error fetching Twitch user details:", error.response?.data);
        throw new Error("Failed to fetch Twitch user details");
      } else {
        console.error("Unknown error:", error);
        throw new Error("Unknown error");
      }
  }
}
