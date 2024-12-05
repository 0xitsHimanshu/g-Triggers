import supabase from '../supabase.js'


export const linkAccount = async (req, res) => {
    const {userId, provider, accessToken, refreshToken} = req.body
    try{
        const { error } = await supabase.from("linked_accounts").insert({
            user_id: userId,
            provider: provider,
            access_token: accessToken,
            refresh_token: refreshToken
        })
        if(error) throw error;

        res.status(200).json({message: "Account Linked Successfully"})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export const fetchLinkAccounts = async (req, res) => {
    const {userID} = req.body
    try{
        const { data, error } = await supabase.from("linked_accounts").select("*").eq("user_id", userID);
        if(error) throw error;
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}