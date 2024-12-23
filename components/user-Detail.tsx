"use client";

import { useState, useEffect } from "react";

export default function UserDetails({ user }: { user: any }) {
  const [userData, setUserData] = useState(user);

  useEffect(() => {
    setUserData(user);
  }, [user]);

  return (
    <div className="flex flex-col gap-2 items-start">
      <h2 className="font-bold text-2xl mb-4">Your user details</h2>
      <pre
        className="text-xs text-wrap font-mono p-3 rounded border w-[780px] max-h-96 overflow-auto"
      >
        {JSON.stringify(userData, null, 2)}
      </pre>
    </div>
  );
}
