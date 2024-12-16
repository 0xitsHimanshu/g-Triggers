// File: components/UserDetails.tsx
'use client';

import { useState, useEffect } from "react";

export default function UserDetails({ userData}: { userData: Object}) {
  const [data, setData] = useState(userData);

  useEffect(() => {
    // Handle client-specific logic here (if needed)
  }, [userData]);

  return (
    <div className="flex flex-col gap-2 items-start">
      <h2 className="font-bold text-2xl mb-4">Your user details</h2>
      <pre className="text-xs font-mono p-3 rounded border max-h-full overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
