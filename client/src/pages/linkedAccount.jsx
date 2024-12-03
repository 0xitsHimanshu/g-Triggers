import { useEffect, useState } from "react";

const LinkedAccounts = () => {
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = "example-user-id"; // Replace with Supabase-authenticated user ID

  useEffect(() => {
    const getAccounts = async () => {
      setLoading(true);
      try {
        const accounts = await fetchLinkedAccounts(userId);
        setLinkedAccounts(accounts);
      } catch (err) {
        console.error("Failed to load linked accounts:", err.message);
      } finally {
        setLoading(false);
      }
    };

    getAccounts();
  }, [userId]);

  const handleLinkAccount = async () => {
    const newAccount = {
      userId,
      provider: "google", // Example: Google
      accessToken: "example-access-token",
      refreshToken: "example-refresh-token",
    };

    try {
      await linkAccount(newAccount);
      alert("Account linked successfully!");
      setLinkedAccounts((prev) => [...prev, newAccount]); // Update state
    } catch (err) {
      console.error("Error linking account:", err.message);
    }
  };

  return (
    <div>
      <h1>Linked Accounts</h1>
      {loading ? (
        <p>Loading accounts...</p>
      ) : (
        <ul>
          {linkedAccounts.map((account, index) => (
            <li key={index}>{account.provider}</li>
          ))}
        </ul>
      )}
      <button onClick={handleLinkAccount}>Link New Account</button>
    </div>
  );
};

export default LinkedAccounts;