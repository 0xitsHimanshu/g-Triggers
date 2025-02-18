// components/WidgetClient.tsx
'use client';

import React, { useEffect, useState } from 'react';
import type { CampaignData } from '@/types/widget.types';
import MediaRenderer from './mediaRendered';

interface WidgetClientProps {
  initialCampaign: CampaignData;
}

const WidgetClient: React.FC<WidgetClientProps> = ({ initialCampaign }) => {
  const [campaign, setCampaign] = useState<CampaignData>(initialCampaign);

  useEffect(() => {
    // Connect to your WebSocket endpoint (simulate with localhost or test endpoint)
    const ws = new WebSocket('ws://localhost:4000'); // Replace with your actual WebSocket URL

    ws.onmessage = (event) => {
      try {
        const updatedData: CampaignData = JSON.parse(event.data);
        setCampaign(updatedData);
      } catch (error) {
        console.error('Error parsing WebSocket data:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="widget-container">
      <MediaRenderer campaign={campaign} />
      <h3>{campaign.title}</h3>
      <p>{campaign.description}</p>
    </div>
  );
};

export default WidgetClient;
