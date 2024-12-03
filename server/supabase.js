import {createClient} from '@supabase/supabase-js'
import { configDotenv } from 'dotenv';

configDotenv();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default supabase;