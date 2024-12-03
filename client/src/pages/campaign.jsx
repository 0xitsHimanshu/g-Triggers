import  { useState, useEffect } from "react";
import supabase from "../utils/supabase";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      // Fetch all campaigns from the database
      const { data, error } = await supabase.from("campaigns").select("*");

      if (error) console.error("Error fetching campaigns:", error.message);
      else setCampaigns(data || []);
    };

    fetchCampaigns();
  }, []);

  return (
    <Box sx={{ pt: 2, pl : 2}}>
      <Typography variant="h5">Available Campaigns</Typography>
      {campaigns.map((campaign) => (
        <Card key={campaign.id} style={{ margin: "10px 0" }}>
          <CardContent>
            <Typography>Brand: {campaign.brand}</Typography>
            <Typography>Description: {campaign.description}</Typography>
            <Typography>Payout: ${campaign.payout}</Typography>
            <Button variant="contained" color="primary">
              Apply
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Campaigns;
