import  { useEffect, useState } from 'react';
import supabase from './utils/supabase';

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
    <div>
      {user ? (
        <div>
          <h2>Welcome, {user.email}</h2>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <button onClick={() => login('google')}>Login with Google</button>
          <button onClick={() => login('twitch')}>Login with Twitch</button>
        </div>
      )}
    </div>
  );
}

export default App;