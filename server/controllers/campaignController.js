import supabase from "../supabase.js";

// Get all campaigns
export const getAllCampaigns = async (req, res) => {
    try {
        // Get all rows from the 'campaigns' table
        const { data, error } = await supabase
            .from('campaigns')
            .select('*');
        // If there is an error, throw it
        if (error) throw error;
        // Return the data as JSON
        res.status(200).json(data);
    } catch (err) {
        // If there is an error, return a 500 status code and the error message
        res.status(500).json({ error: err.message });
    }
};

export const addCampaign = async (req, res) => {
    const { brand, description, payout } = req.body;
    try {
        // Insert a new row into the 'campaigns' table
        const { data, error } = await supabase
            .from('campaigns')
            .insert({ brand, description, payout });
        // If there is an error, throw it
        if (error) throw error;
        // Return the data as JSON
        res.status(200).json(data);
    } catch (err) {
        // If there is an error, return a 500 status code and the error message
        res.status(500).json({ error: err.message });
    }
}