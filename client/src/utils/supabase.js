import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ufxfrxsvuuvvthpxvbnz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmeGZyeHN2dXV2dnRocHh2Ym56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1MzQ4NzcsImV4cCI6MjA0NDExMDg3N30.OmLm67KQKuoyYp5eJqcd0gnsVItZuLRoToJtIbDSoH8";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
