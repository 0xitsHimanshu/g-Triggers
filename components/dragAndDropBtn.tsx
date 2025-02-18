// components/DragAndDropButton.tsx
'use client'

import React from "react";

interface DragAndDropButtonProps {
  widgetUrl: string;
}

const DragAndDropButton: React.FC<DragAndDropButtonProps> = ({ widgetUrl }) => {
  // Handle drag start event
  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>) => {
    // Set the widget URL as the data to be transferred during drag
    e.dataTransfer.setData("text/plain", widgetUrl);
  };

  return (
    <div className="flex justify-center mt-8">
      <button
        draggable
        onDragStart={handleDragStart}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg"
      >
        Drag me to OBS
      </button>
    </div>
  );
};

export default DragAndDropButton;
