import { useContext, useEffect, useState } from "react";
import { fetchLinkedAccounts, linkAccount } from "../utils/api";
import { UserContext } from "../context/userContext";

const LinkedAccounts = () => {
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const userId = user?.id // Replace with Supabase-authenticated user ID

  const  data = JSON.parse(localStorage.getItem('sb-ufxfrxsvuuvvthpxvbnz-auth-token')) 

  const mockData = {
    userId: data.user.id,
    provider: data.user.app_metadata.provider , // Example: Google
    accessToken: data.access_token ,
    refreshToken: data.refresh_token,
  };


  
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
  
  const handleLinkAccount = async (accountData) => {
    // console.log(data)
    try {
      await linkAccount(accountData);
      alert("Account linked successfully!");
      setLinkedAccounts((prev) => [...prev, accountData]); // Update state
    } catch (err) {
      console.error("Error linking account:", err.message);
    }
  };
  
  return (
    <div className="flex flex-col m-2 p-3">
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
      <button onClick={() => handleLinkAccount(mockData)}>Link New Account</button>
    </div>
  );
};

export default LinkedAccounts;
