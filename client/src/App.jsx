import  { useEffect, useState } from 'react';
import supabase from './utils/supabase';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Campaigns from './pages/campaign';
import LinkedAccounts from './pages/linkedAccount';
import { Box, Button, Typography } from "@mui/material";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    //const session = supabase.auth.session();
    const getSession = async () => {
      const { data: { session }} = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    getSession();    

    const { data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      
    });

    return () => {
      if(subscription) subscription.unsubscribe();
    };
  }, []);

  const login = async (provider) => {
    const twitchScopes = 'user:read:email user:read:broadcast analytics:read:games moderator:read:followers';
    const googleScopes =  'https://www.googleapis.com/auth/youtube.readonly';


    const { error } = await supabase.auth.signInWithOAuth({
      provider, // 'google' for YouTube or 'twitch'
      options: {
        scopes: provider === 'twitch' ? twitchScopes : googleScopes,
      },
    });
    if (error) console.error('Error logging in:', error.message);
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Router>
      <Box p={3} sx={{ borderBottom: 1 }}>
        {user ? (
          <>
            <Typography variant="h5">Welcome, {user.email}</Typography>
            <Button variant="contained" onClick={logout}>
              Logout
            </Button>
            <Box mt={2}>
              <Link to="/linked-accounts" style={{ marginRight: 10 }}>Linked Accounts</Link>
              <Link to="/campaigns">Campaigns</Link>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h6">Login to your account</Typography>
            <Button variant="contained" onClick={() => login("google")}>
              Login with Google
            </Button>
            <Button variant="contained" onClick={() => login("twitch")} style={{ marginLeft: 10 }}>
              Login with Twitch
            </Button>
          </>
        )}
      </Box>

      <Routes>
        <Route path="/linked-accounts" element={<LinkedAccounts />} />
        <Route path="/campaigns" element={<Campaigns />} />
      </Routes>
    </Router>
  );
}

export default App;