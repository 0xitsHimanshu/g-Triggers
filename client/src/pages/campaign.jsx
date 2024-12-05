import  { useEffect, useState } from "react";
import { fetchCampaigns, addCampaign } from "../utils/api";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    brand: "",
    description: "",
    payout: "",
  });

  useEffect(() => {
    const getCampaigns = async () => {
      setLoading(true);
      try {
        const data = await fetchCampaigns();
        setCampaigns(data);
      } catch (err) {
        console.error("Error loading campaigns:", err.message);
      } finally {
        setLoading(false);
      }
    };

    getCampaigns();
  }, []);

  const handleAddCampaign = async () => {
    try {
      await addCampaign(newCampaign);
      alert("Campaign added successfully!");
      setCampaigns((prev) => [...prev, newCampaign]);
      setNewCampaign({ brand: "", description: "", payout: "" });
    } catch (err) {
      console.error("Error adding campaign:", err.message);
    }
  };

  return (
    <div>
      <h1>Campaigns</h1>
      {loading ? (
        <p>Loading campaigns...</p>
      ) : (
        <ul>
          {campaigns.map((campaign, index) => (
            <li key={index}>
              {campaign.brand} - ${campaign.payout}
            </li>
          ))}
        </ul>
      )}
      <h2>Add New Campaign</h2>
      <input
        type="text"
        placeholder="Brand"
        value={newCampaign.brand}
        onChange={(e) => setNewCampaign({ ...newCampaign, brand: e.target.value })}
      />
      <input
        type="text"
        placeholder="Description"
        value={newCampaign.description}
        onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
      />
      <input
        type="number"
        placeholder="Payout"
        value={newCampaign.payout}
        onChange={(e) => setNewCampaign({ ...newCampaign, payout: e.target.value })}
      />
      <button onClick={handleAddCampaign}>Add Campaign</button>
    </div>
  );
};

export default Campaigns;
