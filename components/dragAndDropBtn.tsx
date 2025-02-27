// components/DragAndDropButton.tsx
'use client'

import React from "react";

interface DragAndDropButtonProps {
  widgetUrl: string;
}

const DragAndDropButton: React.FC<DragAndDropButtonProps> = ({ widgetUrl }) => {

  const testURL = `${widgetUrl}?layer-name=test-widget&layer-width=1920&layer-height=1080`;

  // Handle drag start event
  const handleDragStart = (e: React.DragEvent) => {
    // Set the widget URL as the data to be transferred during drag
    e.dataTransfer.setData("text/uri-list", testURL);
    e.dataTransfer.setData("text/plain", testURL);
  };

  return (
    <div className="flex justify-center mt-8">
      <a
        href={testURL}
        draggable
        onDragStart={handleDragStart}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg"
      >
        Drag me to OBS
      </a>
    </div>
  );
};

export default DragAndDropButton;
