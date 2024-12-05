import axios from "axios";

const API_URL = "http://localhost:8000/api"; // Replace with your backend server's URL

// Function to fetch linked accounts for a user
export const fetchLinkedAccounts = async (userId) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/fetch-link-account`,
      {
        userID: userId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching linked accounts:", error.message);
    throw error;
  }
};

// Function to link a new account
export const linkAccount = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/auth/link-account`, data);
    return response.data;
  } catch (error) {
    console.error("Error linking account:", error.message);
    throw error;
  }
};

// Function to fetch campaigns
export const fetchCampaigns = async () => {
  try {
    const response = await axios.get(`${API_URL}/campaign/get-campaign`);
    return response.data;
  } catch (error) {
    console.error("Error fetching campaigns:", error.message);
    throw error;
  }
};

// Function to add a new campaign
export const addCampaign = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/campaign/add`, data);
    return response.data;
  } catch (error) {
    console.error("Error adding campaign:", error.message);
    throw error;
  }
};
