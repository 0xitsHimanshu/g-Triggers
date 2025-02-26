// app/api/widget/[id]/route.ts
import { NextResponse } from 'next/server';
import type { CampaignData } from '@/types/widget.types';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params;

  // Simulated campaign data.
  // In production, replace this with your ad-server API call.
  // const campaignData: CampaignData = {
  //   mediaType: 'image', // Change to 'gif', 'video', or 'interactive' as needed.
  //   mediaUrl: '/media/halloween.gif', // This file should be in your public/media folder.
  //   title: `Sponsored by ${id}`,
  //   description: `Amazing deals provided for campaign ${id}!`,
  //   interactiveUrl: 'https://example.com/interactive-content', // Only used if mediaType is "interactive".
  //   duration: 10,
  //   "campaign-styles": {
  //     opacity: 0.9,
  //     width: "100px",
  //     height: "100px",
  //     top: "20px",
  //     left: "20px",
  //     "z-index": "9999"
  //   }
  // };

  const campaignData: CampaignData = {
    mediaType: 'video', // Change to 'gif', 'video', or 'interactive' as needed.
    mediaUrl: '/media/dominos-Ads.mp4', // This file should be in your public/media folder.
    title: `Sponsored by ${id}`,
    description: `Amazing deals provided for campaign ${id}!`,
    interactiveUrl: 'https://example.com/interactive-content', // Only used if mediaType is "interactive".
    duration: 20,
    "campaign-styles": {
      opacity: 1,
      width: "100px",
      height: "100px",
      top: "20px",
      left: "20px",
      "z-index": "9999"
    }
  };


  /// Convert the campaign styles object to inline CSS string.
  const styleObj = campaignData["campaign-styles"];
  const inlineStyles = `
    opacity: ${styleObj.opacity};
    width: ${styleObj.width};
    height: ${styleObj.height};
    top: ${styleObj.top};
    left: ${styleObj.left};
    z-index: ${styleObj["z-index"]};
  `;

  // Create an HTML document that renders the widget and uses the duration parameter
  // to hide and re-display the widget periodically.
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
            transition: opacity 0.5s ease;
          }
          .widget-container img,
          .widget-container video,
          .widget-container iframe {
            max-width: 300px;
          }
        </style>
      </head>
      <body>
        <div class="widget-container" id="widget">
          ${
            campaignData.mediaType === 'video' ? `
            <video autoplay loop muted>
              <source src="${campaignData.mediaUrl}" type="video/mp4" />
              Your browser does not support the video tag.
            </video>` :
            campaignData.mediaType === 'interactive' ? `
            <iframe src="${campaignData.interactiveUrl || campaignData.mediaUrl}" frameborder="0" scrolling="no" title="Interactive Sponsor"></iframe>` :
            `<img src="${campaignData.mediaUrl}" alt="Sponsor Media" />`
          }
        </div>
        <script>
          (function() {
            // Duration in milliseconds
            var duration = ${campaignData.duration} * 1000;
            var widget = document.getElementById('widget');
            
            // Function to toggle widget visibility
            function toggleWidget() {
              if (widget.style.opacity === "0") {
                widget.style.opacity = "1";
              } else {
                widget.style.opacity = "0";
              }
            }
            
            // Hide widget after the duration, then re-show it
            setInterval(function() {
              toggleWidget();
            }, duration);
            
            // Optional: Setup WebSocket for real-time updates
            var ws = new WebSocket('ws://localhost:4000');
            ws.onmessage = function(event) {
              try {
                var updatedData = JSON.parse(event.data);
                // Update media based on the updated data
                var container = document.getElementById('widget');
                if(updatedData.mediaType && updatedData.mediaUrl) {
                  if(updatedData.mediaType === 'video') {
                    container.innerHTML = '<video controls loop muted><source src="' + updatedData.mediaUrl + '" type="video/mp4" />Your browser does not support the video tag.</video>';
                  } else if(updatedData.mediaType === 'interactive') {
                    container.innerHTML = '<iframe src="' + (updatedData.interactiveUrl || updatedData.mediaUrl) + '" frameborder="0" scrolling="no" title="Interactive Sponsor"></iframe>';
                  } else {
                    container.innerHTML = '<img src="' + updatedData.mediaUrl + '" alt="Sponsor Media" />';
                  }
                  container.innerHTML += '<h3>' + updatedData.title + '</h3>';
                  container.innerHTML += '<p>' + updatedData.description + '</p>';
                }
              } catch (err) {
                console.error('WebSocket error:', err);
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