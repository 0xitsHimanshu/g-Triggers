// types/widget.ts
export type MediaType = 'image' | 'gif' | 'video' | 'interactive';

export interface CampaignData {
  mediaType: MediaType;
  mediaUrl: string;
  title: string;
  description: string;
  interactiveUrl?: string;
}