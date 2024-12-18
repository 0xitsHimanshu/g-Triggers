// File: components/UserDetails.tsx
'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function UserDetails({ userData}: { userData: Object}) {
  const [Data, setData] = useState(userData);
  const { data: session } = useSession();
  
  console.log(session)

  return (
    <div className="flex flex-col gap-2 items-start">
      <h2 className="font-bold text-2xl mb-4">Your user details</h2>
      <pre className="text-xs font-mono p-3 rounded border max-h-96 overflow-auto">
        {JSON.stringify(Data, null, 2)}
      </pre>

    </div>
  );
}
