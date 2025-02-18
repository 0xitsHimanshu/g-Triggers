// components/MediaRenderer.tsx
import { CampaignData } from '@/types/widget.types';
import React from 'react';


interface MediaRendererProps {
  campaign: CampaignData;
}

const MediaRenderer: React.FC<MediaRendererProps> = ({ campaign }) => {
  const { mediaType, mediaUrl, interactiveUrl } = campaign;

  switch (mediaType) {
    case 'image':
    case 'gif':
      return <img className="media-renderer" src={mediaUrl} alt="Sponsor Media" />;
    case 'video':
      return (
        <video className="media-renderer" controls loop muted>
          <source src={mediaUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    case 'interactive':
      // For interactive banners, you might want to embed an iframe
      // which loads the interactiveUrl (if provided) or mediaUrl.
      return (
        <iframe
          className="media-renderer"
          src={interactiveUrl || mediaUrl}
          frameBorder="0"
          scrolling="no"
          allow="autoplay; encrypted-media"
          title="Interactive Sponsor"
        />
      );
    default:
      return null;
  }
};

export default MediaRenderer;
