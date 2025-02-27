// types/widget.ts
export type MediaType = 'image' | 'gif' | 'video' | 'interactive';

export interface CampaignData {
  mediaType: MediaType;
  mediaUrl: string;
  title: string;
  description: string;
  interactiveUrl?: string;
  duration: number;
  "campaign-styles": {
    opacity: number;
    width: string;
    height: string;
    top: string;
    left: string;
    "z-index": string;
  },
  breaktimespan: string; // e.g., "10mins" or "60sec"
}