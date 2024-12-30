import axios from "axios";

const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;

if (!clientId) {
    throw new Error("NEXT_PUBLIC_TWITCH_CLIENT_ID environment variable is not set");
}

export const fetchUserDataFromTwitch = async (accessToken: string, userId: string) => {
    const response = await axios.get(`https://api.twitch.tv/helix/users?id=${userId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            "Client-Id": clientId,
        }
    })

    const data = response.data.data[0];
    return data;
}

