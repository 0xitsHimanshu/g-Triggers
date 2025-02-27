// app/api/widget/[id]/route.ts
import { NextResponse } from 'next/server';
import type { CampaignData } from '@/types/widget.types';

// Simulated mapping of user IDs to selected campaign data.
const userCampaignMapping: Record<string, CampaignData> = {
  'user123': {
    mediaType: 'video',
    mediaUrl: '/media/dominos-Ads.mp4', // Must exist in your public/media folder
    title: 'Sponsored by Campaign A for user123',
    description: 'Amazing deals provided for campaign user123!',
    interactiveUrl: 'https://example.com/interactive-content',
    duration: 20, // visible for 20 seconds
    "campaign-styles": {
      opacity: 1,
      width: "150px",
      height: "150px",
      top: "20px",
      left: "20px",
      "z-index": "9999"
    },
    breaktimespan: "60sec"
  },
};

// Default campaign if the user has not selected one.
const defaultCampaign: CampaignData = {
  mediaType: 'image',
  mediaUrl: '/media/halloween.gif', // Must exist in public/media folder
  title: 'Default Sponsor',
  description: 'Check out our default sponsorship!',
  interactiveUrl: 'https://example.com/default-interactive',
  duration: 20, // visible for 10 seconds
  "campaign-styles": {
    opacity: 1,
    width: "100px",
    height: "100px",
    top: "20px",
    left: "20px",
    "z-index": "9999"
  },
  breaktimespan: "60sec"
};

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  // Lookup the user's campaign; if not found, use the default campaign.
  const campaignData = userCampaignMapping[id] || defaultCampaign;

  // Convert the campaign styles object to an inline CSS string.
  const styleObj = campaignData["campaign-styles"];
  const inlineStyles = `
    opacity: ${styleObj.opacity};
    width: ${styleObj.width};
    height: ${styleObj.height};
    top: ${styleObj.top};
    left: ${styleObj.left};
    z-index: ${styleObj["z-index"]};
  `;

  // Parse break time (assuming format like "10mins" or "60sec")
  let breakTimeMs = 600000; // default 10mins in ms
  const breakStr = campaignData.breaktimespan;
  if (breakStr.endsWith("mins")) {
    breakTimeMs = parseInt(breakStr) * 60 * 1000;
  } else if (breakStr.endsWith("sec")) {
    breakTimeMs = parseInt(breakStr) * 1000;
  }

  // Convert the duration to milliseconds.
  const durationMs = campaignData.duration * 1000;

  // Construct the self-contained HTML document.
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Widget ${id}</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background: transparent;
          }
          .widget-container {
            position: absolute;
            ${inlineStyles}
            font-family: Arial, sans-serif;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="widget-container" id="widgetContainer">
          ${
            campaignData.mediaType === 'video'
              ? `<video autoplay muted loop class="media-renderer">
                   <source src="${campaignData.mediaUrl}" type="video/mp4" />
                   Your browser does not support the video tag.
                 </video>`
              : campaignData.mediaType === 'interactive'
              ? `<iframe class="media-renderer" src="${campaignData.interactiveUrl || campaignData.mediaUrl}" frameborder="0" scrolling="no" title="Interactive Sponsor"></iframe>`
              : `<img class="media-renderer" src="${campaignData.mediaUrl}" alt="Sponsor Media" />`
          }
          <h3>${campaignData.title}</h3>
          <p>${campaignData.description}</p>
        </div>
        <script>
          (function() {
            // Timing values (in ms)
            var duration = ${durationMs};
            var breakTime = ${breakTimeMs};
            var widgetContainer = document.getElementById('widgetContainer');

            // Function to hide widget, then re-show it after break time.
            function cycleWidget() {
              widgetContainer.style.display = 'none';
              setTimeout(function() {
                widgetContainer.style.display = 'block';
                setTimeout(cycleWidget, duration);
              }, breakTime);
            }

            // Start the cycle after the initial duration.
            setTimeout(cycleWidget, duration);

            // Optional: Real-time updates via WebSocket.
            var ws = new WebSocket('ws://localhost:4000'); // Replace with your WebSocket endpoint.
            ws.onmessage = function(event) {
              try {
                var updatedData = JSON.parse(event.data);
                var newContent = '';
                if (updatedData.mediaType === 'video') {
                  newContent = '<video class="media-renderer" controls loop muted><source src="' + updatedData.mediaUrl + '" type="video/mp4" />Your browser does not support the video tag.</video>';
                } else if (updatedData.mediaType === 'interactive') {
                  newContent = '<iframe class="media-renderer" src="' + (updatedData.interactiveUrl || updatedData.mediaUrl) + '" frameborder="0" scrolling="no" title="Interactive Sponsor"></iframe>';
                } else {
                  newContent = '<img class="media-renderer" src="' + updatedData.mediaUrl + '" alt="Sponsor Media" />';
                }
                widgetContainer.innerHTML = newContent + '<h3>' + updatedData.title + '</h3><p>' + updatedData.description + '</p>';
              } catch (err) {
                console.error('WebSocket update error:', err);
              }
            };
            ws.onerror = function(error) {
              console.error('WebSocket connection error:', error);
            };
          })();
        </script>
      </body>
    </html>
  `;

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
}