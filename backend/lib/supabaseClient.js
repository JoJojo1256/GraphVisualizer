require("dotenv").config();

console.log("URL:", process.env.SUPABASE_URL);

const { createClient } = require("@supabase/supabase-js");

// Use environment variables from .env.local (assumed to be available)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Simple test function to verify the connection
async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from("users").select("*").limit(1);
    if (error) throw error;
    console.log("Supabase connection successful:", data);
    return data;
  } catch (error) {
    console.error("Supabase connection error:", error);
    throw error;
  }
}

module.exports = { supabase, testSupabaseConnection };
