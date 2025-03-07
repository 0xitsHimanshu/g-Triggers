'use client';

import { useEffect, useState } from "react";

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function calculateTimeLeft() {
      const now = new Date();
      let nextReset = new Date();
      // Set the time to 5:30 AM today.
      nextReset.setHours(5, 30, 0, 0);

      // If the current time is after 5:30 AM, the next reset is tomorrow.
      if (now >= nextReset) {
        nextReset.setDate(nextReset.getDate() + 1);
      }

      const diff = nextReset.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return `${hours}h ${minutes}m ${seconds}s`;
    }

    // Update the countdown every second.
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Initial calculation.
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center">
      <p className="text-lg">
        Time until streak reset: <span className="font-mono">{timeLeft}</span>
      </p>
    </div>
  );
}
