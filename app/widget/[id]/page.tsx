// app/widget/[id]/page.tsx
import WidgetClient from '@/components/WidgetClient';
import type { CampaignData } from '@/types/widget.types';

interface WidgetPageProps {
  params: { id: string };
}

async function getCampaignData(id: string): Promise<CampaignData> {
  const res = await fetch(`http://localhost:3000/api/campaign/${id}`, {
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
    <>
      {/* The custom widget layout will hide the global navbar */}
      <WidgetClient initialCampaign={campaignData} />
    </>
  );
};

export default WidgetPage;
