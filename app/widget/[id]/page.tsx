// app/widget/[id]/page.tsx
import React from 'react';
import WidgetClient from '@/components/WidgetClient';
import { CampaignData } from '@/types/widget.types';

interface WidgetPageProps {
  params: { id: string };
}

async function getCampaignData(id: string): Promise<CampaignData> {
  // Fetch from your own ad-server API route
  const res = await fetch(`http://localhost:3000/api/campaign/${id}`, {
    // Ensure the fetch runs on the server (Next.js 13+ app router)
    cache: 'no-store'
  });
  if (!res.ok) {
    throw new Error('Failed to fetch campaign data');
  }
  return res.json();
}

const WidgetPage = async ({ params }: WidgetPageProps) => {
  const { id } = params;
  const campaignData = await getCampaignData(id);

  return (
    <html>
      <head>
        <title>Widget {id}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          body {
            margin: 0;
            padding: 0;
            background: transparent;
          }
          .widget-container {
            position: absolute;
            top: 20px;
            right: 20px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            text-align: center;
          }
          .media-renderer {
            max-width: 300px;
            border: 2px solid #fff;
            border-radius: 8px;
            opacity: 0.9;
          }
          h3 {
            margin: 10px 0 5px;
            font-size: 1.2em;
            color: #333;
          }
          p {
            margin: 0;
            font-size: 1em;
            color: #555;
          }
        `}</style>
      </head>
      <body>
        {/* Render the client component; this part must be client-side */}
        <WidgetClient initialCampaign={campaignData} />
      </body>
    </html>
  );
};

export default WidgetPage;
