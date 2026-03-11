import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://omkdgbgghyxzmfuwiihv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ta2RnYmdnaHl4em1mdXdpaWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MzM3ODMsImV4cCI6MjA4ODQwOTc4M30.xNc_q_Eyt9k9LICqAkAsXTPoaMj-LOW6yRoWBn_MiNk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// #s1v1g2#@COM.