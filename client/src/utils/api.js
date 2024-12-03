import axios from 'axios';

const API_URL = "http://localhost:8000";

export const linkAccount = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/link-account`, data);
        return response.data;
    } catch (error) {
        console.error("Error fetching linked accounts:", error.message);
        throw error;
    }
}

export const fetchCampaigns = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/campaigns/get-campaign`);
        return response.data;
    } catch (error) {
        console.error("Error fetching campaigns:", error.message);
        throw error;
    }
}

export const addCampaign = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/api/campaigns/add`, data);
        return response.data;
    } catch (error) {
        console.error("Error adding campaign:", error.message);
        throw error;
    }
}