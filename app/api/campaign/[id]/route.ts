// app/api/campaign/[id]/route.ts
import { CampaignData } from '@/types/widget.types';
import { NextResponse } from 'next/server';


export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Simulated campaign data; you can vary mediaType to "image", "gif", "video", or "interactive"
  const campaignData: CampaignData = {
    mediaType: 'image', // Change to test other types: "video", "interactive", etc.
    mediaUrl: 'http://localhost:3000/media/halloween.gif',
    title: 'Sponsored by XYZ',
    description: 'Amazing deals from sponsor XYZ!',
    interactiveUrl: 'https://example.com/interactive'
  };

  return NextResponse.json(campaignData);
}
