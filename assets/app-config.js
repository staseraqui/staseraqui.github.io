// assets/app-config.js — CONFIG UNICA (con prezzi in vetrina)
window.SQ_CONFIG = {
  // Supabase
  SUPABASE_URL: "https://rubdzlnolxcgpjklfggk.supabase.co",
  SUPABASE_ANON: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1YmR6bG5vbHhjZ3Bqa2xmZ2drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4OTI3NjQsImV4cCI6MjA3MjQ2ODc2NH0.Fhq7lKdx1OcyuCWOnHqNH7Omsg7qjdQVzxvNqZyeQQ8",

  // Google Maps
  GOOGLE_MAPS_API_KEY: "AIzaSyCfLAJyhmA_lu6jP0Y1GbgVTvSn2nIICsg",

  // Prezzi mostrati in “Prezzi & Condizioni”
  PRICE_SINGLE_EUR: 9,
  PRICE_MULTI_EUR: 14
};

// (opzionale) alias per eventuale codice vecchio
window.SQ = window.SQ || window.SQ_CONFIG;
