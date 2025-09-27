import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pcmtmytwagbhlgejayrc.supabase.co"; // from Project URL
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjbXRteXR3YWdiaGxnZWpheXJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NjEwNzIsImV4cCI6MjA3MzQzNzA3Mn0.EFavq7-MtSxtnuQSGiXa0C1FT-31z244xzURHaFycRo";      // from Settings → API

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
